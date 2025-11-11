require("dotenv").config();
const { Sequelize } = require("sequelize");

const host = process.env.DB_HOST || "";
const isLocal = host.includes("localhost");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: host,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: isLocal
      ? {} // Local sem SSL
      : {
          ssl: {
            require: true,
            rejectUnauthorized: false, // <--- aceita certificado autoassinado
          },
        },
  }
);

module.exports = sequelize;
