import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

// Get the total number of CPU cores (Will be 8 on your MacBook Air)
const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`=========================================`);
  console.log(`Primary process ${process.pid} is running.`);
  console.log(`Detected ${numCPUs} CPU cores. Forking workers...`);
  console.log(`=========================================`);

  // Fork a worker process for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for dying workers and replace them if needed
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Spawning a replacement...`);
    cluster.fork();
  });

} else {
  // Workers all share the same HTTP server port (Port 3000)
  http.createServer((req, res) => {
    
    // Simulate a CPU-heavy task to see load balancing
    if (req.url === '/heavy') {
      let sum = 0;
      for (let i = 0; i < 1e7; i++) {
        sum += i;
      }
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello from Worker ${process.pid}\n`);
    
    console.log(`Worker ${process.pid} handled a request.`);
  }).listen(3000);

  console.log(`Worker process ${process.pid} started.`);
}
