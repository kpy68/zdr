var fs = require('fs');
var p = 'admin/server.js';
var s = fs.readFileSync(p, 'utf8');

var startMarker = 'function renderSectionsIntoHtml(html, content, latestQishu){';
var endMarker = 'app.use(cors());';

var startIdx = s.indexOf(startMarker);
var endIdx = s.indexOf(endMarker);

if(startIdx < 0 || endIdx < 0){
    console.log('MARKER NOT FOUND!');
    process.exit(1);
}

var newFunc = `function renderSectionsIntoHtml(html, content, latestQishu){
    if(!content || typeof content !== 'object') return html;
    var cur = parseInt(latestQishu, 10);
    if(isNaN(cur)) return html;
    var nextQ = cur + 1;

    var allKeys = ['content_wucuo','content_jinshu','content_sanxiao','content_gaoshou',
        'content_jingzhun','content_sixiao','content_shuangbo','content_jinghua',
        'content_tiandi','content_bashima','content_minnan','content_pingte',
        'content_qinqi','content_jingxuan'];

    function extractQishuNum(issue){
        var m = (issue||'').match(/(\d+)\\s*期/);
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

    // Part 1: 收集所有 content key 的 nextQ 期生肖数据
    var nextQZods = [];
    for(var ci=0; ci<allKeys.length; ci++){
        var item = findItemForQ(content[allKeys[ci]], nextQ);
        var z = getZodText(item);
        if(z) nextQZods.push(z);
    }

    // Part 2: 收集所有 cur 期生肖数据（用于替换）
    var curZods = [];
    for(var ci2=0; ci2<allKeys.length; ci2++){
        var item2 = findItemForQ(content[allKeys[ci2]], cur);
        var z2 = getZodText(item2);
        if(z2) curZods.push(z2);
    }

    // Part 3: 扫描 HTML 里所有 cur期+合法栏目 位置
    // 合法栏目 = cur期 后面不是数字、【、(、中中中、空
    var posList = [];
    var scanRe = new RegExp(cur + '期([^\\\\s<>【\\\\(\\\\d]|[^\\\\s<>【\\\\(]{1,20})', 'g');
    var tm;
    while((tm = scanRe.exec(html)) !== null){
        var full = tm[0];
        var afterQ = tm[1];
        if(!afterQ) continue;
        // 排除明显非栏目的
        if(afterQ.indexOf('中中中') >= 0) continue;
        if(afterQ.indexOf('错错错') >= 0) continue;
        if(afterQ.indexOf('开') >= 0 && afterQ.length < 8) continue;
        posList.push({ idx: tm.index, name: cur + '期' + afterQ, shortName: afterQ.trim() });
    }

    // 去重（同一个 idx 只取第一个）
    var seenIdx = {};
    posList = posList.filter(function(p){
        if(seenIdx[p.idx]) return false;
        seenIdx[p.idx] = 1;
        return true;
    });
    // 按 idx 降序排列（从后往前插，前面的 idx 不受影响）
    posList.sort(function(a,b){ return b.idx - a.idx; });

    // Part 4: 在每个 cur期栏目前，插入 nextQ期+同名栏目+生肖
    var zodIdx = 0;
    for(var pi = 0; pi < posList.length; pi++){
        var pos = posList[pi];
        var zod = nextQZods[zodIdx % Math.max(1, nextQZods.length)];
        zodIdx++;
        if(!zod) continue;

        var insertLine = '<font face="微软雅黑" size="4" color="#FF0000">' + nextQ + '期' + pos.shortName + '：' + zod + '</font><br>';

        // 往前找 <br> 或 <tr> 或 <td> 的边界，让新起一行更自然
        var before = html.substring(0, pos.idx);
        var lineStart = before.lastIndexOf('<br>');
        var trStart = before.lastIndexOf('<tr');
        var tdStart = before.lastIndexOf('<td');
        var boundary = Math.max(lineStart, trStart, tdStart);

        if(boundary >= 0 && boundary > before.length - 200){
            // 在最近的 <br> 后面插入（如果够近的话）
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

    return html;
}

`;

s = s.substring(0, startIdx) + newFunc + s.substring(endIdx);

fs.writeFileSync(p, s, 'utf8');
console.log('renderSectionsIntoHtml rewritten OK');