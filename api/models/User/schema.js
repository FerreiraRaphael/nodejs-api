import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

mongoose.Promise = global.Promise;
const schema = Schema({
  local: {
    email: String,
    password: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

schema.pre("save", async function hashPassword(next) {
  try {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified("local.password")) return next();

    const salt = await bcrypt.genSalt(10);
    // hash the password along with our new salt
    const hash = await bcrypt.hash(this.local.password, salt);

    // override the cleartext password with the hashed one
    this.local.password = hash;
    return next();
  } catch (e) {
    return next(e);
  }
});

schema.methods.validPassword = async password => {
  const valid = await bcrypt.compare(password, this.password);
  return valid;
};

const User = mongoose.model("User", schema);

export default User;
