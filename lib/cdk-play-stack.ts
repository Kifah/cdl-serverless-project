import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';


export class CdkPlayStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);



        //add dynamoDB table and give it streaming and permissions needed to forward messages to pre-process lambda
        const table = new dynamodb.Table(this, 'CdkPlayTable', {
            partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
            stream: dynamodb.StreamViewType.NEW_IMAGE,
        });

        const queue = new sqs.Queue(this, 'CdkPlayQueue', {
            visibilityTimeout: cdk.Duration.seconds(300)
        });

        // a pre-processing lambda receives messages from dynamoDB
        const preProcessHandler = new lambda.Function(this, "CdkPlayPreProcessHandler", {
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources"),
            handler: "preprocess.handler",
            environment: {
                SQS_URL: queue.queueUrl,
            }

        });

        const finalHandler = new lambda.Function(this, "CdkPlayHandler", {
            runtime: lambda.Runtime.NODEJS_18_X,
            code: lambda.Code.fromAsset("resources"),
            handler: "final.handler",

        });



        const tableEventSource = new lambdaEventSources.DynamoEventSource(table, {
            startingPosition: lambda.StartingPosition.LATEST,
            filters: [lambda.FilterCriteria.filter({eventName: lambda.FilterRule.isEqual('INSERT')})],
        });
        preProcessHandler.addEventSource(tableEventSource);
        table.grantStream(preProcessHandler);
        queue.grantSendMessages(preProcessHandler);
        queue.grantSendMessages(finalHandler);
        const sqsEventSource = new lambdaEventSources.SqsEventSource(queue);
        finalHandler.addEventSource(sqsEventSource);

    }
}
