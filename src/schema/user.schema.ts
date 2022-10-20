import {
  index,
  pre,
  prop as Property,
  queryMethod,
  ReturnModelType
} from "@typegoose/typegoose";
import { AsQueryMethod } from "@typegoose/typegoose/lib/types";
import bcrypt from "bcrypt";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import {
  Field as GqlField,
  InputType as GqlInput,
  ObjectType as GqlType
} from "type-graphql";

function findByEmail(
  this: ReturnModelType<typeof User, UserQueryHelpers>,
  email: User["email"]
) {
  return this.findOne({ email });
}

export interface UserQueryHelpers {
  findByEmail: AsQueryMethod<typeof findByEmail>;
}

@pre<User>("save", async function () {
  // Check that the password is being modified
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hashSync(this.password, salt);

  this.password = hash;
})
@index({ email: 1 }, { unique: true })
@queryMethod(findByEmail)
@GqlType()
export class User {
  @GqlField(() => String) // graphql type
  readonly _id: string; // typescript type

  @GqlField(() => String)
  @Property({ required: true }) // mongo type
  name: string;

  @GqlField(() => String)
  @Property({ required: true })
  email: string;

  @GqlField(() => String)
  @Property({ required: false, unique: true })
  phoneNumber: string;

  @GqlField(() => String)
  @Property({ required: true })
  address: string;

  @GqlField(() => Boolean)
  isActive: boolean;

  @GqlField(() => String)
  @Property({ required: false })
  lastSeen: string;

  // @GqlField(() => [Order])
  // @Property({ nullable: true })
  // orderHistory?: Ref<Order>[];

  @Property({ required: true })
  password: string;
}

// export const UserModel = getModelForClass<typeof User, UserQueryHelpers>(User);

@GqlInput()
export class CreateUserInput {
  @GqlField(() => String)
  name: string;

  @GqlField(() => String)
  address: string;

  @IsEmail()
  @GqlField(() => String)
  email: string;

  @MinLength(6, {
    message: "password must be at least 6 characters long"
  })
  @MaxLength(50, {
    message: "password must not be longer than 50 characters"
  })
  @GqlField(() => String)
  password: string;
}

@GqlInput()
export class LoginInput {
  @GqlField(() => String)
  email: string;

  @GqlField(() => String)
  password: string;
}
