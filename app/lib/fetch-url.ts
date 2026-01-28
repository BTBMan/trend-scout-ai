/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchTrendsFunContent(url: string): Promise<string> {
  const hash = url.match(/post\/([a-f0-9]+)/)?.[1];
  if (!hash) {
    return "无法提取内容";
  }

  try {
    const response = await fetch(
      `https://api.trends.fun/v1/post/info?optional=true&hash=${hash}`
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch URL content:", error);
    return "无法提取内容";
  }
}

/**
 * Fetch and extract text content from a URL
 */
export async function fetchUrlContent(url: string): Promise<string> {
  try {
    const res: any = await fetchTrendsFunContent(url);
    if (res.status === "success" && res.data) {
      const author = res.data.content.author;
      const content = res.data.content.content;
      const tweetContent = `author: ${author.name}\nauth description: ${author.description}\ntweet content: ${content.text}
      `;
      console.log(tweetContent);

      return tweetContent;
    }

    return "无法提取内容";
  } catch (error) {
    console.error("Failed to fetch URL content:", error);
    return "抓取失败";
  }
}
