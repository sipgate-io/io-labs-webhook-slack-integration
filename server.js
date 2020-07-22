const { createWebhookModule } = require("sipgateio");
const axios = require("axios").default;

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
if (!slackWebhookUrl) {
  console.error(
    "Please provide a Slack webhook URL via the environment variable SLACK_WEBHOOK_URL"
  );
  return;
}

const serverAddress = process.env.SERVER_ADDRESS;
if (!serverAddress) {
  console.error(
    "Please provide a server address via the environment variable SERVER_ADDRESS"
  );
  return;
}

const webhookServerOptions = {
  port: process.env.SERVER_PORT || 8080,
  serverAddress,
};

createWebhookModule()
  .createServer(webhookServerOptions)
  .then((server) => {
    console.log(
      `Server running at ${webhookServerOptions.serverAddress}\n` +
        "Ready for calls 📞"
    );

    server.onHangUp((hangUpEvent) => {
      if (hangUpEvent.cause === "cancel") {
        axios
          .post(slackWebhookUrl, {
            text: `Canceled call from ${hangUpEvent.from} to ${hangUpEvent.to}`,
          })
          .catch(console.error);
      }
    });
  });
