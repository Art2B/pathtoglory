import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const HtmlTemplate = await Deno.readTextFile("./templates/index.html");

const HomePage = await Deno.readTextFile("./pages/home.html");
const AboutPage = await Deno.readTextFile("./pages/about.html");

const rssFeedFile = await Deno.readTextFile("./feed.xml");

const TemplateContentInsertion = "{ content }";

const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.headers = new Headers({
      "Content-Type": "text/html",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
    });

    ctx.response.body = HtmlTemplate.replace(
      TemplateContentInsertion,
      HomePage,
    );
  })
  .get("/about", (ctx) => {
    ctx.response.headers = new Headers({
      "Content-Type": "text/html",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
    });

    ctx.response.body = HtmlTemplate.replace(
      TemplateContentInsertion,
      AboutPage,
    );
  })
  .get("/feed", (ctx) => {
    ctx.response.headers = new Headers({
      "Content-Type": "application/xml",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
    });

    ctx.response.body = rssFeedFile;
  });

const app = new Application();
// Logger
app.use(async (ctx, next) => {
  await next();
  console.log(`${ctx.request.method} ${ctx.request.url}`);
});
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 80 });
