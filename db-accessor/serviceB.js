const mongoose = require('mongoose');
const amqp = require('amqplib');
const apiKey=process.env.REACT_APP_MONGO_KEY;


const mongoseConnection=()=>{
    mongoose.connect(`mongodb+srv://nirskiy_demo:${apiKey}@cluster0.8kaac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
    }).then(() => console.log('MongoDB connected'))
        .catch(err => {console.error('MongoDB connection error:', err)
            console.log('Retrying connection in 5 seconds...');
            setTimeout(mongoseConnection, 5000);
        });
}

mongoseConnection()

mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose connection disconnected');
    setTimeout(() => {
        console.log('Retrying MongoDB connection...');
        mongoseConnection();
    }, 5000);
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    categories: { type: [String], required: true },
    language: { type: String, required: true },
    telegramId: { type: String, required: false },
});

const User = mongoose.model('User', userSchema);

const addOrReplaceUser = async (userData) => {
    try {
        const existingUser = await User.findOne();
        if (existingUser) {
            existingUser.email = userData.email;
            existingUser.categories = userData.categories;
            existingUser.language = userData.language;
            existingUser.telegramId = userData.telegramId;
            await existingUser.save();
            return { message: 'User updated', user: existingUser };
        } else {
            const newUser = new User(userData);
            await newUser.save();
            return { message: 'User created', user: newUser};
        }
    } catch (error) {
        throw new Error(`Error adding or updating user: ${error.message}`);
    }
};

const watchUsers = () => {
    const changeStream = User.watch();

    changeStream.on('change', async (change) => {
        console.log('Change detected:', change);
        try {
            if (change.operationType === 'insert'|| change.operationType === 'update') {
                const newUser = await User.findById(change.documentKey._id);
                console.log('New user:', newUser)
                await callManager(newUser);
        }
        } catch (e) {
            console.log(e)
        }
    })
}

watchUsers();

 async function callManager(newUser){
    try {
        const connection = await amqp.connect('amqp://user:user1234@rabbitmq:5672/');
        const channel = await connection.createChannel();
        await channel.assertQueue('toManager',{ durable: true })
        await channel.sendToQueue('toManager',Buffer.from(JSON.stringify(newUser)),{
            persistent: true
        })
        console.log(`Message send to queue "toManager" with message ${JSON.stringify(newUser)}`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
}


async function receiveRabbitMq() {
         try{

             const connection = await amqp.connect('amqp://user:user1234@rabbitmq:5672/');
             const channel = await connection.createChannel();

             await channel.assertQueue('toMongo', { durable: true });
             console.log('Queue "toMongo" exists. Waiting for messages...');

             await channel.consume('toMongo', async (message) => {
                 try {
                     console.log(`Received message: ${message.content.toString()}`);
                     const data = JSON.parse(message.content.toString());
                     if(data){
                         await addOrReplaceUser(data);}
                     channel.ack(message);
                 } catch (error) {
                     console.error('Message processing failed:', error);
                     channel.nack(message, false, false);
                 }
             });

         } catch (e) {
             console.log("Problem with connection to rabbitmq"+e.message);
         }
}

receiveRabbitMq();
