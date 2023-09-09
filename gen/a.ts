
// main function get args from command line
const a = () => {
  const argv = Bun.argv;
  const indexArgA = argv.indexOf("--a");
  const result = argv[indexArgA + 1];

//   console.log("Hello via a.ts!");
  console.log(result)
};

a();
