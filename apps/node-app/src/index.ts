import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "@packages/trpc-server/_app.ts";
import cors from "cors";
import http from "http";

// Vanilla NodeJS
const server = http.createServer((req, res) => {
  if (req.url === "/count") {
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    });

    let i = 1;

    const interval = setInterval(() => {
      if (i <= 5) {
        console.log("[vanilla fetch] Sending count", i);
        res.write(`${i}\n`);
        i++;
      } else {
        clearInterval(interval);
        res.end();
      }
    }, 1000);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("[vanilla fetch] Not Found");
  }
});

server.listen(3001, () => {
  console.log("[vanilla fetch] Server running at http://localhost:3001/");
});

// tRPC
createHTTPServer({
  router: appRouter,
  middleware: cors(),
}).listen(3000, "0.0.0.0");
