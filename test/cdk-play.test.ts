import * as cdk from 'aws-cdk-lib';
import {Template} from 'aws-cdk-lib/assertions';
import * as CdkPlay from '../lib/cdk-play-stack';


const app = new cdk.App();
const stack = new CdkPlay.CdkPlayStack(app, 'MyTestStack');
const template = Template.fromStack(stack);

test('Has DynamoDB', () => {

    template.hasResourceProperties('AWS::DynamoDB::Table', {
        BillingMode: "PAY_PER_REQUEST"
    });

});

test('Has SQS', () => {

    template.hasResourceProperties('AWS::SQS::Queue', {
        VisibilityTimeout: 300
    });

});

test('Has Lambda with correct functions', () => {

    template.hasResourceProperties("AWS::Lambda::Function", {
        Handler: "preprocess.handler",
        Runtime: "nodejs18.x",
    });
    template.hasResourceProperties("AWS::Lambda::Function", {
        Handler: "final.handler",
        Runtime: "nodejs18.x",
    });

    template.resourceCountIs("AWS::Lambda::Function", 2);
});

test("Matches the snapshot", () => {
    expect(template.toJSON()).toMatchSnapshot();
});



