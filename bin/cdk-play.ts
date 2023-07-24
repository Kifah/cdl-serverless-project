#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {DeployEnv, PostprocessStack} from '../lib/application/postprocess-stack';
import {BackendStack} from "../lib/application/backend-stack";
import {CiCdStack} from "../lib/infrastructure/ci-cd-stack";
import 'dotenv/config'

require('dotenv').config({override: true})

// import {AwsSolutionsChecks} from "cdk-nag";
const app = new cdk.App();
const envEU = {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION};

new CiCdStack(app, 'CiCdStack', {env: envEU});
const backendStack = new BackendStack(app, 'BackendStack', {env: envEU});
new PostprocessStack(app, 'PostProcessStack', {
    backendTable: backendStack.backendTable,
    deployEnv: DeployEnv.test,
    env: envEU
});

// cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));