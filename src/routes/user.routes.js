import { Router } from "express";
import {registerUser, logoutUser} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/verifyJWT.js";
const router = Router();


router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  registerUser
);

// SECURE ROUTES
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
