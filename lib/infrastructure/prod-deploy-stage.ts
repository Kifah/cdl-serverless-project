import * as cdk from 'aws-cdk-lib';
import {Construct} from "constructs";
import {BackendStack} from "../application/backend-stack";
import {DeployEnv, PostprocessStack} from "../application/postprocess-stack";
import 'dotenv/config'
require('dotenv').config({ override: true })


const envEU = {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_ACCOUNT};

export class ProdDeployStage extends cdk.Stage {


    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        const backendStack = new BackendStack(this, 'BackendStack', {env: envEU});
        new PostprocessStack(this, 'PostProcessStack', {
            env: envEU,
            backendTable: backendStack.backendTable,
            deployEnv: DeployEnv.prod
        });

    }
}