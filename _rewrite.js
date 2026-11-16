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

    var sectionMap = {
        'content_wucuo': ['绝杀一波', '绝杀1.肖1.尾', '绝杀二肖', '绝杀榜', '绝杀一行', '绝杀二尾', '绝杀一头', '绝杀一肖'],
        'content_jinshu': ['本期', '尽输光', '本期尽输'],
        'content_sanxiao': ['推荐九肖', '推荐七肖', '推荐五肖', '推荐三肖', '三肖中特', '三肖推荐', '家野(2)肖', '家野主三肖'],
        'content_gaoshou': ['高手资料', '高手榜单', '六合高手'],
        'content_jingzhun': ['精准公式', '精准'],
        'content_sixiao': ['六肖六码', '四肖八码', '四肖中特', '五肖10码', '四中四码', '四码', '三肖六码'],
        'content_shuangbo': ['双波'],
        'content_jinghua': ['精华资料', '精华区'],
        'content_tiandi': ['天地肖', '天地两肖', '天地生肖', '天地'],
        'content_bashima': ['必中18码', '18码中特', '18码', ':8.码中特'],
        'content_minnan': ['闽南五虎', '闽南'],
        'content_pingte': ['平特', '平特一肖'],
        'content_qinqi': ['琴棋书画'],
        'content_jingxuan': ['精选']
    };

    var displayNames = {
        'content_wucuo': '绝杀二肖',
        'content_jinshu': '尽输光',
        'content_sanxiao': '三肖中特',
        'content_gaoshou': '高手资料',
        'content_jingzhun': '精准公式',
        'content_sixiao': '四码',
        'content_shuangbo': '双波',
        'content_jinghua': '精华资料',
        'content_tiandi': '天地两肖',
        'content_bashima': '18码中特',
        'content_minnan': '闽南五虎',
        'content_pingte': '平特一肖',
        'content_qinqi': '琴棋书画',
        'content_jingxuan': '精选'
    };

    var allKeys = ['content_wucuo','content_jinshu','content_sanxiao','content_gaoshou',
        'content_jingzhun','content_sixiao','content_shuangbo','content_jinghua',
        'content_tiandi','content_bashima','content_minnan','content_pingte',
        'content_qinqi','content_jingxuan'];

    function findItemForQ(data, targetQ){
        var re = new RegExp(targetQ + '\\\\s*期');
        for(var i=0;i<data.length;i++){
            if(re.test(data[i].issue)) return data[i];
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

    // Part 1: 替换 cur, cur-1, cur-2... 期内容到对应 HTML 栏目
    for(var key in sectionMap){
        var data = content[key];
        if(!data || !Array.isArray(data) || data.length === 0) continue;
        var keywords = sectionMap[key];
        for(var ki = 0; ki < keywords.length; ki++){
            var kw = keywords[ki];
            var escKw = kw.replace(/[.*+?^\${}()|[\\]\\\\]/g,'\\\\$&');

            for(var idx = 0; idx < Math.min(data.length, 15); idx++){
                var targetQ = cur - idx;
                if(targetQ <= 0) break;
                var item = findItemForQ(data, targetQ);
                if(!item) continue;
                var zodText = getZodText(item);
                if(!zodText) continue;

                var search = targetQ + '期' + kw;
                if(!html.includes(search)) continue;

                var re = new RegExp('(<font[^>]*size="4"[^>]*>[^<]*' + targetQ + '期' + escKw + '[^<]*</font>)', 'g');
                html = html.replace(re, function(match, fontTag){
                    return '<font face="微软雅黑" size="4" color="#FF0000">' + targetQ + '期' + kw + '：' + zodText + '</font>';
                });

                var re2 = new RegExp('(>' + targetQ + '期' + escKw + '[^<]{0,80}<)', 'g');
                html = html.replace(re2, function(match, inner){
                    if(inner.indexOf('color=') >= 0) return match;
                    return '>' + targetQ + '期' + kw + '：<font color="#FF0000">' + zodText + '</font><';
                });
            }
        }
    }

    // Part 2: 在第一个 cur期 栏目前，注入所有 14 栏 nextQ 期资料
    var nextQLines = [];
    for(var ci = 0; ci < allKeys.length; ci++){
        var ck = allKeys[ci];
        var cdata = content[ck];
        if(!cdata || !Array.isArray(cdata)) continue;
        var nitem = findItemForQ(cdata, nextQ);
        if(!nitem) continue;
        var nzod = getZodText(nitem);
        if(!nzod) continue;
        var dname = displayNames[ck] || ck;
        nextQLines.push('<font face="微软雅黑" size="4" color="#FF0000">' + nextQ + '期' + dname + '：' + nzod + '</font>');
    }

    if(nextQLines.length > 0){
        var firstCurIdx = -1;
        var curRe = new RegExp(cur + '期[^\\\\s<>]{1,15}');
        var curMatch = html.match(curRe);
        if(curMatch){
            firstCurIdx = curMatch.index;
        }
        if(firstCurIdx < 0){
            var curRe2 = new RegExp(cur + '期');
            var curMatch2 = html.match(curRe2);
            if(curMatch2) firstCurIdx = curMatch2.index;
        }
        if(firstCurIdx >= 0){
            var nextBlock = nextQLines.join('<br>') + '<br><br>';
            html = html.substring(0, firstCurIdx) + nextBlock + html.substring(firstCurIdx);
        }
    }

    return html;
}

`;

s = s.substring(0, startIdx) + newFunc + s.substring(endIdx);

fs.writeFileSync(p, s, 'utf8');
console.log('renderSectionsIntoHtml rewritten OK');
console.log('nextQ part: injects all 14 sections before first cur期 occurrence');