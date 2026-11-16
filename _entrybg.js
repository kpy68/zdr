var fs = require('fs');
var p = 'admin/server.js';
var s = fs.readFileSync(p, 'utf8');

var oldLine = "function renderSectionsIntoHtml(html, content, latestQishu){";
var newLine = oldLine + "\n    console.log('>>> renderSectionsIntoHtml CALLED, latestQishu=' + latestQishu + ' htmlLen=' + html.length + ' contentKeys=' + (content?Object.keys(content).length:'null'));";

if(s.indexOf(oldLine) >= 0){
    s = s.replace(oldLine, newLine);
    fs.writeFileSync(p, s, 'utf8');
    console.log('Added entry debug OK');
} else {
    console.log('NOT FOUND');
}