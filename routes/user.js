const {Router} = require("express")
const User = require('../models/user')

const router = Router();

router.get("/signin", (req, res) => {
    return res.render("signin");
});


router.post("/signin", async (req, res) => {
    try {
        const {email, password} = req.body;
        const token = await User.matchPasswordAndgenerateToken(email, password)
    
        return res.cookie("token",token).redirect("/");

    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password"
        });
    }
})
router.get("/signup", (req, res) => {
    return res.render("signup");
})

router.post("/signup", async function (req, res) {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        // Show error message on signup page
        return res.render("signup", { error: "Email already registered", fullName, email });
    }
    await User.create({
        fullName,
        email,
        password
    });
    return res.redirect("/");
});

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/")
})

module.exports = router;