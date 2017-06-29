import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-http-bearer";
import User from "../api/models/User/schema";
import config from "./config";
// import { BearerStrategy } from "../api/services/auth";

const port = process.env.PORT || 8080;
const app = express();

mongoose.connect(config.DB_URL);

app.set("superSecret", config.SECRET);

passport.use(
  new Strategy((token, done) => {
    console.log("teste", token);
    jwt.verify(token, config.SECRET, (err, decoded) => {
      if (err) {
        return done(null, {
          success: false,
          message: "Failed to authenticate token."
        });
      }
      return done(null, decoded);
    });
  })
);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan("dev"));

console.log(`Staring web server at PORT: ${port}`);

app.get("/", (req, res) => {
  res.json({
    message: "welcome to the api"
  });
});

app.get(
  "/users",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (e) {
      res.json({ e });
    }
  }
);

app.get("/setup", async (req, res) => {
  // create a sample user
  const nick = new User({
    local: {
      email: "raphaelbsferreira+1@gmail.com",
      password: "admin"
    }
  });

  // save the sample user
  try {
    await nick.save();
    console.log("User saved successfully");
    res.json({ success: true });
  } catch (e) {
    throw e;
  }
});

app.post("/auth", async (req, res) => {
  try {
    const user = await User.findOne({ "local.email": req.body.email });
    console.log(user, req.body.email);
    if (!user) res.json({ sucess: false, message: "Wrong password or email" });

    const valid = await bcrypt.compare(req.body.password, user.local.password);

    if (!valid) res.json({ sucess: false, message: "Wrong password or email" });

    const token = jwt.sign(user, req.app.get("superSecret"), {
      expiresIn: 60 * 60 * 24 // expires in 24 hours
    });

    res.json({
      success: true,
      message: "Enjoy the token",
      token
    });
  } catch (error) {
    console.log("ERROR", error);
    res.json({ error });
  }
});

app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    const url = `http://localhost:${port}`;
    console.log(`Server listening at ${url}`);
  }
});
