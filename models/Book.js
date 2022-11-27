const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        unique: true,
        trim: true,
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    author: {
        type: String,
        required: [true, 'Please add an author'],
        maxlength: [50, 'Author cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        maxlength: [10, 'Price cannot be more than 10 characters']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        maxlength: [50, 'Category cannot be more than 50 characters']
    },
    image: {
        type: String,
        required: [true, 'Please add an image']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', BookSchema);
