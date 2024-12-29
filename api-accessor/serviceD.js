const amqp = require('amqplib');

const apiKey=process.env.API_KEY;

async function responseToApi(categories, language) {
     const myNews=[];
    for (const category of categories) {
        try {
            const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${language}&category=${category}&pageSize=8&apiKey=${apiKey}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            myNews.push(...data.articles);
            console.log(data.articles);
        } catch (e) {
            console.error(`Error with processing category "${category}":`, e.message);
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




