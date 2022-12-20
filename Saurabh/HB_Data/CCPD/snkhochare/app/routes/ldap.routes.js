// Configuring the ldap
var passport = require("passport");
const ldap = require("../controllers/ldap.controller.js");

module.exports = (app) => {
  app.use(passport.initialize());

  //app.post('/login', ldap.authenticateUser, ldap.authenticateOnce);
  app.post("/login", ldap.authenticateUser);
  app.post("/test-login", ldap.testAuthUser);
  app.post("/access-roles", ldap.getRolebaseAccess);
};
