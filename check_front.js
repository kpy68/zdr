var http=require('http');
http.get('http://localhost:3000/www.4989028.com/',function(r){var d='';r.on('data',function(c){d+=c;});r.on('end',function(){
  var a=(d.match(/327期/g)||[]).length;
  var b=(d.match(/326期/g)||[]).length;
  var c=(d.match(/325期/g)||[]).length;
  var red=(d.match(/color="#FF0000">/g)||[]).length;
  console.log('前端 HTML 期号分布:');
  console.log('  327期 (开奖+1 新插入):',a);
  console.log('  326期 (开奖 latest):',b);
  console.log('  325期:',c);
  console.log('  红色生肖渲染:',red,'处');
  var m=d.match(/.{0,25}327期.{0,80}/g);
  if(m){console.log('\n327期 上下文样本:');m.slice(0,8).forEach(function(x){console.log(' ',x.replace(/\s+/g,' ').substring(0,120));});}
});});