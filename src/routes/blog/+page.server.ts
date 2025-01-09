import { getArticles } from "./articles";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  // Get all articles with metadata
  const articles = getArticles();
  return { articles };
};
