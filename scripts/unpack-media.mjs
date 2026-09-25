import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("encoded-media");

try {
  await access(root);
} catch {
  process.exit(0);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.endsWith(".parts")) {
        const rel = path.relative(root, full).slice(0, -".parts".length);
        const parts = (await readdir(full)).filter((name) => name.endsWith(".b64")).sort();
        const b64 = (await Promise.all(parts.map((name) => readFile(path.join(full, name), "utf8")))).join("");
        const dest = path.resolve(rel);
        await mkdir(path.dirname(dest), { recursive: true });
        await writeFile(dest, Buffer.from(b64, "base64"));
      } else {
        await walk(full);
      }
    }
  }
}

await walk(root);
