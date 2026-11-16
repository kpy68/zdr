var fs = require('fs');
var d = fs.readFileSync('e:/demo1/www.4989028.com/index.html', 'utf8');
var re = /(\d+)期/g;
var m;
var seen = {};
while ((m = re.exec(d)) !== null) {
    var n = parseInt(m[1], 10);
    if (n >= 100 && n <= 9999) {
        if (!seen[n]) seen[n] = [];
        if (seen[n].length < 3) seen[n].push(d.substring(m.index - 3, m.index + 20));
    }
}
Object.keys(seen).sort(function(a,b){return parseInt(b)-parseInt(a)}).forEach(function(k){
    console.log(k+'期 ('+seen[k].length+'次):');
    seen[k].forEach(function(c){console.log('  ',c)});
});