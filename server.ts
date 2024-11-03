import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const IndexHTML = await Deno.readTextFile("./static/index.html");

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = IndexHTML;
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
