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

/**
 *  Return an IPFS gateway URL for the given CID and path
 *
 * HTTP accessible
 */
export function makeGatewayURL(cid: string, path: string) {
  return `https://${cid}.ipfs.dweb.link/${encodeURIComponent(path)}`;
}

/**
 *  Return an IPFS URI for the given CID and path
 *
 */
export function makeGatewayURI(cid: string, filename: string) {
  return `ipfs://${cid}/${filename}`;
}
