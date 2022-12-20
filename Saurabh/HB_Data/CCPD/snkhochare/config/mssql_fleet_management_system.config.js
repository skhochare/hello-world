const sql = require("mssql");
const { decrypt } = require("../config/crypto");
let user = decrypt(process.env.DB_USER);
let password = decrypt(process.env.DB_PASSWORD);
let server = decrypt(process.env.DB_SERVER);
let port = parseInt(process.env.DB_PORT);
let database = decrypt(process.env.DB_NAME_FLEET_MANAGEMENT_SYSTEM);

const config = {
  user,
  password,
  server,
  port,
  database,
  //domain: 'CAMDENPD',
};

// Create a ms pool
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log(`Connected to MSSQL ${config.database}`);
    return pool;
  })
  .catch((err) =>
    console.log(
      `Database Connection ${config.database} Failed! Bad Config: `,
      err
    )
  );

module.exports = {
  sql,
  poolPromise,
};
