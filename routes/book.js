const express = require('express');
const { getBooks, getBook, createBook, updateBook, deleteBook, bookPhotoUpload } = require('../controllers/book');

const { protect} = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router({ mergeParams: true });

router
    .route('/:userId/books')
    .get(protect, getBooks)
    .post(protect, upload.single('image'),createBook);

router
    .route('/:userId/books/:id')
    .get(protect, getBook)
    .put(protect, upload.single('image'), updateBook)
    .delete(protect, deleteBook);



module.exports = router;