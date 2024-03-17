const amqp = require("amqplib")
require('dotenv').config()

connect()
//some random comments

async function connect() {
    try {
        const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_SERVER}`)
        const channel = await connection.createChannel()
        const queue = await channel.assertQueue(process.env.QUEUE_NAME,{ durable: true })
        channel.prefetch(1);
        channel.consume(process.env.QUEUE_NAME,(message)=>{
            let data = JSON.parse(message.content.toString())
            console.log(`Message Received:`, data);
            setTimeout(() => {
                console.log('Processed:', data.id);
                channel.ack(message); // Acknowledge message
              }, 1000);
        })
    } catch (error) {
        console.log(`Error`, error);
    }
}