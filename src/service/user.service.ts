import { ApolloError } from "apollo-server-errors";
import bcrypt from "bcrypt";
import config from "config";
import { UserModel } from "../schema/index";
import { CreateUserInput, LoginInput, User } from "../schema/user.schema";
import Context from "../types/context";
import { signJwt } from "../utils/jwt";
const privateKey = config.get<string>("privateKey");
class UserService {
  async createUser(input: CreateUserInput) {
    return UserModel.create(input);
  }

  async login(input: LoginInput, context: Context) {
    const e = "Invalid email or password";

    // Get our user by email
    const user = await UserModel.find().findByEmail(input.email).lean();

    if (!user) {
      throw new ApolloError(e);
    }

    // validate the password
    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new ApolloError(e);
    }

    // sign a jwt
    const token = signJwt(user);

    // set a cookie for the jwt
    context.res.cookie("accessToken", token, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });

    // return the jwt
    return token;
  }

  async logout(context: Context & { user: User }) {
    if (context.req.cookies.accessToken) {
      context.res.cookie("accessToken", "", { maxAge: -1 });
      return true;
    }
    console.log(context.req.cookies.accessToken);
    return true;
  }
}

export default UserService;
