import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);


  function handleMsg(e) {
    setMsg(e.target.value);
  }


  function handleFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const emails = rows.map((item) => item.A);

      console.log("Extracted Emails:", emails);
      setEmailList(emails);
    };

    reader.readAsArrayBuffer(file);
  }


  function send() {
    if (!msg || emailList.length === 0) {
      alert("Please enter a message and upload an email file.");
      return;
    }

    setStatus(true);
    axios
      .post("https://bulkmail-frontend-sand.vercel.app/sendmail", { msg, emailList })
      .then((res) => {
        if (res.data.success) {
          alert("Mail sent successfully!");
        } else {
          alert("Mail failed: " + res.data.error);
        }
        setStatus(false);
      })
      .catch((err) => {
        console.error("Error sending mail:", err);
        alert("Something went wrong!");
        setStatus(false);
      });
  }

  return (
    <>
      {/* Navbar */}
      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">Bulkmail</h1>
      </div>
          {/* Header section */}
      <div className="bg-blue-800 text-white text-center">
        <h1 className="font-medium px-5 py-3">
          We can help your business with sending multiple emails at once
        </h1>
      </div>

      {/* Main Section */}
      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-6">
        <textarea
          onChange={handleMsg}
          value={msg}
          className="w-[80%] h-32 py-2 px-2 border border-black rounded-md"
          placeholder="Enter your email text here"
        />


        <input
          onChange={handleFile}
          type="file"
          className="border-4 border-dashed py-4 px-4 mt-5 mb-3"
        />

        <p>Total Emails in the file: {emailList.length}</p>

        <button
          onClick={send}
          className="bg-blue-950 py-2 px-5 text-white font-medium rounded-md w-fit mt-5 hover:bg-blue-900 transition"
        >
          {status ? "Sending..." : "Send"}
        </button>
      </div>
      {/* Footer sections */}
      <div className="bg-blue-300 text-black text-center p-8"></div>
      <div className="bg-blue-200 text-black text-center p-8"></div>
  

    </>
  );
}

export default App;