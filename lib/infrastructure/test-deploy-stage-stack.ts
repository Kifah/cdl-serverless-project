import * as cdk from 'aws-cdk-lib';
import {Construct} from "constructs";
import {BackendStack} from "../application/backend-stack";
import {DeployEnv, PostprocessStack} from "../application/postprocess-stack";

const envEU = {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION};


export class TestDeployStage extends cdk.Stage {

    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        const backendStack = new BackendStack(this, 'BackendStack', {env: envEU});
        new PostprocessStack(this, 'PostProcessStack', {
            env: envEU,
            backendTable: backendStack.backendTable,
            deployEnv: DeployEnv.test
        });

    }
}