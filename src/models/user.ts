import mongoose from "mongoose";
import { PasswordHelper } from "../helpers/password";

interface UserAttrs {
  email: string;
  password: string;
}
// an interface that describes the properties that user model has

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the properties that user document has

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

userSchema.pre("save", async function (done) {
  // იუზრის აფდეითის დროს რო არ გაეშვას
  if (this.isModified("password")) {
    const hash = await PasswordHelper.toHash(this.get("password"));

    this.set("password", hash);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
