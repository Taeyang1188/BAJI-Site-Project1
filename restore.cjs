const { execSync } = require('child_process');
try {
  execSync('git checkout -- src/data/ilju-dataset.ts');
  console.log('Restored');
} catch(e) {
  console.log(e);
}
