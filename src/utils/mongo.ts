import config from "config";
import mongoose from "mongoose";

export async function connectToMongo() {
  try {
    mongoose.connect(config.get("mongoConnectionUri"));

    mongoose.connection.on("connected", () => {
      // const { users } = mongoose.connection.collections;
      // users.drop();
      console.log("📊 Connected to Database❗️");
    });

    mongoose.connection.on("error", (error) => {
      console.log(`Error on connection 💣`, error);
    });
  } catch (error) {
    throw new Error(`Error on connection (${error})`);
  }
}
