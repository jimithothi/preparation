import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

// Avoid recompiling model if already defined
const User = models.User || model("User", UserSchema);
export default User;
