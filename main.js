const { createWebhookModule } = require("sipgateio");

const webhookServerOptions = {
  port: process.env.SERVER_PORT || 3000,
  serverAddress: process.env.SERVER_ADDRESS,
};

createWebhookModule()
  .createServer(webhookServerOptions)
  .then((server) => {
    server.onHangUp((hangUpEvent) => {
      if (hangUpEvent.cause === "cancel") {
        console.log("Sending Slack Notification.");
      }
    });
  });