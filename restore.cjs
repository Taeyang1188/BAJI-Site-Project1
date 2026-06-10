const { execSync } = require('child_process');
try {
  console.log('--- GIT STATUS ---');
  console.log(execSync('git status').toString());
  console.log('--- RESETTING FILE ---');
  execSync('git checkout HEAD -- src/constants/stem-branch-personalities.ts');
  console.log('SUCCESS: Restored from HEAD!');
} catch (e) {
  console.error('FAILED to restore:', e.message);
}
