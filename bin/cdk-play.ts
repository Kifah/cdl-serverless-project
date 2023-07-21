#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {PostprocessStack} from '../lib/postprocess-stack';
import {BackendStack} from "../lib/backend-stack";
// import {AwsSolutionsChecks} from "cdk-nag";

const app = new cdk.App();
const backendStack = new BackendStack(app, 'BackendStack', {});
new PostprocessStack(app, 'PostProcessStack', {backendTable: backendStack.backendTable});

// cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));