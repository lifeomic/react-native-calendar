const { execSync } = require('child_process');
const { unlinkSync } = require('fs');
const glob = require('glob');

const run = (cmd) => execSync(cmd, { cwd: __dirname, stdio: 'inherit' });

run('rm -rf dist/');

// This generates the declaration files and the .js files. We'll overwrite the
// .js files in the next step using babel output.
run('yarn tsc');

// Compile the source directly using babel. This has an important indirect
// side-effect of preventing non-Babel-compatible syntax from entering the
// codebase.
run('yarn babel src --out-dir dist --extensions .ts,.tsx');
run('yarn prettier --write dist');

for (const file of ['package.json', 'README.md']) {
  run(`cp ${file} dist/`);
}

// Remove test files from output
for (const file of glob.sync('dist/**/*.test.*')) {
  unlinkSync(file);
}

console.log('✔️  Successfully built library to dist folder');
