const { createWebhookModule } = require("sipgateio");
const axios = require("axios").default;

const webhookServerOptions = {
  port: process.env.SERVER_PORT || 8080,
  serverAddress: process.env.SERVER_ADDRESS,
};

createWebhookModule()
  .createServer(webhookServerOptions)
  .then((server) => {
    server.onHangUp((hangUpEvent) => {
      if (hangUpEvent.cause === "cancel") {
        axios.post(process.env.SLACK_WEBHOOK_URL, {
          text: `Cancelled call from ${hangUpEvent.from} to ${hangUpEvent.to}`,
        });
      }
    });
  });
