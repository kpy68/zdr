var fs = require('fs');
var p = 'admin/server.js';
var s = fs.readFileSync(p, 'utf8');

// 从 debug 输出看到的实际代码行
var oldLine = "scanRe = new RegExp(cur + '期([^\\s<>【\\(\\d]|[^\\s<>【\\(]{1,20})', 'g');";
var newLine = "scanRe = new RegExp(cur + '期([^\\s<>【\\(\\d][^\\s<>【\\(]{0,20})', 'g');";

if(s.indexOf(oldLine) >= 0){
    s = s.replace(oldLine, newLine);
    fs.writeFileSync(p, s, 'utf8');
    console.log('FIXED OK');
} else {
    // 试试读出来有多少反斜杠
    console.log('Trying byte-level match...');
    var buf = fs.readFileSync(p);
    var content = buf.toString('utf8');
    var idx = content.indexOf("scanRe");
    console.log('scanRe context:', JSON.stringify(content.substring(idx, idx + 150)));
}