import {SQSEvent} from "aws-lambda";
import {AppConfigClient, GetConfigurationCommand} from "@aws-sdk/client-appconfig"; // ES Modules import
import {Logger, ILogObj} from "tslog";

const client = new AppConfigClient({region: "eu-central-1"});

const log: Logger<ILogObj> = new Logger();

async function handler(event: SQSEvent) {

    const input = {
        "Application": "issues-app",
        "ClientId": "example-id",
        "Configuration": "notification-information",
        "Environment": process.env.DEPLOY_ENV,
    };

    const command = new GetConfigurationCommand(input);

    // This fires after the blob has been read/loaded.
    const response = await client.send(command);
    const obfuscated = response.Content;
    const configuration = new TextDecoder().decode(obfuscated);


    log.info('notification will be sent to:');
    log.info(configuration);
    log.info(JSON.stringify(event));
    //console.log(event.Records[0].body);
}

export {handler}




