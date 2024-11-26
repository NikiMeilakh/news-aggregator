const mongoose = require('mongoose');
const amqp = require('amqplib');


mongoose.connect('mongodb+srv://nirskiy_demo:T62JwPKwnSIcR0C3@cluster0.8kaac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    categories: { type: [String], required: true },
    language: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const addOrReplaceUser = async (userData) => {
    try {
        const existingUser = await User.findOne();
        if (existingUser) {
            existingUser.email = userData.email;
            existingUser.categories = userData.categories;
            existingUser.language = userData.language;
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
