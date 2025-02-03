import { formatDate } from "./helpers.ts";
import fs from "node:fs/promises";

const BASE_URL = "https://pathtoglory.quest";
const FLUX_MAX_ENTRIES = 10;

export default class Feed {
  static async getFeedFileContent() {
    return await fs.readFile("./feed.xml", "utf8");
  }

  private static async writeFeedFileContent(content: string) {
    return await fs.writeFile("./feed.xml", content, { encoding: "utf8" });
  }

  private static generateItemXMLString(
    title: string,
    description: string,
    link: string,
    publicationDate: Date,
  ) {
    return `<item>
      <title>${title}</title>
      <description>${description}</description>
      <link>${link}</link>
      <pubDate>${formatDate(publicationDate)}</pubDate>
    </item>`;
  }

  static async addItem(
    title: string,
    description: string,
    hash: string,
    publicationDate: Date,
  ) {
    const feedString = await this.getFeedFileContent();
    const itemRegex = new RegExp(/(<item>(\s|.)*?<\/item>)/, "gm");
    const allItemRegex = new RegExp(/(<item>(\s|.)*<\/item>)/, "gm");
    const itemMatches = Array.from(feedString.matchAll(itemRegex));

    const newItems = [
      this.generateItemXMLString(
        title,
        description,
        `${BASE_URL}/blog/${hash}`,
        publicationDate,
      ),
    ];

    for (let i = 0; i < FLUX_MAX_ENTRIES; i++) {
      if (!itemMatches[i]) break;
      newItems.push(itemMatches[i][0]);
    }

    this.writeFeedFileContent(
      feedString.replace(
        allItemRegex,
        newItems.reduce((curr, acc) => `${curr}\n${acc}`, ""),
      ),
    );
  }
}
