let http = require('http');
let express = require('express');


let server=express();
server.listen(8888);
console.log('Server is running on port 8888');


server.use(express.static(__dirname));

server.get('/', function(req, res){
    res.sendFile(__dirname+"/main.html");
});


async function send(mailfrom) {
    let nodemailer=require("nodemailer");
    let transporter = nodemailer.createTransport({
        host: smtp.gmail.com,
        port: 587,
        secure: false,
        auth: {
            user: "gingermias@gmail.com",//testEmailAccount.user,
            pass: "barbareum47"//testEmailAccount.pass
        }
    });

    let result = await transporter.sendMail({
        from: mailfrom,
        to: "o.kirdiaieva@gmail.com",
        subject: "Miaoo!!",
        text: "Miaoo!"

    });
    console.log(result);
}