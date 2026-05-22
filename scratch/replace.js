const fs = require('fs');
const path = require('path');

const dirs = ['react', 'vue', 'vanilla'];
const root = '/Users/manish/Desktop/project/nepali-date-library';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', 'dist'].includes(file)) {
        results = results.concat(walk(filePath));
      }
    } else {
      if (['.ts', '.tsx', '.js', '.cjs'].includes(path.extname(file))) {
        results.push(filePath);
      }
    }
  });
  return results;
}

let modifiedCount = 0;
dirs.forEach((d) => {
  const dirPath = path.join(root, d);
  const files = walk(dirPath);
  files.forEach((f) => {
    let content = fs.readFileSync(f, 'utf-8');
    let newContent = content
      .replace(/'nepalidatepicker'/g, "'@theoneabove0/nepalidatepicker'")
      .replace(/'nepalidatepicker\/datepicker-core'/g, "'@theoneabove0/nepalidatepicker/datepicker-core'")
      .replace(/"nepalidatepicker"/g, '"@theoneabove0/nepalidatepicker"')
      .replace(/"nepalidatepicker\/datepicker-core"/g, '"@theoneabove0/nepalidatepicker/datepicker-core"');
      
    if (content !== newContent) {
      fs.writeFileSync(f, newContent);
      console.log(`Updated ${f}`);
      modifiedCount++;
    }
  });
});

console.log(`Finished updating ${modifiedCount} files.`);
