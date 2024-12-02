const axios = require("axios");
const amqp = require('amqplib');

async function managerGet() {
    try{

        const connection = await amqp.connect('amqp://user:user1234@rabbitmq:5672/');
        const channel = await connection.createChannel();

        await channel.assertQueue('toManager', { durable: true });
        console.log('Queue "toManager" exists. Waiting for messages...');

        await channel.consume('toManager', async (user) => {
            try {
                console.log(`Received message: ${user.content.toString()}`);
                const data = JSON.parse(user.content.toString());
                if(data){
                    await distributeFunction(data)
                channel.ack(user);
            }} catch (error) {
                console.error('Message processing failed:', error);
                channel.nack(user, false, false);
            }
        });

    } catch (e) {
        console.log("Problem with connection to rabbitmq"+e.message);
    }
}
managerGet();

async function distributeFunction(data){
    try {
        const newsFromApi= await queueToApi(data.categories,data.language);
        console.log(newsFromApi);
        const dataToSMTP= {
            news: newsFromApi,
            email: data.email,
            telegramId: data.telegramId,
        };
        console.log(JSON.stringify(dataToSMTP));
        const responseToSMTP = await axios.post('http://server-e:4000/SMTP', dataToSMTP);
        console.log(responseToSMTP.data)
    }
    catch (e) {
        console.log(e)
    }
}


async function queueToApi(categories, language) {
    const message = {
        categories: categories,
        language: language,
    };

    try {
        const connection = await amqp.connect('amqp://user:user1234@rabbitmq:5672/');
        const channel = await connection.createChannel();
        await channel.assertQueue('toApi', { durable: true });
        const correlationId = generateUuid();
        const replyQueue = await channel.assertQueue('', { exclusive: true });

        channel.sendToQueue('toApi', Buffer.from(JSON.stringify(message)), {
            correlationId: correlationId,
            replyTo: replyQueue.queue,
        });

        console.log('Message sent to queue, awaiting response...');

        const response = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Response timeout'));
            }, 10000);

            channel.consume(
                replyQueue.queue,
                (msg) => {
                    if (msg.properties.correlationId === correlationId) {
                        clearTimeout(timeout);
                        resolve(msg.content.toString());
                        channel.ack(msg)
                    }
                },
                { noAck: false}
            );
        });
        console.log('Response received:', response);
        await channel.close();
        await connection.close();
        return JSON.parse(response.toString());
    } catch (err) {
        console.log(err, 'Trouble with connection to RabbitMQ');
    }

}

function generateUuid() {
    return Math.random().toString() + Math.random().toString() + Math.random().toString();
}