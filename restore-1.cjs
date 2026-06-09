const { execSync } = require('child_process');
try {
  execSync('git checkout src/components/BaZiResultPage.tsx');
  console.log('SUCCESS: Restored BaZiResultPage.tsx!');
} catch (e) {
  console.error('FAILED to restore:', e.message);
}
