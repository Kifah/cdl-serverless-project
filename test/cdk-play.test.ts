import * as cdk from 'aws-cdk-lib';
import {Template} from 'aws-cdk-lib/assertions';
import * as CdkPlay from '../lib/cdk-play-stack';


const app = new cdk.App();
const stack = new CdkPlay.CdkPlayStack(app, 'MyTestStack');
const template = Template.fromStack(stack);


test('SQS Queue Created', () => {

    template.hasResourceProperties('AWS::SQS::Queue', {
        VisibilityTimeout: 300
    });
});

test('Lambda function Created', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {});
});
test('event source mapping for the lambda Created', () => {
    template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {});
});
