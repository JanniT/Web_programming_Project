const { body } = require('express-validator')

// Middleware for password & email validation
const validateRegister = [
    body("email")
        .isEmail().normalizeEmail().withMessage("Invalid email address."),
    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
        .matches(/(?=.*[a-z])/).withMessage("Password must contain at least one lowercase letter.")
        .matches(/(?=.*[A-Z])/).withMessage("Password must contain at least one uppercase letter.")
        .matches(/(?=.*\d)/).withMessage("Password must contain at least one number.")
        .matches(/(?=.*[~`!@#$%^&*()-_+={}[\]\\|;:"<>,./?])/).withMessage("Password must contain at least one special character.")
]

module.exports = validateRegister
