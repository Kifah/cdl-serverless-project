const {SQSClient, SendMessageCommand, SendMessageRequest: SendMessageRequest} = require('@aws-sdk/client-sqs')

const client = new SQSClient({region: "eu-central-1"});

exports.handler = async function (event: any, context: any) {

    const message = JSON.stringify(event.Records[0].dynamodb.NewImage);
    console.log(message);
    /** @type SendMessageRequest */
    const params = {
        DelaySeconds: 2,
        QueueUrl: process.env.SQS_URL,
        MessageBody: message
    }
    try {
        const data = await client.send(new SendMessageCommand(params));
        console.log("Success", data);

    } catch (error) {
        console.error(error)

    }

}