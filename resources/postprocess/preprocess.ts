import {DynamoDBStreamEvent} from "aws-lambda";
import {SQSClient, SendMessageCommand} from "@aws-sdk/client-sqs";
import {Logger, ILogObj} from "tslog";


const client = new SQSClient({region: "eu-central-1"});
const log: Logger<ILogObj> = new Logger();

async function handler(event: DynamoDBStreamEvent) {

    const message = JSON.stringify(event.Records?.pop()?.dynamodb?.NewImage);
    log.info(message);
    const params = {
        DelaySeconds: 2,
        QueueUrl: process.env.SQS_URL,
        MessageBody: message
    }
    try {
        const data = await client.send(new SendMessageCommand(params));
        log.info("Success: ", data);

    } catch (error) {
        log.error(error);

    }

}

export {handler}