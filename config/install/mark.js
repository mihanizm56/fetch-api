var colors = require("colors");

const sleep = (ms) => new Promise((resolve) => setTimeout(() => {}, ms));

const main = async () => {
  console.log(
    "If you like @mihanizm/fetch-api - please rate me in Github !!!!".red.bold
      .underline
  ); // outputs green text

  await sleep(3000);
};

main();
