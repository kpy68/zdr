var fs = require('fs');
var p = 'admin/server.js';
var s = fs.readFileSync(p, 'utf8');

var needle = "[^\\\\s<>【\\\\(\\\\d]|[^\\\\s<>【\\\\(]{1,20}";
var rep = "[^\\\\s<>【\\\\(\\\\d][^\\\\s<>【\\\\(]{0,20}";

var cnt = s.split(needle).length - 1;
console.log('Found', cnt, 'occurrences');

s = s.split(needle).join(rep);
fs.writeFileSync(p, s, 'utf8');
console.log('Replaced OK');