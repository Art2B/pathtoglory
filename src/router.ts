import Router from "router";
import nunjucks from "nunjucks";

import { stringToFormData } from "./helpers.ts";
import DB from "./DB.ts";
import { BlogController } from "./blog/controller.ts";

const router = new Router();

nunjucks.configure("src/views", { autoescape: true });

router.get("/", async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  res.end(nunjucks.render("home.html"));
});

router.get("/about", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  res.end(nunjucks.render("about.html"));
});

router.get("/blog", async (req, res) => {
  const result = await DB.query(
    "SELECT * FROM public.blog ORDER BY created_at DESC",
  );
  res.end(
    nunjucks.render("blog/index.html", {
      posts: result.rows,
    }),
  );
});

router.get("/blog/new", (req, res) => {
  res.end(nunjucks.render("blog/new.html"));
});
router.post("/blog/new", (req, res) => {
  let body = [];
  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", async () => {
      const bodyString = Buffer.concat(body).toString();
      const data = stringToFormData(bodyString);

      await BlogController.createPost(data);

      res.writeHead(303, {
        Location: "/blog",
      });
      res.end();
    });
});
router.get("/blog/:hash", async (req, res) => {
  const result = await DB.query(
    "SELECT * FROM public.blog WHERE hash=$1 LIMIT 1",
    [req.params?.hash],
  );
  const post = result.rows[0];

  if (post) {
    res.end(
      nunjucks.render("blog/article.html", {
        post: post,
      }),
    );
  } else {
    res.end("Not found");
  }
});

router.get("/feed", async (req, res) => {
  try {
    const data = await fs.readFile("feed.xml");

    res.writeHead(200, {
      "Content-Type": "application/xml",
    });
    res.end(data);
  } catch (err) {
    res.statusCode = 500;
    res.end("An error occured on the server. Sorry.");
  }
});

export default router;
