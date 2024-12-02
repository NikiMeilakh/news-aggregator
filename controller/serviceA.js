const express=require('express');
const cors = require('cors');
const app=express();
const amqp = require('amqplib');

const port = 3001;
app.use(express.json());
app.use(cors());

const connectRabbitMQ = async (email,selectedCategories,selectedLanguage, telegramId) => {
    const message={
        email: email,
        categories: selectedCategories,
        language: selectedLanguage,
        telegramId: telegramId
    }
    try {
        const connection = await amqp.connect('amqp://user:user1234@rabbitmq:5672/');
        const channel = await connection.createChannel();
        await channel.assertQueue('toMongo',{ durable: true })
        await channel.sendToQueue('toMongo',Buffer.from(JSON.stringify(message)),{
            persistent: true
        })
        console.log(`Message send to queue "toMongo" with message ${JSON.stringify( message)}`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
};

app.post('/manager', async (req, res) => {
    const { email, selectedCategories, selectedLanguage, telegramId } = req.body;
    if(email&&selectedCategories&&selectedLanguage){
    try {
        await connectRabbitMQ(email, selectedCategories, selectedLanguage, telegramId);
        console.log("Message successfully queued");
        res.status(201).json({ message: 'Message successfully queued' });
    } catch (error) {
        console.error("Failed to queue message:", error);
        res.status(500).json({ error: 'Failed to queue message' });
    }}
    else{ res.status(500).json({ message: 'Email, categories and language are required' });}
});

app.listen(port,()=> console.log('ServiceA listening port 3001'));

module.exports=app;