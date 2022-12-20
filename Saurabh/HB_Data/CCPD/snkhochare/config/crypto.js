const CryptoJS = require("crypto-js");

exports.encrypt = (data) => {
  const ciphertext = CryptoJS.AES.encrypt(
    data,
    "cgSO2tyDlNfDgCk8w5oD"
  ).toString();
};

exports.decrypt = (data) => {
  const bytes = CryptoJS.AES.decrypt(data, "cgSO2tyDlNfDgCk8w5oD");
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};
