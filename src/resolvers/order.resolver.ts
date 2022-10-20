import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreateOrderInput, GetOrderInput, Order } from "../schema/order.schema";
import OrderService from "../service/order.service";
import Context from "../types/context";

@Resolver()
export default class ProductResolver {
  constructor(private orderService: OrderService) {
    this.orderService = new OrderService();
  }

  @Authorized()
  @Mutation(() => Order)
  createOrder(@Arg("input") input: CreateOrderInput, @Ctx() context: Context) {
    const user = context.user!;
    return this.orderService.createOrder({ ...input, user: user?._id });
  }

  @Query(() => [Order])
  orders() {
    return this.orderService.findOrders();
  }

  @Query(() => Order)
  order(@Arg("input") input: GetOrderInput) {
    return this.orderService.findSingleOrder(input);
  }
}
