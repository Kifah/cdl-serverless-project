#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {PostprocessStack} from '../lib/postprocess-stack';
import {BackendStack} from "../lib/backend-stack";

const app = new cdk.App();
const backendStack = new BackendStack(app, 'BackendStack', {});
new PostprocessStack(app, 'PostProcessStack', {backendTable: backendStack.backendTable});