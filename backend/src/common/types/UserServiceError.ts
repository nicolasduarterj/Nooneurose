export default class UserServiceError extends Error {}

/**
 * Wraps all errors thrown in a function in a UserServiceError
 */
export function ThrowsUserServiceError<This, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  _context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  return function (this: This, ...args: Args): Return {
    try {
      const result = target.apply(this, args);
      if (result instanceof Promise) {
        return result.catch((error: unknown) => {
          throw new UserServiceError(
            error instanceof Error ? error.message : String(error),
            { cause: error }
          );
        }) as Return;
      }
      return result;
    } catch (error: unknown) {
      throw new UserServiceError(
        error instanceof Error ? error.message : String(error),
        { cause: error }
      );
    }
  };
}
