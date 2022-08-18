const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient
app.set('view engine', 'ejs');


var db;

MongoClient.connect('mongodb+srv://jeju_booking:qwer1234@cluster0.dsant.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
  if (에러) return console.log(에러)
  
  db = client.db('jeju_booking');

  });

  app.listen(8080, function() {
    console.log('listening on 8080')

})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
})
app.get('/notice', function(req, res){
  res.sendFile(__dirname + '/notice.html');
})
app.get('/detail', function(req, res){
  res.sendFile(__dirname + '/detail.html');
})
app.get('/booking', function(req, res){
  res.sendFile(__dirname + '/booking.html');
})
app.get('/map', function(req, res){
  res.sendFile(__dirname + '/map.html');
})

app.post("/booked", function(req, res){
  res.send("예약완료");
  db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
    console.log(결과.totalPost);
    var 총게시물갯수 = 결과.totalPost;
    db.collection('post').insertOne({ _id : 총게시물갯수 + 1, 이름 : req.body.name, 연락처 : req.body.phone_number, 오는날 : req.body.checkin, 가는날 : req.body.checkout, 목적 : req.body.why, 인원 : req.body.person}, function(에러, 결과){
      console.log('저장완료');
      db.collection('counter').updateOne({name:"게시물갯수"}, {$inc : {totalPost : 1}}, function(에러, 결과){
        if(에러){return console.log(에러)};
      })
    })
  });
})

app.get('/complete', function(req, res){
  db.collection('post').find().toArray(function(에러, 결과){
    console.log(결과);
    res.render('complete.ejs', {posts : 결과});
  });
})