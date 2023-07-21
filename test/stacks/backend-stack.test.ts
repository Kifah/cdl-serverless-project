import * as cdk from 'aws-cdk-lib';
import {Template} from 'aws-cdk-lib/assertions';
import * as Backend from '../../lib/application/backend-stack';


const app = new cdk.App();
const backendStack = new Backend.BackendStack(app, 'BackendTestStack');
const template = Template.fromStack(backendStack);

test('Has DynamoDB', () => {

    template.hasResourceProperties('AWS::DynamoDB::Table', {
        BillingMode: "PAY_PER_REQUEST"
    });

});

test("Matches the snapshot", () => {
    expect(template.toJSON()).toMatchSnapshot();
});



