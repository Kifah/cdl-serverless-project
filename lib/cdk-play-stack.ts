import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';


export class CdkPlayStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const queue = new sqs.Queue(this, 'CdkPlayQueue', {
            visibilityTimeout: cdk.Duration.seconds(300)
        });

        const handler = new lambda.Function(this, "CdkPlayHandler", {
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources"),
            handler: "index.handler",

        });

        queue.grantSendMessages(handler);

        const eventSource = new lambdaEventSources.SqsEventSource(queue);
        handler.addEventSource(eventSource);
    }
}
