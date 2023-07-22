import * as cdk from 'aws-cdk-lib';
import {Construct} from "constructs";
import {BackendStack} from "../application/backend-stack";
import {DeployEnv, PostprocessStack} from "../application/postprocess-stack";


const accountId = '832476498399';
const region = 'eu-central-1';
const envEU = {account: accountId, region: region};

export class TestDeployStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        const backendStack = new BackendStack(this, 'BackendStack', {env: envEU});
        new PostprocessStack(this, 'PostProcessStack', {
            backendTable: backendStack.backendTable,
            deployEnv: DeployEnv.test
        });

    }
}