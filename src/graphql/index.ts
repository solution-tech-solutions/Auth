import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { Express } from "express";
import customContext from "./customContext";
import graphqlSchema from "./graphqlSchema";

//! ApolloServerPluginLandingPageLocalDefault (This is a plugin);

export async function startApolloServer({
  app,
  graphqlPath,
  corsOptions
}: {
  app: Express;
  graphqlPath: string;
  corsOptions?: any;
}) {
  const apolloServer = new ApolloServer({
    schema: await graphqlSchema,
    debug: true, // The stacktrace is removed by formatError.
    context: customContext,
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground()
    ],
    formatError,
    csrfPrevention: true,
    introspection: true
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: graphqlPath, cors: corsOptions }); // TODO: find out how to use cors
  return apolloServer;
}
function formatError(gqlError: any) {
  if (process.env.NODE_ENV === "production") {
    // Mask stack trace in production. This is needed
    // since debug is always true.
    if (gqlError.extensions) {
      delete gqlError.extensions.exception;
    }
  }
  console.log(gqlError); // TODO: Write a custom error logger
  // return err;
  if (gqlError.extensions?.code === "UNAUTHORIZED") {
    return new Error("Authentication required.");
  }

  return gqlError;
}
