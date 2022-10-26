// const admin = require("../config/firebase-config");
// class Middleware {
//   async decodeToken(req, res, next) {
//     console.log("decodeToken()");
//     console.log(typeof req.headers.authorization);

//     const token = req.headers.authorization.split(" ")[1];
//     try {
//       const decodeValue = await admin.auth().verifyIdToken(token);
//       console.log("decodeValue", decodeValue);
//       if (decodeValue) {
//         req.user = decodeValue;
//         return next();
//       }
//       return res.json({ message: "Unauthorized" });
//     } catch (e) {
//       return res.json({ message: `Internal Error ${e.message}` });
//     }
//   }
// }

// module.exports = new Middleware();
