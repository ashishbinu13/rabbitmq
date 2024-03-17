const amqp = require("amqplib")
require('dotenv').config()

const messages = require('./messages.json')

connect()

async function connect() {
    try {
        const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_SERVER}`)
        const channel = await connection.createChannel()
        const queue = await channel.assertQueue(process.env.QUEUE_NAME,{ durable: true })
        for(let message of messages) {
            channel.sendToQueue(process.env.QUEUE_NAME,Buffer.from(JSON.stringify(message)),{ persistent: true })
            console.log(`Message sent. ID: ${message.id}`);
        }
    } catch (error) {
        console.log(`Error`, error);
    }
}