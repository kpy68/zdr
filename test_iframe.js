var http=require('http');
http.get('http://localhost:3000/xg.4989028.xyz/kai.html',{followRedirect:false},function(r){
  console.log('status:',r.statusCode);
  console.log('location:',r.headers.location);
});
