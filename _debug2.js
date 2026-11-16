var http = require('http');
http.get('http://localhost:3000/www.4989028.com/', function(res){
    var d = '';
    res.on('data', function(c){ d += c; });
    res.on('end', function(){
        console.log('HTML total length:', d.length);
        
        // 1. 329 全部位置
        var re329 = /329期/g;
        var t1, positions329 = [];
        while((t1 = re329.exec(d)) !== null){
            positions329.push(t1.index);
            if(positions329.length <= 5) console.log('  329期 pos', t1.index, ':', d.substring(t1.index, t1.index+40));
        }
        console.log('Total 329期:', positions329.length);
        
        // 2. 中间某个 329 前后 200 字符
        if(positions329.length > 0){
            var mid = positions329[Math.floor(positions329.length/2)];
            console.log('\n=== 中部 329期 (pos=' + mid + ') 前后 ===');
            console.log('--- 前 100 ---');
            console.log(d.substring(Math.max(0,mid-100), mid));
            console.log('--- 后 150 ---');
            console.log(d.substring(mid, mid+150));
        }
        
        // 3. 扫描逻辑测试
        var cur = 328;
        var scanRe = new RegExp(cur + '期([^\\s<>【\\(\\d]|[^\\s<>【\\(]{1,20})', 'g');
        var tm, cnt=0;
        var firstFew = [];
        while((tm = scanRe.exec(d)) !== null){
            if(cnt < 5) firstFew.push({idx: tm.index, name: tm[1].trim()});
            cnt++;
        }
        console.log('\nscanRe matched:', cnt, 'items');
        firstFew.forEach(function(x){ console.log('  idx='+x.idx, 'name=['+x.name+']'); });
    });
});