import dotenv from "dotenv";
dotenv.config();
export default {
  mongoConnectionUri: process.env.DB_URL || "DB_URL"
};
