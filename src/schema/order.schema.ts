import { index, prop, Ref } from "@typegoose/typegoose";
import { IsNumber, Min } from "class-validator";
import { customAlphabet } from "nanoid";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "./user.schema";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz123456789", 10);

@ObjectType()
@index({ OrderId: 1 })
export class Order {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  orderNumber: string;

  @Field(() => String)
  @prop({ required: true, ref: () => User }) // ref to user
  user: Ref<User>;

  @Field(() => String)
  @prop({ required: true })
  deliveryAddress: string;

  @Field(() => String)
  @prop({ required: true })
  price: string;

  @Field(() => String)
  @prop({ required: true, default: () => `product_${nanoid()}`, unique: true })
  orderId: string;
}

@InputType()
export class CreateOrderInput {
  @Field()
  orderNumber: string;

  @Field()
  deliveryAddress: string;

  @IsNumber()
  @Min(1)
  @Field()
  price: number;
}

@InputType()
export class GetOrderInput {
  @Field()
  OrderId: string;
}
