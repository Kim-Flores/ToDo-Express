const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = 'mongodb+srv://list:list@cluster0.a504u.mongodb.net/todolist?retryWrites=true&w=majority';
const dbName = "Todo";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('counter').find().toArray((err, counter) => {
  db.collection('itemsList').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {itemsList: result, count: counter})
  })
})
})

app.post('/toDo', (req, res) => {
  db.collection('itemsList').insertOne({item: req.body.item}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/itemPlace', (req, res) => {
  db.collection('itemsList')
  .findOneAndUpdate({item: req.body.item}, {
    $set: {
     completed: "#8bc34a"
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/clearCompleted', (req, res) => {
  db.collection('counter').findOneAndUpdate({name: "counting"},{$inc:{count: req.body.count}}, (err, result) => {
  db.collection('itemsList').deleteMany({completed: req.body.completed}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
})

app.delete('/clearAll', (req, res) => {
  db.collection('itemsList').deleteMany({}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

