import {DynamoDBStreamEvent} from "aws-lambda";
import {SQSClient, SendMessageCommand} from "@aws-sdk/client-sqs";


const client = new SQSClient({region: "eu-central-1"});

async function handler(event: DynamoDBStreamEvent) {

    const message = JSON.stringify(event.Records?.pop()?.dynamodb?.NewImage);
    console.log(message);
    const params = {
        DelaySeconds: 2,
        QueueUrl: process.env.SQS_URL,
        MessageBody: message
    }
    try {
        const data = await client.send(new SendMessageCommand(params));
        console.log("Success: ", data);

    } catch (error) {
        console.log(error);

    }

}

export {handler}