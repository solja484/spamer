const express = require('express');
const server = express();
let bodyParser = require('body-parser');
let ObjectId = require('mongodb').ObjectId;

const mongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/spamer";
let db;
mongoClient.connect(url, {useUnifiedTopology: true},
    function (err, client) {
        if (err) {
            return console.log(err);
        }
        console.log("Connection established");
        db = client.db('spamer');
    }
);

server.use(bodyParser.json());       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

let messages = ['Посміхнись:)', 'Хорошого дня!', 'Вітаємо! Ви виграли машину!', 'Ваше повідомлення'];
server.listen(8888);
console.log('Server is running on port 8888');
server.set('view engine', 'pug');

server.get('/', function (req, res) {

    db.collection("users").find().toArray(function (err, data) {
        res.render(__dirname + "/spamer-page.pug", {users: data, messages: messages});
    });
});

server.post('/users', function (req, res) {
    console.log(req.body);
    db.collection("users").insertOne(req.body).then(
        (result, err) => {
            if (err) return console.log(err);
            console.log("added successful");
            res.redirect('/');
        }
    )

});

server.post('/spam', function (req, res) {
    console.log(req.body);
    if (req.body) {
        db.collection("users").find().toArray(function (err, data) {
            let mess;
            if(req.body.selection==messages[messages.length-1])
                mess=req.body.message;
            else mess=req.body.selection;
            if (err) return console.log(err);
            let l = data.length;
            for (let i = 0; i < l; i++)
                send(data.pop().email, mess);

            console.log("Спам успішно розісланий!");
            res.redirect('/');
        });
    }
});

server.get('/edit/:id',function(req,res){
    db.collection("users").findOne(ObjectId(req.params.id)).then(
        ( data, err)=> {
        if (err) return console.log(err);
        res.render(__dirname + "/spamer-edit.pug", {user: data,id:req.params.id});
    });
});


server.post('/users/:id', function (req, res) {
    console.log(req.body);
    db.collection('users').updateOne({_id:ObjectId(req.params.id)},{ $set:req.body}).then(
        (result, err) => {
            if (err) return console.log(err);
            console.log("updated successful");
            res.redirect('/');
        }
    )

});


// delete
server.get('/delete/:id',function(req,res){
    db.collection("users").deleteOne({_id:ObjectId(req.params.id)}).then(
        (result, err) => {
            if (err) return console.log(err);
            console.log("deleted successful");
            res.redirect('/');
        })
});


async function send(mailto, message) {
    let mailfrom = 'gingermias@gmail.com';
    //mailto = 'solja484@gmail.com';

    let nodemailer = require("nodemailer");
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: "gingermias@gmail.com",
            pass: "barbareum47"
        }
    });

    let result = await transporter.sendMail({
        from: mailfrom,
        to: mailto,
        subject: "",
        text: message

    });
    console.log(result);

}

