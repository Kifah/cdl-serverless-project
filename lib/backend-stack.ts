import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import * as lambda from "aws-cdk-lib/aws-lambda";


export class BackendStack extends cdk.Stack {

    public readonly backendTable: dynamodb.ITable;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        //add dynamoDB table and give it streaming and permissions needed to forward messages to pre-process lambda
        this.backendTable = new dynamodb.Table(this, 'CdkPlayBackendTable', {
            partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            stream: dynamodb.StreamViewType.NEW_IMAGE
        });


        const backendCarsLambda = new NodejsFunction(this, 'CdkPlayBackendLambda', {
            runtime: lambda.Runtime.NODEJS_18_X,
            tracing: lambda.Tracing.ACTIVE,
            entry: 'resources/backend/backend.ts',
            handler: "handler",
            environment: {
                TABLE_NAME:this.backendTable.tableName
            }
        });

        const lambdaIntegration = new LambdaIntegration(backendCarsLambda);


        const backendRestApi = new RestApi(this, 'CdkPlayBackendApi');
        const spacesResource = backendRestApi.root.addResource('cars');
        spacesResource.addMethod('GET', lambdaIntegration);
        spacesResource.addMethod('POST', lambdaIntegration);

        this.backendTable.grantReadWriteData(backendCarsLambda);


    }
}