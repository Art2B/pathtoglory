import http from "node:http";
import fs from "node:fs";
import finalhandler from "finalhandler";
import * as esbuild from "esbuild";

import router from "./router";
import Feed from "./feed.ts";

const PORT = 1234;
const OUTPUT_DIR = "build";

fs.rmSync(OUTPUT_DIR, {
  recursive: true,
});

// Build scripts
await esbuild.build({
  entryPoints: ["./src/client/**/*.ts", "./src/client/**/*.css"],
  bundle: true,
  sourcemap: true,
  outdir: OUTPUT_DIR,
  outbase: "src/client",
});

const staticCache: Record<string, string> = {};

// Static files handler middleware with cache
router.use(async function (req, res, next) {
  if (staticCache[req.url]) {
    res.end(staticCache[req.url]);
    return;
  }

  if (fs.existsSync(`build/${req.url}`)) {
    const fileData = fs.readFileSync(`build/${req.url}`, { encoding: "utf-8" });
    staticCache[req.url] = fileData;
    res.end(fileData);
    return;
  }

  next();
});

const server = http.createServer(function (req, res) {
  router(req, res, finalhandler(req, res));
});

server.listen(
  {
    host: "localhost",
    port: PORT,
  },
  () => {
    console.log(`Started server and listening on http://localhost:${PORT}`);
  },
);
