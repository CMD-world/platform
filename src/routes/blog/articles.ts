type Markdown = {
  metadata: {
    title: string;
    description: string;
    date: string;
    image: string;
  };
};

export function getArticles() {
  const pages = import.meta.glob<Markdown>("/src/routes/blog/**/*.md", { eager: true });
  const articles = Object.entries(pages).map(([path, { metadata }]) => {
    const url = path.replace("/src/routes/blog/", "").replace("/+page.md", "");
    const date = new Date(metadata.date);
    return { ...metadata, url, date };
  });
  articles.sort((a, b) => b.date.getTime() - a.date.getTime());
  return articles;
}
