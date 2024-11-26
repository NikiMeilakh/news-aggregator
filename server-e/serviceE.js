const nodemailer = require('nodemailer');
const express=require('express');
const cors=require('cors');
const app=express();

app.use(cors());
app.use(express.json())
const port=4000;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nirskiy@gmail.com',
        pass: 'hsvychodwtkzvkxn'
    }
});

app.post('/SMTP', async(req,res)=>{
const {news, email}=req.body;
    console.log(news)


    let message = 'Hello! Its demo test for news aggregator from Nikita Meilakhshtein:\n\n';
    news.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n${item.description}\n${item.url}\n\n`;
    });
    if(news.length===0){
        message+='Where are no news according yours subject:('
    }

    const mailOptions = {
        from: 'nirskiyl@gmail.com',
        to: email,
        subject: 'Your news aggregator',
        text: message,
    };
    try{
    await transporter.sendMail(mailOptions);
    console.log('Email успешно отправлен!');}
    catch(e){
        console.log(e.message)
    }
    res.status(201).json({message:"Email successfully was sent to user!"})
})

app.listen(port, ()=>console.log('Service E listening on port 3004'));


