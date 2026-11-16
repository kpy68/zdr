var fs = require('fs');
var p = 'admin/server.js';
var s = fs.readFileSync(p, 'utf8');

var oldPattern = "cur + '期([^\\s<>【\\(\\d]|[^\\s<>【\\(]{1,20})'";
var newPattern = "cur + '期([^\\s<>【\\(\\d][^\\s<>【\\(]{0,20})'";

if(s.includes(oldPattern)){
    s = s.replace(oldPattern, newPattern);
    fs.writeFileSync(p, s, 'utf8');
    console.log('FIXED: alternation removed, now single-branch greedy');
} else {
    console.log('oldPattern not found, showing context:');
    var idx = s.indexOf("scanRe");
    if(idx >= 0) console.log(s.substring(idx, idx + 300));
}