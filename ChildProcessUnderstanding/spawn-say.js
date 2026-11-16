const { spawn } = require('child_process');

// 1. Define the separate elements
const command = 'say'; 
const argumentsArray = ['Hello from the spawn engine!'];

console.log(`Executing OS level binary: ${command}...`);

// 2. Pass them into spawn
// This translates natively into running: say "Hello from the spawn engine!"
const talkProcess = spawn(command, argumentsArray);

// Optional: You can check when the text speech action finishes playing
talkProcess.on('close', (code) => {
    console.log(`Audio rendering completed. Process exit code: ${code}`);
});
