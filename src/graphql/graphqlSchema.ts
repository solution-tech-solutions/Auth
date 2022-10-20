import { buildSchema } from "type-graphql";
import { resolvers } from "../resolvers/index";
import authChecker from "../utils/authChecker";

const schema = buildSchema({
  resolvers,
  validate: false,
  authChecker
});

export default schema;
