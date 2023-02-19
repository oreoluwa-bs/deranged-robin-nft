export function errorToErrorMessage(error: unknown) {
  if (
    error instanceof Error ||
    (error instanceof Object &&
      error.hasOwnProperty("message") &&
      // @ts-ignore
      Boolean(error.message))
  ) {
    // @ts-ignore
    return error.message as string;
  }

  return error ? `${error}` : "Something unexpected occured";
}
