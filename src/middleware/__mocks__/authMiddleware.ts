/**
 * This is the mock file for AuthMiddleware
 * Uses:
 *      jest.mock('path/to/middleware/authMiddleware');
 */

class AuthMiddleware {
  public static isBankAuthenticated = jest.fn((req, res, next) => {
    next();
  });
  public static createToken = jest.fn().mockResolvedValue('mocked token');
  public static allowWithTokenOrWithoutToken = jest.fn((req, res, next) => {
    next();
  });
}

export default AuthMiddleware;
