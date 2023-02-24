export const fetcher = (...args: Parameters<typeof fetch>) => {
  return fetch(...args).then(async (res) => {
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response.message ?? "Something went wrong");
    }
    return response;
  });
};
