import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';


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


    }
}