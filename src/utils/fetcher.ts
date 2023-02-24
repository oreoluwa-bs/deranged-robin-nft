export const fetcher = async (...args: Parameters<typeof fetch>) => {
  const res = await fetch(...args);
  const response = await res.json();
  if (!res.ok) {
    throw new Error(response.message ?? "Something went wrong");
  }
  return await response;
};
