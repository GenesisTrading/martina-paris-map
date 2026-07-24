import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outputPath = path.join(root, "exports", "paris-accommodation-map.png");
const viewport = { width: 2400, height: 1600 };

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".geojson", "application/geo+json; charset=utf-8"],
  [".png", "image/png"]
]);

function resolvePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const requested = decoded === "/" ? "/index.html" : decoded;
  const resolved = path.resolve(root, `.${requested}`);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

async function startStaticServer() {
  const server = http.createServer(async (request, response) => {
    const filePath = resolvePath(request.url ?? "/");
    if (!filePath) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    try {
      const body = await fs.readFile(filePath);
      response.writeHead(200, {
        "Content-Type": mimeTypes.get(path.extname(filePath)) ?? "application/octet-stream"
      });
      response.end(body);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  return {
    server,
    url: `http://127.0.0.1:${address.port}/`
  };
}

async function waitForLeafletTiles(page) {
  await page.waitForFunction(
    () => {
      const tiles = Array.from(document.querySelectorAll(".leaflet-tile"));
      return (
        tiles.length > 0 &&
        tiles.every((tile) => tile.complete && tile.naturalWidth > 0 && tile.naturalHeight > 0)
      );
    },
    null,
    { timeout: 45000 }
  );
}

async function main() {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  const { server, url } = await startStaticServer();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport,
      deviceScaleFactor: 1
    });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector("#map.leaflet-container");
    await waitForLeafletTiles(page);
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: outputPath,
      fullPage: false
    });
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  console.log(`Generated ${path.relative(root, outputPath)} (${viewport.width}x${viewport.height})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
