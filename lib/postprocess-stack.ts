import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import {join} from 'path';

interface PostprocessStackProps extends cdk.StackProps {
    backendTable: dynamodb.ITable
}

export class PostprocessStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: PostprocessStackProps) {
        super(scope, id, props);


        const queue = new sqs.Queue(this, 'CdkPlayQueue', {
            visibilityTimeout: cdk.Duration.seconds(300)
        });

        // a pre-processing lambda receives messages from dynamoDB
        const preProcessHandler = new NodejsFunction(this, "CdkPlayPreProcessHandler", {
            runtime: lambda.Runtime.NODEJS_18_X,
            entry: 'resources/preprocess.ts',
            handler: "handler",
            tracing: lambda.Tracing.ACTIVE,
            environment: {
                SQS_URL: queue.queueUrl,
            }
        });

        const postProcessHandler = new NodejsFunction(this, "CdkPlayHandler", {
            runtime: lambda.Runtime.NODEJS_18_X,
            tracing: lambda.Tracing.ACTIVE,
            entry: 'resources/postprocess.ts',
            handler: "handler",

        });


        const tableEventSource = new lambdaEventSources.DynamoEventSource(props.backendTable, {
            startingPosition: lambda.StartingPosition.LATEST,
            filters: [lambda.FilterCriteria.filter({eventName: lambda.FilterRule.isEqual('INSERT')})],
        });
        preProcessHandler.addEventSource(tableEventSource);
        props.backendTable.grantStreamRead(preProcessHandler);
        queue.grantSendMessages(preProcessHandler);
        queue.grantConsumeMessages(postProcessHandler);
        const sqsEventSource = new lambdaEventSources.SqsEventSource(queue);
        postProcessHandler.addEventSource(sqsEventSource);

    }
}
