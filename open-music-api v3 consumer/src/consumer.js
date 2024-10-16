require("dotenv").config();
const amqp = require("amqplib");
const PlaylistService = require("./PlaylistService");
const MailSender = require("./MailSender");
const Listener = require("./listener");

const init = async () => {
  const playlistService = new PlaylistService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistService, mailSender);

  try {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue("export:playlists", {
      durable: true,
    });

    channel.consume("export:playlists", listener.listen, { noAck: true });
    console.log("Waiting for messages in export:playlists...");
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error.message);
    process.exit(1);
  }
};

init();
