const { body, query } = require("express-validator");

const validateCommentBody = [
  body("itemId").isInt().withMessage("Item ID must be a valid integer"),
  body("text")
    .isString()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment text must be between 1 and 1000 characters"),
];

const validateLoginBody = [
  body("username")
    .notEmpty()
    .withMessage("missing username ")
    .isString()
    .withMessage("invalid username type"),

  body("password")
    .notEmpty()
    .withMessage("missing password")
    .isString()
    .withMessage("invalid password data type")
    .isLength({ min: 2, max: 100 })
    .withMessage("invalid password length"),
];

const validateRegisterBody = [
  body("username")
    .notEmpty()
    .withMessage("missing username")
    .isString()
    .withMessage("invalid username data type")
    .isLength({ min: 2, max: 50 })
    .withMessage("invalid username length"),

  body("email")
    .notEmpty()
    .withMessage("missing email address")
    .isEmail()
    .withMessage("invalid email address format")
    .isLength({ max: 256 })
    .withMessage("invalid email length"),

  body("phoneNumber")
    .optional({checkFalsy: true})
    .isMobilePhone()
    .withMessage("invalid phone number format"),

  body("password")
    .notEmpty()
    .withMessage("missing password")
    .isString()
    .withMessage("invalid password data type")
    .isLength({ min: 2, max: 100 })
    .withMessage("invalid password length"),
];

const validateOrderBody = [
  [
    body('firstName')
      .notEmpty().withMessage('First name cannot be empty')
      .isString().withMessage('First name must be a string')
      .isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),

    body('lastName')
      .notEmpty().withMessage('Last name cannot be empty')
      .isString().withMessage('Last name must be a string')
      .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),

  
    body('address')
      .notEmpty().withMessage('Address cannot be empty')
      .isString().withMessage('Address must be a string'),

    body('zipCode')
      .notEmpty().withMessage('Zip code cannot be empty')
      .isString().withMessage('Zip code must be a string')
      .isLength({ min: 5 }).withMessage('Zip code must be at least 5 characters long'),

    body('city')
      .notEmpty().withMessage('City cannot be empty')
      .isString().withMessage('City must be a string'),

    body('items')
      .isArray({ min: 1 }).withMessage('Items must be a non-empty array')
      .custom((items: any[]) => items.every((item: any) => item.id && item.amount))
      .withMessage('Each item must have an id and amount'),

    body('items.*.id')
      .isInt().withMessage('Product ID must be an integer'),

    body('items.*.amount')
      .isInt({ min: 1 }).withMessage('Amount must be at least 1'),
  ],
];

module.exports = {
  validateCommentBody,
  validateLoginBody,
  validateRegisterBody,
  validateOrderBody,
};
