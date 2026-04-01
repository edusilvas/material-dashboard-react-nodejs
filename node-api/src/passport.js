import passport from "passport";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import passportJwt from "passport-jwt";
import dotenv from "dotenv";

const { Strategy: JWTStrategy, ExtractJwt } = passportJwt;
import { userModel } from "./schemas/user.schema.js";
dotenv.config();

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "jobflow_secret_key",
    },
    function (jwtPayload, done) {
      return userModel
        .findOne({ _id: jwtPayload.id })
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL || "https://admin.jobflow.shop/api/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await userModel.findOne({ email });

        if (!user) {
          user = new userModel({
            name: profile.displayName,
            email: email,
            password: "linked_oauth_password_" + Math.random(), // Placeholder
            profileType: "USER",
            hasCompletedOnboarding: false,
            linkedIds: { linkedin: profile.id }
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
