const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';
const EXCHANGE = 'booking_exchange';
let channel;

async function connectRabbit() {
  if (channel) return channel;
  const connection = await amqp.connect(RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
  console.log('Connected to RabbitMQ');
  return channel;
}

async function publishEvent(routingKey, message) {
  const ch = await connectRabbit();
  const payload = Buffer.from(JSON.stringify(message));
  ch.publish(EXCHANGE, routingKey, payload, { persistent: true });
}

module.exports = { connectRabbit, publishEvent };
