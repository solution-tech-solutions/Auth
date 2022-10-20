import { OrderModel } from "../schema/index";
import { CreateOrderInput, GetOrderInput } from "../schema/order.schema";
import { User } from "../schema/user.schema";

class OrderService {
  async createOrder(input: CreateOrderInput & { user: User["_id"] }) {
    return OrderModel.create(input);
  }

  async findOrders() {
    // Pagination login
    return OrderModel.find().lean();
  }

  async findSingleOrder(input: GetOrderInput) {
    return OrderModel.findOne(input).lean();
  }
}

export default OrderService;
