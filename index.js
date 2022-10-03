const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

dotenv.config();

app.use("/", (req, res, next) => {
  try {
    const encodedParams = new URLSearchParams();
    encodedParams.append("q", req?.body?.text);
    const options = {
      method: "POST",
      url: process.env.URL_DETECT,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": process.env.API_KEY,
        "X-RapidAPI-Host": process.env.API_HOST,
      },
      data: encodedParams,
    };
    axios
      .request(options)
      .then(function (response) {
        req.targetLan = response?.data;
        next();
      })
      .catch(function (error) {
        res.send(error.message);
        // console.log(error);
      });
  } catch (err) {
    res.send(err);
    // console.log(err);
  }
});

app.post("/", (req, res) => {
  const encodedParams = new URLSearchParams();
  encodedParams.append("q", req?.body?.text);
  encodedParams.append("target", req.body?.to);
  //   console.log(req.targetLan.data.detections[0]);
  if (req?.body?.form !== "") {
    encodedParams.append("source", req?.body?.form);
  } else {
    encodedParams.append("source", req.targetLan.data.detections[0].language);
  }
  try {
    const options = {
      method: "POST",
      url: process.env.URL_TRANSLATE,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": process.env.API_KEY,
        "X-RapidAPI-Host": process.env.API_HOST,
      },
      data: encodedParams,
    };
    axios
      .request(options)
      .then(function (response) {
        res.send(response.data);
      })
      .catch(function (error) {
        res.send(error?.message);
        // console.error(error);
      });
  } catch (err) {
    res.send(err.message);
    // console.error(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
