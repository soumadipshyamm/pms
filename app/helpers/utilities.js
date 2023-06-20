const crypto = require("crypto");
const key = "r34453r1twtdyteyquiyew2345fghfty";
const iv = crypto.randomBytes(16);
const {timezone} = require("../config")
const encodeBase64 = (data) => {
  return Buffer.from(data).toString("base64");
};
const decodeBase64 = (data) => {
  return Buffer.from(data, "base64").toString("ascii");
};
const dateFormatDDMMYYYY = (dateToBeFormatted) => {
  let date =
    new Date().getDate().toString().padStart(2, "0") +
    "-" +
    (new Date().getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    new Date().getFullYear();

  if (dateToBeFormatted != "") {
    date =
      new Date(dateToBeFormatted).getDate().toString().padStart(2, "0") +
      "-" +
      (new Date(dateToBeFormatted).getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      new Date(dateToBeFormatted).getFullYear();
  }
  return date;
};
const fullDatetimeFormat = (dateToBeFormatted) => {
  var date =
    new Date().getFullYear() +
    "-" +
    (new Date().getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    new Date().getDate().toString().padStart(2, "0") +
    " " +
    new Date().getHours().toString().padStart(2, "0") +
    ":" +
    new Date().getMinutes().toString().padStart(2, "0") +
    ":" +
    new Date().getSeconds().toString().padStart(2, "0");

  if (dateToBeFormatted != "") {
    date =
      new Date(dateToBeFormatted).getFullYear() +
      "-" +
      (new Date(dateToBeFormatted).getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      new Date(dateToBeFormatted).getDate().toString().padStart(2, "0") +
      " " +
      new Date(dateToBeFormatted).getHours().toString().padStart(2, "0") +
      ":" +
      new Date(dateToBeFormatted).getMinutes().toString().padStart(2, "0") +
      ":" +
      new Date(dateToBeFormatted).getSeconds().toString().padStart(2, "0");
  }
  return date;
};
const fullDatetimeFormatYYYYMMDDHHMMSS = (dateToBeFormatted) => {
  var date =
    new Date().getFullYear() +
    "-" +
    (new Date().getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    new Date().getDate().toString().padStart(2, "0") +
    " " +
    new Date().getHours().toString().padStart(2, "0") +
    ":" +
    new Date().getMinutes().toString().padStart(2, "0") +
    ":" +
    new Date().getSeconds().toString().padStart(2, "0");

  if (dateToBeFormatted != "") {
    date =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      new Date().getDate().toString().padStart(2, "0") +
      " " +
      new Date().getHours().toString().padStart(2, "0") +
      ":" +
      new Date().getMinutes().toString().padStart(2, "0") +
      ":" +
      new Date().getSeconds().toString().padStart(2, "0");
  }
  return date;
};
const fullDatetimeFormatDDMMYYYYHHIIAA = (dateToBeFormatted) => {
  var date =
    new Date().getFullYear() +
    "-" +
    (new Date().getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    new Date().getDate().toString().padStart(2, "0") +
    " " +
    new Date().getHours().toString().padStart(2, "0") +
    ":" +
    new Date().getMinutes().toString().padStart(2, "0") +
    ":" +
    new Date().getSeconds().toString().padStart(2, "0");

  if (dateToBeFormatted != "") {
    date =
      new Date(dateToBeFormatted).getFullYear() +
      "-" +
      (new Date(dateToBeFormatted).getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      new Date(dateToBeFormatted).getDate().toString().padStart(2, "0") +
      " " +
      new Date(dateToBeFormatted).getHours().toString().padStart(2, "0") +
      ":" +
      new Date(dateToBeFormatted).getMinutes().toString().padStart(2, "0") +
      ":" +
      new Date(dateToBeFormatted).getSeconds().toString().padStart(2, "0");
  }
  return date;
};
const convertTime24To12 = (time) => {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
};
const convertTime12To24 = (time12h) => {
  var [time, modifier] = time12h.split(" ");

  var [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }
  return hours + ":" + minutes;
};

//Encrypting text
const encryptText = (text) => {
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

// Decrypting text
const decryptText = function (text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
};
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
module.exports = {
  encodeBase64,
  decodeBase64,
  dateFormatDDMMYYYY,
  fullDatetimeFormat,
  convertTime24To12,
  convertTime12To24,
  encryptText,
  decryptText,
  fullDatetimeFormatDDMMYYYYHHIIAA,
  fullDatetimeFormatYYYYMMDDHHMMSS,
  slugify,
};
