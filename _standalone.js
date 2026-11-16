var fs = require('fs');

// 模拟中间件里的 content 加载
var content = JSON.parse(fs.readFileSync('admin/content.json', 'utf8'));

// 读取 index.html 原始内容（模拟中间件读取文件后的 HTML）
var html = fs.readFileSync('www.4989028.com/index.html', 'utf8');
var cur = 328;
var nextQ = 329;

// ---- 复刻 renderSectionsIntoHtml 里的逻辑 ----
var allKeys = ['content_wucuo','content_jinshu','content_sanxiao','content_gaoshou',
    'content_jingzhun','content_sixiao','content_shuangbo','content_jinghua',
    'content_tiandi','content_bashima','content_minnan','content_pingte',
    'content_qinqi','content_jingxuan'];

function extractQishuNum(issue){
    var m = (issue||'').match(/(\d+)\s*期/);
    if(m) return parseInt(m[1],10);
    m = (issue||'').match(/第(\d+)/);
    if(m) return parseInt(m[1],10);
    return 0;
}
function findItemForQ(data, targetQ){
    if(!data) return null;
    for(var i=0;i<data.length;i++){
        if(extractQishuNum(data[i].issue) === targetQ) return data[i];
    }
    return null;
}
function getZodText(item){
    if(!item) return '';
    if(item.zodiacs && item.zodiacs.length) return item.zodiacs.join(' ');
    if(item.texiao) return item.texiao;
    if(item.nums) return item.nums;
    return '';
}

// Part 1: 收集 nextQ 生肖
var nextQZods = [];
for(var ci=0; ci<allKeys.length; ci++){
    var item = findItemForQ(content[allKeys[ci]], nextQ);
    var z = getZodText(item);
    if(z) nextQZods.push(z);
}
console.log('nextQZods count:', nextQZods.length);

// Part 3: 扫描 HTML
var posList = [];
var scanRe = new RegExp(cur + '期([^\\s<>【\\(\\d][^\\s<>【\\(]{0,20})', 'g');
var tm;
while((tm = scanRe.exec(html)) !== null){
    var afterQ = tm[1];
    if(!afterQ) continue;
    if(afterQ.indexOf('中中中') >= 0) continue;
    if(afterQ.indexOf('错错错') >= 0) continue;
    if(afterQ.indexOf('开') >= 0 && afterQ.length < 8) continue;
    posList.push({ idx: tm.index, shortName: afterQ.trim() });
}
console.log('scanRe total matched:', posList.length);

// 去重
var seenIdx = {};
posList = posList.filter(function(p){
    if(seenIdx[p.idx]) return false;
    seenIdx[p.idx] = 1;
    return true;
});
console.log('after dedup:', posList.length);

// 降序
posList.sort(function(a,b){ return b.idx - a.idx; });

// Part 4: 插入
var zodIdx = 0;
for(var pi = 0; pi < posList.length; pi++){
    var pos = posList[pi];
    var zod = nextQZods[zodIdx % Math.max(1, nextQZods.length)];
    zodIdx++;
    if(!zod) continue;

    var insertLine = '<font face="微软雅黑" size="4" color="#FF0000">' + nextQ + '期' + pos.shortName + '：' + zod + '</font><br>';

    var before = html.substring(0, pos.idx);
    var lineStart = before.lastIndexOf('<br>');
    var trStart = before.lastIndexOf('<tr');
    var tdStart = before.lastIndexOf('<td');
    var boundary = Math.max(lineStart, trStart, tdStart);

    if(boundary >= 0 && boundary > before.length - 200){
        var between = before.substring(boundary);
        var isBreak = between.indexOf('<br>') >= 0 && between.indexOf('<br>') < 20;
        if(isBreak){
            html = before.substring(0, boundary + 4) + insertLine + before.substring(boundary + 4) + html.substring(pos.idx);
        } else {
            html = before + insertLine + html.substring(pos.idx);
        }
    } else {
        html = before + insertLine + html.substring(pos.idx);
    }
}

console.log('zodIdx (total inserted):', zodIdx);
console.log('final 329期 count:', (html.match(new RegExp(nextQ + '期', 'g'))||[]).length);

// 保存看结果
fs.writeFileSync('_test_out.html', html, 'utf8');
console.log('saved to _test_out.html');

// 前 3000 字符里的 329期
var first329 = html.indexOf(nextQ + '期');
console.log('first 329期 at:', first329);
if(first329 >= 0){
    console.log('context:', html.substring(Math.max(0,first329-50), first329+80));
}