import express from "express";

import {
  getMyBooks,
  getMyBookById,
} from "../Controllers/bookController.js";

import { authmiddleware } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/my-books",
  authmiddleware,
  authorizeRoles("author"),
  getMyBooks
);

router.get(
  "/my-books/:bookId",
  authmiddleware,
  authorizeRoles("author"),
  getMyBookById
);

export default router;
