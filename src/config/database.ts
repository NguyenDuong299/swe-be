import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "14121611",
  database: "swe_db",
});
