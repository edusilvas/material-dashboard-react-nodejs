import passport from "passport";

/**
 * AUTH GATE v2.0 - JOBFLOW ADMIN
 * Permite bypass total via variável de ambiente para agilidade operacional.
 */
export const adminAuth = (req, res, next) => {
  if (process.env.BYPASS_AUTH_GATE === "true") {
    console.log("[AUTH_GATE] Bypass ativado para rota:", req.originalUrl);
    return next();
  }
  
  return passport.authenticate("jwt", { session: false })(req, res, next);
};
