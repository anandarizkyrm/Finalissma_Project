export {};

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./routes/routes");
const upload = require("./controller/uploadFile");

require("dotenv").config();

const port = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", router);
app.use("/file", upload);
app.use('/file', express.static('file'));

app.listen(port, () => {
  console.log("Server is running on port 5000");
}); // listen on port 5000)))
