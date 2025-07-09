import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testsDir = path.resolve(__dirname, 'tests');

function runTests(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      runTests(fullPath);
    } else if (file.endsWith('.js') && file !== 'runner.js') {
      console.log(`Running ${path.relative(__dirname, fullPath)}`);

      try {
        execSync(`node "${fullPath}"`, { stdio: 'inherit' });
      } catch (err) {
        console.error(`❌ test file ${fullPath} failed with:\n${err.message}`);
        process.exitCode = 1;
      }
    }
  }
}

runTests(testsDir);
