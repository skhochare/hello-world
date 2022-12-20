const ldap = require("ldapjs");

let client = null;

const connectLDAP = (url, username, password, successCB, errorCB) => {
  const options = {
    url,
  };
  client = ldap.createClient(options);
  if (client) {
    client.on("error", (error) => {
      errorCB(error);
    });
    client.on("connectRefused", () => {
      errorCB({ message: "Connection Refused" });
    });
    client.on("connectTimeout", () => {
      errorCB({ message: "Connection Timeout" });
    });
    client.on("connectError", () => {
      errorCB({ message: "Connection Error" });
    });
    client.on("setupError", () => {
      errorCB({ message: "Setup error while conenction" });
    });
    client.on("socketTimeout", () => {
      errorCB({ message: "Socket timeout" });
    });
    client.on("resultError", () => {
      errorCB({ message: "Result error" });
    });
    client.on("timeout", () => {
      errorCB({ message: "Timeout" });
    });
    client.bind(username, password, (error) => {
      if (error) {
        errorCB(error);
      } else {
        successCB(client);
      }
    });
  }
};

const disconnectLDAP = (callback) => {
  if (client && client.connected) {
    client.unbind(() => {
      if (callback) {
        callback();
      }
    });
  } else {
    if (callback) {
      callback();
    }
  }
};

const searchLDAP = (base, options) => {
  const promise = new Promise((resolve, reject) => {
    const data = [];
    client.search(base, options, (err, res) => {
      if (err) {
        reject(err);
      }
      res.on("error", (err) => {
        reject(err);
      });
      res.on("searchEntry", (entry) => {
        data.push(entry.object);
      });
      res.on("end", (result) => {
        resolve(data);
      });
    });
  });
  return promise;
};

const getLDAPClient = () => {
  return client;
};

module.exports = {
  getLDAPClient,
  connectLDAP,
  searchLDAP,
  disconnectLDAP,
};
