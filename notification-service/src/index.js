const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

const queue = 'booking.confirmed';
const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://rabbitmq';

async function start() {
  try {
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log('Notification Service connected to RabbitMQ and waiting for booking.confirmed events');

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const payload = JSON.parse(msg.content.toString());
        console.log('Received notification event:', payload.event);
        console.log('Booking details:', payload.data);
        console.log(`Simulated email: Booking ${payload.data._id} confirmed for user ${payload.data.userId}. Total cost: ${payload.data.totalCost}€`);
        channel.ack(msg);
      }
    }, { noAck: false });
  } catch (error) {
    console.error('Notification Service RabbitMQ error:', error);
    setTimeout(start, 5000);
  }
}

start();
