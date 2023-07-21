import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import {AppStage} from "./backend-stage-stack";

export class CiCdStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'MyPipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub('Kifah/cdl-serverless-project', 'main'),
                commands: ['npm ci', 'npm run build', 'npx cdk synth']
            })
        });
        pipeline.addStage(new AppStage(this, "test", {}));
    }
}