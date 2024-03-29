const router = require("express").Router();
const {registerUser, loginUser} = require("../controllers/userControllers");

router.route("/signup").post(registerUser);

router.route("/login").post(loginUser);

module.exports = router;