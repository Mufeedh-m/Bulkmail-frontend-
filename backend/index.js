const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect("mongodb+srv://mufeedhm937_db_user:LcIlqKM8RgoK407E@cluster0.dg8wbkd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((error) => console.log("❌ Failed to connect to MongoDB:", error.message));


const credentialSchema = new mongoose.Schema(
  {
    user: String,
    pass: String,
  },
  { collection: "bulkmail" }
);

const Credential = mongoose.model("Credential", credentialSchema);

// Route for sending emails
app.post("/sendmail", async function (req, res) {
  const { msg, emailList } = req.body;

  try {
    // Fetch credentials from DB
    const creds = await Credential.findOne();
    if (!creds) {
      return res
        .status(400)
        .send({ success: false, error: "No credentials found in DB" });
    }

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: creds.user,
        pass: creds.pass, 
      },
    });

    
    for (let email of emailList) {
      await transporter.sendMail({
        from: creds.user,
        to: email,
        subject: "A message from Bulkmail App",
        text: msg,
      });
    }

    res.send({ success: true });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});


app.listen(3000, function () {
  console.log("🚀 Server running on http://localhost:3000");
});