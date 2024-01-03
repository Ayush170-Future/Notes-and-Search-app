const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP/user to 100 requests per windowMs
  keyGenerator: function (req) {
    return req.user.id; // use user ID as the key
  },
  handler: function (req, res, next) {
    res.status(429).json({
      error: {
        message: "Too many requests, please try again later.",
        details: "You have exceeded the limit of 50 API calls per 15 minutes for your account."
      }
    });
  },  
});

module.exports = limiter;