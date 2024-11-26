//const express=require('express');
//const cors= require('cors');
//const app=express();
const amqp = require('amqplib');
//app.use(express.json());
//app.use(cors());
//const port=3010;

/*app.post('/apiData', async (req,res)=>{
    const {categories, language} = req.body
    const myNews=[];
    for (const category of categories) {
        try {
            const response = await fetch(`https://newsapi.org/v2/top-headlines/sources?category=${category}&language=${language}&apiKey=347d629c98c54dbcb681c97d113af615`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            myNews.push(...data.sources);
            console.log(data.sources);
        } catch (e) {
            console.error(`Ошибка при обработке категории "${category}":`, e.message);
        }
    }
res.status(201).json({message: "successful got data from api", data:myNews});

}) */

async function responseToApi(categories, language) {
     const myNews=[];
    for (const category of categories) {
        try {
            const response = await fetch(`https://newsapi.org/v2/top-headlines/sources?category=${category}&language=${language}&apiKey=347d629c98c54dbcb681c97d113af615`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            myNews.push(...data.sources);
            console.log(data.sources);
        } catch (e) {
            console.error(`Ошибка при обработке категории "${category}":`, e.message);
        }
    }
    return myNews;
}

async function apiConsumer() {
    try {
        const connection = await amqp.connect('amqp://user:user1234@rabbitmq:5672/');
        const channel = await connection.createChannel();
        await channel.assertQueue('toApi', { durable: true });
        console.log('Waiting for messages in myQueue...');

        await channel.consume(
            'toApi',
            async (msg) => {
                if (msg !== null) {
                    console.log('Message received:', msg.content.toString());

                    const receivedMessage = JSON.parse(msg.content.toString());
                    const answer = await responseToApi(receivedMessage.categories,receivedMessage.language,);

                    if (msg.properties.replyTo) {
                        console.log(`Sending response to queue: ${msg.properties.replyTo}`);
                        channel.sendToQueue(
                            msg.properties.replyTo,
                            Buffer.from(JSON.stringify(answer)),
                            {
                                correlationId: msg.properties.correlationId,
                            }
                        );
                    } else {
                        console.log('No replyTo queue specified, skipping response.');
                    }

                    channel.ack(msg);
                }
            },
            { noAck: false }
        );
    } catch (err) {
        console.error('Error in consumer:', err);
    }
}

apiConsumer();

//app.listen(port,()=>console.log('ServiceD listening on port 3010'))



