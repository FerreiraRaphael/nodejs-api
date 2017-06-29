import { Strategy } from "passport-http-bearer";
import jwt from "jsonwebtoken";
import config from "../../tools/config";

const BearerStrategy = new Strategy((token, done) => {
  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err) {
      return done(null, {
        success: false,
        message: "Failed to authenticate token."
      });
    }
    return done(null, decoded);
  });
});

export default BearerStrategy;
