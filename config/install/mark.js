var colors = require("colors");

const sleep = (ms) => new Promise((resolve) => setTimeout(() => {}, ms));

const main = async () => {
  console.log(
    "If you like @mihanizm/fetch-api - please rate me in Github !!!!".red.bold
      .underline
  );

  await sleep(1000);

  console.log("https://github.com/mihanizm56/fetch-api".red.bold.underline);

  await sleep(2000);
};

main();
