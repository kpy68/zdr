var fs = require('fs');

function extractQishuNum(issue){
    var m = (issue||'').match(/(\d+)\s*期/);
    if(m) return parseInt(m[1],10);
    m = (issue||'').match(/第(\d+)/);
    if(m) return parseInt(m[1],10);
    m = (issue||'').match(/(\d+)/);
    return m ? parseInt(m[1],10) : 0;
}

var content = JSON.parse(fs.readFileSync('admin/content.json','utf8'));
var latestQ = '328';
var cur = parseInt(latestQ, 10);
var nextQ = cur + 1;

var allKeys = ['content_wucuo','content_jinshu','content_sanxiao','content_gaoshou',
    'content_jingzhun','content_sixiao','content_shuangbo','content_jinghua',
    'content_tiandi','content_bashima','content_minnan','content_pingte',
    'content_qinqi','content_jingxuan'];

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

function findItemForQ(data, targetQ){
    var re = new RegExp(targetQ + '\\s*期');
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

var nextQLines = [];
for(var ci = 0; ci < allKeys.length; ci++){
    var ck = allKeys[ci];
    var cdata = content[ck];
    if(!cdata || !Array.isArray(cdata)) { console.log(ck, 'SKIP: no array'); continue; }
    var nitem = findItemForQ(cdata, nextQ);
    if(!nitem){ console.log(ck, 'SKIP: no item for Q', nextQ); continue; }
    var nzod = getZodText(nitem);
    if(!nzod){ console.log(ck, 'SKIP: no zod text'); continue; }
    var dname = displayNames[ck] || ck;
    nextQLines.push('<font face="微软雅黑" size="4" color="#FF0000">' + nextQ + '期' + dname + '：' + nzod + '</font>');
}

console.log('nextQLines count:', nextQLines.length);
nextQLines.forEach(function(l){ console.log('  ', l); });