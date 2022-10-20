import OrderResolver from "./order.resolver";
import UserResolver from "./user.resolver";

export const resolvers = [UserResolver, OrderResolver] as const;
