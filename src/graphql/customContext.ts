import { User } from "../schema/user.schema";
import Context from "../types/context";
import { verifyJwt } from "../utils/jwt";

function customContext(ctx: Context) {
  const context = ctx;

  if (ctx.req.cookies.accessToken) {
    const user = verifyJwt<User>(ctx.req.cookies.accessToken);

    context.user = user;
    context.req.user = user;
  }

  // if (context.user === undefined) {
  //   throw new Error(`user missing from context`);
  // }

  return context;
}
export default customContext;
