const nodemailer = require('nodemailer');
const express=require('express');
const cors=require('cors');
const TelegramBot = require('node-telegram-bot-api');
const { CohereClientV2 } = require('cohere-ai');
const app=express();
app.use(cors());
app.use(express.json())
const port=4000;
const cohereToken=process.env.COHERE_TOKEN;
const mailUser=process.env.MAIL_USER;

const cohere = new CohereClientV2({
    token: cohereToken,
});

const telegramToken= process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(telegramToken, { polling: true });
const mailKey=process.env.REACT_APP_MAIL_KEY;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mailUser,
        pass: mailKey
    }
});

async function aiAnalytics(message){
    try {
        const response = await cohere.chat({
            model: 'command-r-plus-08-2024',
            messages: [
                {
                    role: 'user',
                    content: `Please summarize the following news and write a short summary: ${message}`,
                },
            ],
        });
        console.log(response)
        return response.message.content[0].text
    }catch (e) {
        console.log(`AI error: ${e}`)
        return "AI service is not available now"
    }
}

app.post('/SMTP', async(req,res)=>{
const {news, email, telegramId}=req.body;
    console.log(news)


    let message = 'Hello! Its demo test for news aggregator from Nikita Meilakhshtein:\n\n';
    news.forEach((item, index) => {
        message += `${index + 1}. ${item.source.name}\n${item.description}\n${item.url}\n\n`;
    });
    if(news.length===0){
        message+='Where are no news according yours subject:('
    }

    let aiResume="";
if(news.length!==0) {
    let messageForAI = '';
    news.forEach((item, index) => {
        messageForAI += `${index + 1}. ${item.content}\n\n`;
        console.log(item.content +"$$$$$$$$$$$$$$$$")
    });
    aiResume=await aiAnalytics(messageForAI);
    message+=`Ai extract: ${aiResume}`
}

    const mailOptions = {
        from: mailUser,
        to: email,
        subject: 'Your news aggregator',
        text: message,
    };
    try{
    await transporter.sendMail(mailOptions);
    console.log('Email was successfully sent!');}
    catch(e){
        console.log(e.message)
    }
    if(telegramId){
        let messageForTelegram='Hello! Its demo test for news aggregator from Nikita Meilakhshtein:\n\n';
        news.slice(0, 10).forEach((item, index) => {
            messageForTelegram += `${index + 1}. ${item.source.name}\n${item.description}\n${item.url}\n\n`;
        });
        if(news.length===0){
            messageForTelegram+='Where are no news according yours subject:('
        }

        bot.sendMessage(telegramId, messageForTelegram)
            .then(() => console.log('Message was sent to telegram!'))
            .catch(err => console.error('Error with sending message to telegram:', err));
        bot.sendMessage(telegramId, aiResume)
            .then(() => console.log('Message with AI summary was sent to telegram!'))
            .catch(err => console.error('Error with sending AI summary message to telegram:', err));
    }
    res.status(201).json({message:"Email successfully was sent to user!"})
})

app.listen(port, ()=>console.log('Service E listening on port 3004'));


