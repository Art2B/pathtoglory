import { BlogPost } from "./model.ts";
import { formatHash } from "@/helpers.ts";
import DB from "@/DB.ts";
import Feed from "@/feed.ts";

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
      "INSERT INTO blog (title, hash, html_content) VALUES ($1, $2, $3) RETURNING title, hash, html_content, created_at",
      [post.title, post.hash, post.html_content],
    );

    const newPost = query.rows[0];
    Feed.addItem(newPost.title, null, newPost.hash, newPost.created_at);
  }
}
