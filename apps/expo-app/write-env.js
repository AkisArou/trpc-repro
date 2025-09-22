import * as os from "node:os";
import * as fs from "node:fs";

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1";
}

const ip = getLocalIP();
const url = `http://${ip}:3000`;

fs.writeFileSync(".env", `EXPO_PUBLIC_TRPC_URL=${url}\n`);
console.log("Wrote .env with", url);
