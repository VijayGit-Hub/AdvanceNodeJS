const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

process.env.UV_THREADPOOL_SIZE = 100;
// process.env.UV_THREADPOOL_SIZE = 4; // This is the default value

const start = Date.now();

function logTime(label) {
  console.log(`${label}: ${Date.now() - start}ms`);
}

// -------------------------------------------------------------
// 1. Network Request (https module)
// -> Handled by the OS Kernel. Highly concurrent.
// -------------------------------------------------------------
https.get('https://google.com', (res) => {
  res.on('data', () => {});
  res.on('end', () => {
    logTime('🌐 HTTPS Network Request Done');
  });
});

// -------------------------------------------------------------
// 2. File System Reading (fs module)
// -> Offloaded to Thread Pool. Uses Thread #1.
// -------------------------------------------------------------
fs.readFile(__filename, () => {
  logTime('📁 FS File Read Done');
});

// -------------------------------------------------------------
// 3. Cryptographic Hashing (crypto module)
// -> High-CPU work offloaded to Thread Pool. 
// -> We run 8 instances to match the 8 threads.
// -------------------------------------------------------------
for (let i = 1; i <= 8; i++) {
  crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', () => {
    logTime(`🔑 Crypto Hash #${i} Done`);
  });
}
