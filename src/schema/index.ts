import { getModelForClass } from "@typegoose/typegoose";
import { Order } from "./order.schema";
import { User, UserQueryHelpers } from "./user.schema";

export const UserModel = getModelForClass<typeof User, UserQueryHelpers>(User);
export const OrderModel = getModelForClass<typeof Order>(Order);
