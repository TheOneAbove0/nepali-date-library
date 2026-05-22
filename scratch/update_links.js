const fs = require('fs');
const path = require('path');

const packages = ['react', 'vue', 'vanilla', 'js'];
const root = '/Users/manish/Desktop/project/nepali-date-library';

const repoUrl = "https://github.com/TheOneAbove0/nepali-date-library.git";
const bugsUrl = "https://github.com/TheOneAbove0/nepali-date-library/issues";
const homepageUrl = "https://nepali-date-library-ewoc-a0iyair2h-theoneabove0s-projects.vercel.app/";

packages.forEach(pkg => {
  const pkgJsonPath = path.join(root, pkg, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const pkgData = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    
    pkgData.repository = { type: "git", url: repoUrl };
    pkgData.bugs = { url: bugsUrl };
    pkgData.homepage = homepageUrl;

    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgData, null, 2) + '\n');
    console.log(`Updated ${pkg}/package.json`);
  }

  const readmePath = path.join(root, pkg, 'README.md');
  if (fs.existsSync(readmePath)) {
    let readme = fs.readFileSync(readmePath, 'utf8');
    
    // Replace unschooled names with scoped names
    readme = readme.replace(/nepalidatepicker-react/g, '@theoneabove0/nepalidatepicker-react');
    readme = readme.replace(/nepalidatepicker-vue/g, '@theoneabove0/nepalidatepicker-vue');
    readme = readme.replace(/nepalidatepicker-vanilla/g, '@theoneabove0/nepalidatepicker-vanilla');
    
    // Also carefully replace 'nepalidatepicker' with '@theoneabove0/nepalidatepicker' in installation commands
    // We only want to replace standalone 'nepalidatepicker ' or 'nepalidatepicker\n'
    readme = readme.replace(/yarn add (.*?)nepalidatepicker(\s|$)/g, 'yarn add $1@theoneabove0/nepalidatepicker$2');
    readme = readme.replace(/npm i (.*?)nepalidatepicker(\s|$)/g, 'npm i $1@theoneabove0/nepalidatepicker$2');
    
    // If there's any imports from 'nepalidatepicker', let's replace those too just in case
    readme = readme.replace(/'nepalidatepicker'/g, "'@theoneabove0/nepalidatepicker'");

    fs.writeFileSync(readmePath, readme);
    console.log(`Updated ${pkg}/README.md`);
  }
});
