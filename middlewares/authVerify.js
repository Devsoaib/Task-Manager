const jwt = require('jsonwebtoken');

exports.checkLogin = (req, res, next) => {

    try {
      const decoded = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );

      req.user = decoded;
      // console.log(decoded);
      next();
    } catch (error) {
        // next("authentication failed");
        res.status(401).json({
            error: "authentication failed",
        })
    }
}