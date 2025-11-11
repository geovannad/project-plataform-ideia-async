const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);

require("dotenv").config();

// Determinar configuração de SSL
const host = process.env.DB_HOST || "";
const isLocal = host.includes("localhost");

let dialectOptions = {};

if (!isLocal) {
  // Para banco em cloud (Aiven), usar SSL com certificado
  const caPath = process.env.DB_SSL_CA;
  
  dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      ca: caPath ? [caPath] : undefined,
    },
  };
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: host,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: dialectOptions,
  }
);

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
