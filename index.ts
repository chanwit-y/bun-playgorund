import bun from "bun";
import { watch } from "fs";

console.log("Hello via Bun!");

const json = {
  a: 1,
  b: 2,
  c: 3,
};

const runAFile = async () => {
  const proc = bun.spawn([
    "bun",
    "./gen/a.ts",
    "--a",
    JSON.stringify(json),
    "--b",
    "2",
  ]);
  const output = await new Response(proc.stdout).text();
  //   console.log('output',output);
  console.log("output", JSON.parse(output));
};

const watchBFile = async () => {
  const path = `${import.meta.dir}/file/b.txt`
  const watcher = watch(path, async (event, filename) => {
    console.log(`Detected ${event} in ${filename}`);
    const file = Bun.file(path)
    const txt = await file.text();
    console.log(txt);
  });
};

// runAFile();
watchBFile();
