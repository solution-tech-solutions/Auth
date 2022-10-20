import config from "config";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import listEndpoints from "express-list-endpoints";
import http from "http";
import "reflect-metadata";
import { startApolloServer } from "./graphql";
import { connectToMongo } from "./utils/mongo";
dotenv.config();

async function mainServer() {
  const graphqlPath = "/graphql";
  const PORT = parseInt(config.get<string>("port"));
  const corsOptions = {
    origin: [
      "http://localhost:4000",
      "http://localhost:4000/graphql",
      "https://studio.apollographql.com",
      "ws://localhost:4000/graphql"
    ],
    credentials: true
  };

  // Init express
  const app = express();
  app.use(cors<Request>(corsOptions));
  app.use(cookieParser());
  app.use(express.json());

  // Create the apollo server
  await startApolloServer({ app, graphqlPath, corsOptions }); // TODO: find out how to pass CORS options

  app.get("/", (req: Request, res: Response) => {
    console.log(req.body);
    res.send("hello ❤️");
  });

  // app.listen on express server
  const httpServer = http.createServer(app);
  httpServer.listen({ port: 4000 }, () => {
    console.table(listEndpoints(app));
    console.log(`🚀 Server ready at http://localhost:${PORT}${graphqlPath}`);
  });
  httpServer.setTimeout(1000 * 60 * 5); // Syncs can take a long time. default is 2 minutes

  connectToMongo();
}

mainServer().catch((Error) => {
  console.log(Error);
});
