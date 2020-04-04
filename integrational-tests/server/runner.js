const { spawn } = require('child_process');

spawn('node', ['./integrational-tests/server/index.js'], {
  shell: true,
  detached: true,
});
