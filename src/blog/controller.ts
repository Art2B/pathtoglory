import { BlogPost } from "./model.ts";
import { formatHash } from "@/helpers.ts";
import DB from "@/DB.ts";

const convertFormDataToBlogPost = (data: FormData): Partial<BlogPost> => {
  const title = data.get("title") as string;
  const hash = data.get("hash") as string;

  return {
    title: title,
    hash: hash.length > 0 ? hash : formatHash(title),
    html_content: data.get("content") as string,
  };
};

export class BlogController {
  static async createPost(data: FormData) {
    const post = convertFormDataToBlogPost(data);

    const query = await DB.query(
      "INSERT INTO blog (title, hash, html_content) VALUES ($1, $2, $3)",
      [post.title, post.hash, post.html_content],
    );

    console.log("createPost Query result: ", query);
  }
}
