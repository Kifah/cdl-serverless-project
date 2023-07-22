import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep} from 'aws-cdk-lib/pipelines';
import {TestDeployStage} from "./test-deploy-stage-stack";
import {ProdDeployStage} from "./prod-deploy-stage";



export class CiCdStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'CdkAppPipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub('Kifah/cdl-serverless-project', 'main'),
                commands: ['npm ci', 'npm run build', 'npm run test', 'npx cdk synth']
            })
        });
        const testingStage = pipeline.addStage(new TestDeployStage(this, "Test-Deployment", {}));
        testingStage.addPost(new ManualApprovalStep('approval'));
        pipeline.addStage(new ProdDeployStage(this, "Prod-Deployment", {}));
    }
}