import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  // Get query
  const query = url.searchParams.get("query");
  return { query };
};
