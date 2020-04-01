/**
 * This is the mock for multer in test environment
 */

const mockMulterMiddleware = jest.fn((req, res, next) => {
  next();
});

const methods = {};
['single', 'array', 'fields', 'none', 'any'].forEach(method => {
  methods[method] = () => mockMulterMiddleware;
});

const multer = () => methods;

multer.memoryStorage = jest.fn(() => ({}));
multer.diskStorage = jest.fn(() => ({}));

module.exports = multer;
exports = { mockMulterMiddleware };
