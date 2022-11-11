import Sequelize from "sequelize"

//const Sequelize = require("sequelize").Sequelize

const mysql = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: "mysql",
    define: {
      underscored: true
    }
  }
)

mysql
  .authenticate()
  .then(() => {
    console.log("Connected to mysql database")
  })
  .catch((err) => {
    //console.error("Can't connect to database :(\n", err);
  })

export { mysql, Sequelize }
