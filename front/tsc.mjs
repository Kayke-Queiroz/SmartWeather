import { execSync } from 'child_process';
try {
  console.log(execSync('npx tsc --noEmit', { encoding: 'utf-8' }));
} catch (e) {
  console.log(e.stdout);
}
