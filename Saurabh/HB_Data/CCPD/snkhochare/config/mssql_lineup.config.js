const sql = require("mssql");
const { decrypt } = require("../config/crypto");

let user = decrypt(process.env.DB_USER_3);
let password = decrypt(process.env.DB_PASSWORD_3);
let server = decrypt(process.env.DB_SERVER_3);
let port = parseInt(process.env.DB_PORT_3);
let database = decrypt(process.env.DB_NAME_POSS_LINEUP_DB);

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
