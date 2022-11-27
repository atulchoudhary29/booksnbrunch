const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Book = require('../models/Book');
const User = require('../models/User');
const path = require('path');








// @desc      Get all books
// @route     GET /api/v1/book/:userId/books
// @access    Private

exports.getBooks = asyncHandler(async (req, res, next) => {
    const books = await Book.find({ user: req.params.userId }).populate({
        path: 'user',
        select: 'name email'
    });

    res.status(200).json({
        success: true,
        count: books.length,
        data: books
    });
});






// @desc      Get single book
// @route     GET /api/v1/book/:userId/books/:id
// @access    Private

exports.getBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id).populate({
        path: 'user',
        select: 'name email'
    });

    if (!book) {
        return next(
            new ErrorResponse(`Book not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is book vendor

    if (book.user.toString() !== req.params.userId && req.user.role !== 'vendor') {
        return next(
            new ErrorResponse(`User ${req.params.userId} is not authorized to update this book`, 401)
        );
    }

    res.status(200).json({
        success: true,
        data: book
    });
});







// @desc      Create new book
// @route     POST /api/v1/book/:userId/books
// @access    Private

exports.createBook = asyncHandler(async (req, res, next) => {
    req.body.user = req.params.userId;

    const user = await User.findById(req.params.userId);

    if (!user) {
        return next(
            new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
        );
    }

    // Make sure user is book vendor

    if (user.role !== 'vendor') {
        return next(
            new ErrorResponse(`User ${req.params.userId} is not authorized to add a book`, 401)
        );
    }

    if(req.file){
        req.body.image = req.file.filename;
    }
    const book = await Book.create(req.body);

    res.status(200).json({
        success: true,
        data: book,
        message: 'Book added successfully'

    });
});







// @desc      Update book
// @route     PUT /api/v1/book/:userId/books/:id
// @access    Private

exports.updateBook = asyncHandler(async (req, res, next) => {
    let book = await Book.findById(req.params.id);

    if (!book) {
        return next(
            new ErrorResponse(`Book not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is book vendor

    if (book.user.toString() !== req.params.userId && req.user.role !== 'vendor') {
        return next(
            new ErrorResponse(`User ${req.params.userId} is not authorized to update this book`, 401)
        );
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body , {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: book
    });

});






// @desc      Delete book
// @route     DELETE /api/v1/book/:userId/books/:id
// @access    Private

exports.deleteBook = asyncHandler(async (req, res, next) => {
    const book = await Book.findById(req.params.id);

    if (!book) {
        return next(
            new ErrorResponse(`Book not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is book vendor

    if (book.user.toString() !== req.params.userId && req.user.role !== 'vendor') {
        return next(
            new ErrorResponse(`User ${req.params.userId} is not authorized to delete this book`, 401)
        );
    }

    await book.remove();

    res.status(200).json({
        success: true,
        data: {}
    });

});






