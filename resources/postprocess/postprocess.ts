import {SQSEvent} from "aws-lambda";
import {AppConfigClient, GetConfigurationCommand} from "@aws-sdk/client-appconfig"; // ES Modules import

const client = new AppConfigClient({region: process.env.DEPLOY_REGION});

async function handler(event: SQSEvent) {

    const input = {
        "Application": "issues-app",
        "ClientId": "example-id",
        "Configuration": "notification-information",
        "Environment": process.env.DEPLOY_ENV
    };

    const command = new GetConfigurationCommand(input);

    // This first after the blob has been read/loaded.
    const response = await client.send(command);
    const obfuscated = response.Content;
    const configuration = new TextDecoder().decode(obfuscated);
    console.log('region of app config:');
    console.log(process.env.DEPLOY_REGION);
    console.log('SECRET_NAME 👉', process.env.SECRET_NAME);
    console.log('SECRET_VALUE 👉', process.env.SECRET_VALUE);
    console.log('notification will be sent to:');
    console.log(configuration);
    console.log(JSON.stringify(event));
    console.log(event.Records[0].body);
}

export {handler}




