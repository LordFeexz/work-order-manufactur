export async function request(
  url: string,
  opts?: RequestInit & {
    query?: Record<string, string>;
    next?: NextFetchRequestConfig;
    cache?: RequestCache;
  }
) {
  const searchParams = new URLSearchParams();
  if (opts?.query)
    for (const query in opts.query) searchParams.set(query, opts.query[query]);

  return fetch(
    `${process.env.BACKEND_DOMAIN}${url}?${searchParams.toString()}`,
    opts
  );
}
