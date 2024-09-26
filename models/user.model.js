import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const UserSchema = new Schema({
  id: {
    type: String,
    unique: true, // Ensure this is set to true
    required: true, // Required to prevent null values
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

// Before saving the user, hash the password
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10); // Salt and hash password
  }
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
