import mongoose from "mongoose";
import { Book } from "../Modles/Book.js";

// GET /api/books/my-books
export const getMyBooks = async (req, res) => {
  try {
    const authorId = req.user.id;

    const books = await Book.find({
      author: authorId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Get my books error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch books",
    });
  }
};

// GET /api/books/my-books/:bookId
export const getMyBookById = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.isValidObjectId(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findOne({
      _id: bookId,
      author: req.user.id,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    console.error("Get my book error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch book",
    });
  }
};
