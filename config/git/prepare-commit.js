const { spawn } = require('child_process');

// git commitizen runners
const LINUX_COMMAND = 'exec < /dev/tty && git cz --hook || true';
const WINDOWS_COMMAND = 'prepare-commit-msg';

const runPrecommitExecutor = () => {
  // eslint-disable-next-line
  console.info(
    'info',
    'runPrecommitExecutor goes on platform ',
    process.platform,
  );

  const isWindows =
    process.platform === 'win32' || process.platform === 'win64';
  const commandToExecute = isWindows ? WINDOWS_COMMAND : LINUX_COMMAND;

  const child = spawn(commandToExecute, {
    shell: true,
  });

  child.stdout.on('data', chunk => {
    // eslint-disable-next-line
    console.info('info', chunk.toString());
  });

  child.stderr.on('data', chunk => {
    // eslint-disable-next-line
    console.info('info', chunk.toString());
  });

  child.stdout.on('error', error => {
    // eslint-disable-next-line
    console.info('info', 'child process get error ', error);
    process.exit();
  });

  child.stderr.on('error', error => {
    // eslint-disable-next-line
    console.info('info', 'child process get error ', error);
    process.exit();
  });

  child.on('close', code => {
    // eslint-disable-next-line
    console.info('info', `child process exited with code ${code}`);
    process.exit();
  });
};

runPrecommitExecutor();
