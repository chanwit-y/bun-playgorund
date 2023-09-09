import bun from "bun";

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

runAFile();
