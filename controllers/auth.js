const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const multer  = require('multer');
const upload = multer()

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { first_name, last_name, email, mobile_number, password, role, address, city, state, country, zip_code } = req.body;

    // Create user
    const user = await User.create({
        first_name,
        last_name,
        email,
        mobile_number,
        password,
        role,
        address,
        city,
        state,
        country,
        zip_code
    });

    // If there is no error than create user in database


    const error = false;
    if (error) {
        res.status(400).json({
            success: false,
            error: "true"
        });
    } else {
        res.status(201).json({
            success: true,
            error: false,
            data: "user created"
        });
    
    }

});










// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.password;
    
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);

});





// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    
    // get current loggedin user data from the database using token from the cookie
    const user = await User.findById(req.user.id);

    const error = false;
    if (error) {
        res.status(400).json({
            success: false,
            error: "true"
        });
    } else {
        res.status(201).json({
            success: true,
            error: error,
            data: user
        });
    
    }
    
});





// Get token from the model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
        
    res
        .status(statusCode)
        .cookie(
            'token',
            token,
            options
        )
        .json({
            success: true,
            token
        });
};