const mongoose = require('mongoose');
const axios = require("axios");
const amqp = require('amqplib');
//const {response} = require("express");

mongoose.connect('mongodb+srv://nirskiy_demo:T62JwPKwnSIcR0C3@cluster0.8kaac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const userSchema = new mongoose.Schema({
    email: String,
    categories: [String],
    language: String,
});

const User = mongoose.model('User', userSchema);

const watchUsers = () => {
    const changeStream = User.watch();

    changeStream.on('change', async (change) => {
        console.log('Change detected:', change);
        try {
            if (change.operationType === 'insert'|| change.operationType === 'update') {
                const newUser = await User.findById(change.documentKey._id);
                console.log('New user:', newUser);
                //const body = JSON.stringify({
                  //  categories: newUser.categories,
                   // language: newUser.language });
                try {
                   /* const response = await fetch(`http://server-d:3010/apiData`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: body
                    });
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status}`);
                    }*/
                    const newsFromApi= await queueToApi(newUser.categories,newUser.language);
                    //const responseData=await response.json();
                    const dataToSMTP= {
                        news: newsFromApi,
                        email: newUser.email,
                    };
                    console.log(JSON.stringify(dataToSMTP));
                    const responseToSMTP = await axios.post('http://server-e:4000/SMTP', dataToSMTP);
                    console.log(responseToSMTP.data)
                }
                catch (error) {
                    console.error('Failed to add the film:', error);
                }
            }
            else {
                throw new Error();
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    });
    console.log('Start searching updates in "User".');
};

watchUsers();

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