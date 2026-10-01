// pulls the latest fw-v* release of orbis-hub/orbis into firmware/ and rewrites manifests/*.json
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
const headers = { "user-agent": "orbis-flash", accept: "application/vnd.github+json", ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) };
const res = await fetch("https://api.github.com/repos/orbis-hub/orbis/releases?per_page=30", { headers });
const rel = await res.json();
if (!Array.isArray(rel)) { console.error("github api:", res.status, JSON.stringify(rel).slice(0, 200)); process.exit(1); }
const fw = rel.find((r) => r.tag_name.startsWith("fw-v") && !r.draft);
if (!fw) { console.log("no fw-v release yet"); process.exit(0); }
const version = fw.tag_name.replace(/^fw-v/, "");
mkdirSync("firmware", { recursive: true });
for (const a of fw.assets.filter((a) => a.name.endsWith(".bin"))) {
  const buf = Buffer.from(await (await fetch(a.browser_download_url, { headers: { "user-agent": "orbis-flash" }, redirect: "follow" })).arrayBuffer());
  writeFileSync(`firmware/${a.name}`, buf);
  const env = a.name.replace(/^orbis-/, "").replace(/\.bin$/, "");
  const chip = env.includes("s3") ? "ESP32-S3" : "ESP32";
  writeFileSync(`manifests/${env}.json`, JSON.stringify({ name: `orbis e-ink (${env})`, version, new_install_prompt_erase: true, builds: [{ chipFamily: chip, parts: [{ path: `../firmware/${a.name}`, offset: 0 }] }] }, null, 2) + "\n");
  console.log("synced", a.name, version);
}
