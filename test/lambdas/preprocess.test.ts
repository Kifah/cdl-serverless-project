import {mockClient} from "aws-sdk-client-mock";

import {SQSClient, SendMessageCommand, SendMessageRequest} from "@aws-sdk/client-sqs";
import {handler} from "../../resources/postprocess/preprocess";
// @ts-ignore
import * as event from "./events/DynamoDBStreamEvent.json";

const sqsMock = mockClient(SQSClient);


beforeEach(() => {
    sqsMock.reset();
});
test("should send messages to queue", async () => {

    const input = {
        QueueUrl: "SQS_URL",
        MessageBody: '{"id":{"S":"amtaklee-123"}}',
        DelaySeconds: 2,
    };
    process.env.SQS_URL = "SQS_URL";
    await handler(event);
    expect(sqsMock.commandCalls(SendMessageCommand)).toHaveLength(1);
    expect(
        sqsMock.commandCalls(
            SendMessageCommand,
            input
        )
    ).toHaveLength(1);
});
