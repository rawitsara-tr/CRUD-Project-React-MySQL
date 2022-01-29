const util = require("util");
const mysql = require("mysql2");
// connection to mysql database
const dbCon = mysql.createConnection({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "12345",
  database: "fruit_data_3",
});

// Promisify for Node.js async/await.
dbCon.query = util.promisify(dbCon.query);

dbCon.connect();
module.exports = dbCon;
