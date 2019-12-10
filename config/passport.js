const passport = require("passport");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local");

const Users = mongoose.model("Users");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = Users.findOne({ email });
        if (!user || !user.validatePassword(password)) {
          return done(null, false, {
            errors: ["email or password is invalid"]
          });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
