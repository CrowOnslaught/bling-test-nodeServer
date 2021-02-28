'use strict'

const express = require('express');
const bodyParser = require ('body-parser');
const nodemailer = require('nodemailer');

const port = 8000;

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Outcomes
app.get('/test', function(req,res) //A test request (GET)
{
    console.log('TESTING');
});
app.post('/sendMail', function(req,res) //Mail request, gets data, then returns success or error (POST)
{
    let params = req.body;

    console.log(params);
    sendMail(params)
      .then(()=>
      {
        return res.status(200).send(
          {
            status: 'sucess',
            message: 'Mail sended to ' + params.to + '!!!',
          }
        )
      })  
    .catch(() => {
      return res.status(500).send(
        {
          status: 'error',
          message: 'Something happened with ' + params.to + ' D:',
        }
      )
    });
});
app.get('/info', function(req,res) //Info request, for more testing, returns sucess (GET)
{
  return res.status(200).send(
    {
      author: 'Jaume Garcia',
      port: port,
      message:'I am data returned by the server!!'
    }
  )
});


//SEND EMAIL
async function sendMail(params) {
    // Generate test SMTP service account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      name: "test.com",
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
      logger: true,
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Jaume Server 👻" <foo@example.com>', // sender address
      to: params.to, // list of receivers
      subject: "Check this image! ✔", // Subject line
      html: "<img src='"+params.url +"'><h1>"+params.desc+"</h1><h2> by "+params.user+"</h2> ", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  

//Run app
app.listen(port, () => {  console.log('We are live on ' + port);});
module.exports = app;