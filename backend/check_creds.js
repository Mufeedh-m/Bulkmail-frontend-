const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://mufeedhm937_db_user:LcIlqKM8RgoK407E@cluster0.dg8wbkd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(async () => {
    console.log("Connected to MongoDB");

    const credentialSchema = new mongoose.Schema(
      {
        user: String,
        pass: String,
      },
      { collection: "bulkmail" }
    );

    const Credential = mongoose.model("Credential", credentialSchema);

    const creds = await Credential.findOne();
    console.log("Inserted/Updated credentials:", creds);

    if (creds) {
      console.log("User:", creds.user);
      console.log("Pass exists:", !!creds.pass);
    }

    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect or insert:", error.message);
  });