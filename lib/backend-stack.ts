import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {CfnOutput} from "aws-cdk-lib";


export class BackendStack extends cdk.Stack {

    public readonly backendTable: dynamodb.ITable;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.backendTable = new dynamodb.Table(this, 'CdkPlayBackendTable', {
            partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            pointInTimeRecovery: true,
            stream: dynamodb.StreamViewType.NEW_IMAGE
        });


        const backendCarsLambda = new NodejsFunction(this, 'CdkPlayBackendHandler', {
            runtime: lambda.Runtime.NODEJS_18_X,
            tracing: lambda.Tracing.ACTIVE,
            entry: 'resources/backend/backend.ts',
            handler: "handler",
            environment: {
                TABLE_NAME: this.backendTable.tableName
            }
        });

        const lambdaIntegration = new LambdaIntegration(backendCarsLambda);


        const backendRestApi = new RestApi(
            this, 'CdkPlayBackendApi');
        const spacesResource =
            backendRestApi.root.addResource('issues');
        spacesResource.addMethod('GET', lambdaIntegration);
        spacesResource.addMethod('POST', lambdaIntegration);

        this.backendTable.grantReadWriteData(backendCarsLambda);

        new CfnOutput(this, 'ApiEndpoint', {
            value: backendRestApi.url
        });

    }
}