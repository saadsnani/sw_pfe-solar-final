import { mkdir, writeFile } from "fs/promises";
import path from "path";

const base = process.env.DATA_BASE_URL || "https://solar-dashboard-pfe.vercel.app";
const targets = [
  { url: `${base}/api/feedback`, file: path.join(process.cwd(), "data", "feedback.json") },
  { url: `${base}/api/logs`, file: path.join(process.cwd(), "data", "login-logs.json") },
];

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function main() {
  await mkdir(path.join(process.cwd(), "data"), { recursive: true });
  for (const { url, file } of targets) {
    const data = await fetchJson(url);
    await writeFile(file, JSON.stringify(data, null, 2), "utf-8");
    console.log(`saved ${url} -> ${file}`);
  }
  console.log("done");
}

main().catch((err) => {
  console.error("pull-remote-data error", err.message);
  process.exit(1);
});
