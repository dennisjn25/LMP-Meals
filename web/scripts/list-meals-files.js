const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/meals');
const files = fs.readdirSync(dir);

fs.writeFileSync(path.join(__dirname, 'meals-files.json'), JSON.stringify(files, null, 2));
