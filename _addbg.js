var fs = require('fs');
var p = 'admin/server.js';
var s = fs.readFileSync(p, 'utf8');

// 在 Part 3 扫描后加 debug
var marker = "posList.push({ idx: tm.index, name: cur + '期' + afterQ, shortName: afterQ.trim() });";
var debug1 = marker + "\n    if(posList.length <= 3) console.log('[DEBUG scanRe] idx=' + tm.index + ' name=' + afterQ.trim());";
s = s.replace(marker, debug1);

// 在 Part 4 循环里加 debug
var marker2 = "if(!zod) continue;";
var debug2 = marker2 + "\n    if(pi < 3) console.log('[DEBUG insert] pi=' + pi + ' idx=' + pos.idx + ' shortName=' + pos.shortName + ' zod=' + zod.substring(0,10));";
s = s.replace(marker2, debug2);

// 在最终 return 前加统计
var marker3 = "return html;\n}";
var debug3 = "console.log('[DEBUG renderSectionsIntoHtml] totalInserted=' + zodIdx + ' final329count=' + (html.match(new RegExp(nextQ + '期', 'g'))||[]).length);\n    return html;\n}";
s = s.replace(marker3, debug3);

fs.writeFileSync(p, s, 'utf8');
console.log('Debug added');