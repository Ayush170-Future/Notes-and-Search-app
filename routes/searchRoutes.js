const router = require("express").Router();
const validateToken = require("../middleware/validateTokenHandler");
const limiter = require("../middleware/rateLimit")
const {getMatchingNotes} = require("../controllers/searchControllers");

router.use(validateToken);
router.use(limiter);

router.get('/', getMatchingNotes);

module.exports = router;