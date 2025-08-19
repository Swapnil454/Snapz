const { validateToken } = require("../service/authentication");

function checkForAuthonticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]
        if(!tokenCookieValue){
            return next();
        }
        try {
            const Userpayload = validateToken(tokenCookieValue);
            req.user = Userpayload;
            return next();
        } catch (error) {
            return next();
        }

    }
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.render("signin"); // or return res.status(401).send("Unauthorized")
  }
  next();
}

module.exports = {
    checkForAuthonticationCookie,
    requireAuth,
}