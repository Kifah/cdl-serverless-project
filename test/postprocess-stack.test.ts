import * as cdk from 'aws-cdk-lib';
import {Template} from 'aws-cdk-lib/assertions';
import * as Backend from '../lib/backend-stack';
import * as PostProcess from '../lib/postprocess-stack';


const app = new cdk.App();
const backendStack = new Backend.BackendStack(app, 'BackendTestStack');
const postprocessStack = new PostProcess.PostprocessStack(app, 'PostProcessStack', {backendTable: backendStack.backendTable});
const template = Template.fromStack(postprocessStack);

// test('Has DynamoDB', () => {
//
//     template.hasResourceProperties('AWS::DynamoDB::Table', {
//         BillingMode: "PAY_PER_REQUEST"
//     });
//
// });

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



