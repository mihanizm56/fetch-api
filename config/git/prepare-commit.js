const { spawn } = require("child_process");
const path = require("path");

// git commitizen runners
const LINUX_COMMAND = "exec < /dev/tty && git cz --hook || true";
const WINDOWS_COMMAND = path.join(__dirname, "prepare-commit-msg");

const runPrecommitExecutor = () => {
  // eslint-disable-next-line
  console.info(
    "info",
    "runPrecommitExecutor goes on platform ",
    process.platform
  );

  const isWindows =
    process.platform === "win32" || process.platform === "win64";
  const commandToExecute = isWindows ? WINDOWS_COMMAND : LINUX_COMMAND;

  spawn(commandToExecute, {
    shell: true,
    stdio: "inherit",
  });
};

runPrecommitExecutor();
