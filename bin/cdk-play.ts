#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {DeployEnv, PostprocessStack} from '../lib/application/postprocess-stack';
import {BackendStack} from "../lib/application/backend-stack";
import {CiCdStack} from "../lib/infrastructure/ci-cd-stack";
// import {AwsSolutionsChecks} from "cdk-nag";

const accountId = '832476498399';
const region = 'eu-central-1';
const envEU = {account: accountId, region: region};

const app = new cdk.App();
new CiCdStack(app, 'CiCdStack', {env: envEU});
const backendStack = new BackendStack(app, 'BackendStack', {});
new PostprocessStack(app, 'PostProcessStack', {backendTable: backendStack.backendTable, deployEnv: DeployEnv.test});

// cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));