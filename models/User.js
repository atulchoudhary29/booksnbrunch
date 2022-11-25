const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Please add your first name']
    },
    last_name: {
        type: String,
        required: [true, 'Please add your last name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    mobile_number: {
        type: String,
        required: [true, 'Please add your Mobile Number']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    address: {
        type: String,
        required: [true, 'Please add your address']
    },
    city: {
        type: String,
        required: [true, 'Please add your city']
    },
    state: {
        type: String,
        required: [true, 'Please add your state']
    },
    country: {
        type: String,
        required: [true, 'Please add your country']
    },
    zip_code: {
        type: String,
        required: [true, 'Please add your zip code']
    },
    role: {
        type: String,
        enum: ['vendor', 'buyer'],
        default: 'buyer'
    },
    last_login: {
        type: Date,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

// // Create user slug from the name
// // UserSchema.pre('save', function(next) {
// //     this.slug = slugify(this.name, { lower: true });
// //     next();
// // });

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);







