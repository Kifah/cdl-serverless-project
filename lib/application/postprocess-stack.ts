import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as secretsManager from 'aws-cdk-lib/aws-secretsmanager';
import 'dotenv/config';

require('dotenv').config();


export enum DeployEnv {
    'test' = 'test',
    'prod' = 'prod',
}

const defaultRegion = "eu-central-1";

interface PostprocessStackProps extends cdk.StackProps {
    backendTable: dynamodb.ITable,
    deployEnv: DeployEnv

}

export class PostprocessStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: PostprocessStackProps) {
        super(scope, id, props);


        const queue = new sqs.Queue(this, 'CdkPlayQueue', {
            visibilityTimeout: cdk.Duration.seconds(300)
        });

        //example of grabbing a secret value for an enviornment
        const secretName = props.deployEnv.toString() + '-CdkAppDemoPassword';
        const dbPasswordSecret = secretsManager.Secret.fromSecretNameV2(
            this,
            'secrets-example',
            secretName,
        );

        //example of grabbing a plan text value, for a specific enviornment
        const configsFromSsmName = props.deployEnv.toString() + '-CdkAppDemoUser';
        const ssmConfigsForEnv = ssm.StringParameter.valueForStringParameter(
            this, configsFromSsmName);

        // a pre-processing lambda receives messages from dynamoDB
        const preProcessHandler = new NodejsFunction(this, "CdkPlayPreProcessHandler", {
            runtime: lambda.Runtime.NODEJS_18_X,
            entry: 'resources/postprocess/preprocess.ts',
            handler: "handler",
            tracing: lambda.Tracing.ACTIVE,
            environment: {
                SQS_URL: queue.queueUrl,
            }
        });

        const postProcessHandler = new NodejsFunction(this, "postprocess", {
            tracing: lambda.Tracing.ACTIVE,
            handler: "handler",
            environment: {
                DEPLOY_ENV: props.deployEnv.toString(),
                DEPLOY_REGION: process.env.CDK_DEFAULT_REGION || defaultRegion,
                DEPLOY_CONFIG: ssmConfigsForEnv.toString()
            }
        });

        const policyStatement = new cdk.aws_iam.PolicyStatement();
        policyStatement.addActions('appconfig:GetConfiguration');
        policyStatement.addAllResources();
        postProcessHandler.addToRolePolicy(policyStatement);


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
