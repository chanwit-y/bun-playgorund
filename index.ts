import bun from "bun";
import Database, { SQLQueryBindings } from "bun:sqlite";
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
  const path = `${import.meta.dir}/file/b.txt`;
  const watcher = watch(path, async (event, filename) => {
    console.log(`Detected ${event} in ${filename}`);
    const file = Bun.file(path);
    const txt = await file.text();
    console.log(txt);
  });
  console.log(`Watching ${watcher}`);
};

const runCreateSQLiteWithFile = async () => {
  const db = new Database("./file/sqlite.db");
  await db.exec(
    "CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)"
  );
  await db.exec("INSERT INTO test (name) VALUES ('Hello')");
  const result = await db.query("SELECT * FROM test");
  console.log(result);
};

const runInsertJSONToSQLiteWithFile = async () => {
  const jsonData = `{
		"users": [
		    {"name": "Alice", "age": 30},
		    {"name": "Bob", "age": 25},
		    {"name": "Charlie", "age": 35}
		]
	      }`;
  const db = new Database("./file/sqlite.db");
  db.exec(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)"
  );
  const json = JSON.parse(jsonData);
  for (const user of json.users) {
    db.run("INSERT INTO users (name, age) VALUES (?, ?)", user.name, user.age);
  }
  const result = db.query("SELECT * FROM users");
  console.log(result.all());

  db.close();
};

type Table2 = {
  id: number;
  data: string;
};

const runSQLiteJsonColumnWithFile = async () => {
  const jsonData = `{
		"users": [
		    {"name": "Alice", "age": 30},
		    {"name": "Bob", "age": 25},
		    {"name": "Charlie", "age": 35}
		]
	      }`;
  const db = new Database("./file/sqlite.db");
  //   db.exec(
  //     "CREATE TABLE IF NOT EXISTS table2 (id INTEGER PRIMARY KEY, data JSON)"
  //   );
  //   db.exec("INSERT INTO table2 (data) VALUES (?)", [jsonData]);
  const result = db.query<Table2, SQLQueryBindings | SQLQueryBindings[]>(
    "SELECT * FROM table2"
  );
  //   console.log(result.all());
  result.all().forEach((row) => {
    console.log(JSON.parse(row.data));
  });
};

const runSQLiteInMemory = () => {
  const db = new Database(":memory:");
  const query = db.query("SELECT 'hello world' as message");
  query.get();
};

// memory in runtime only
const runSQLiteInMemory2 = async () => {
  const db = new Database(":memory:");
  await db.exec(
    "CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)"
  );
  await db.exec("INSERT INTO test (name) VALUES ('Hello')");
  const result = await db.query("SELECT * FROM test");
  console.log(result.get());
};

const runRunCodeStringFromFile = async () => {
  const transpile = new Bun.Transpiler({
    loader: "ts",
  });
  const code = await Bun.file("./file/c.ts").text();
  const result = transpile.transformSync(code);
  const writer = Bun.file("./file/c.js").writer();
  writer.write(result);
  writer.flush();

  const proc = bun.spawn(["bun", "./file/c.js"]);
  console.log(await new Response(proc.stdout).text());
};

// runAFile();
// watchBFile();
// runCreateSQLiteWithFile();
// runSQLiteInMemory();
// runSQLiteInMemory2()
// runInsertJSONToSQLiteWithFile();
// runSQLiteJsonColumnWithFile();
runRunCodeStringFromFile();
