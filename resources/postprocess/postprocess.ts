import {SQSEvent} from "aws-lambda";
import {AppConfigClient, GetConfigurationCommand} from "@aws-sdk/client-appconfig"; // ES Modules import

const client = new AppConfigClient({region: "eu-central-1"});

async function handler(event: SQSEvent) {

    const input = {
        "Application": "issues-app",
        "ClientId": "example-id",
        "Configuration": "notification-information",
        "Environment": process.env.DEPLOY_ENV
    };

    const command = new GetConfigurationCommand(input);

    // This fires after the blob has been read/loaded.
    const response = await client.send(command);
    const obfuscated = response.Content;
    const configuration = new TextDecoder().decode(obfuscated);


    console.log('notification will be sent to:');
    console.log(configuration);
    console.log(JSON.stringify(event));
    console.log(event.Records[0].body);
}

export {handler}




