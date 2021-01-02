/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colors = require('colors');

const sleep = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

const main = async () => {
  console.log(
    'If you like @mihanizm56/fetch-api - please rate me in Github !!!!'.red.bold
      .underline,
  );

  await sleep(1000);

  console.log('https://github.com/mihanizm56/fetch-api'.red);

  await sleep(2000);
};

main();
