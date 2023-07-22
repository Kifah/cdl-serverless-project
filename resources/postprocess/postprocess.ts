import {SQSEvent} from "aws-lambda";
import { AppConfigClient, GetConfigurationCommand } from "@aws-sdk/client-appconfig"; // ES Modules import

const client = new AppConfigClient({region: "eu-central-1"});


async function handler(event: SQSEvent) {

    const input = { // GetConfigurationRequest
        Application: "issues-app", // required
        Environment: "dev", // required
        Configuration: "notification-information", // required
        ClientId: "STRING_VALUE", // required
        ClientConfigurationVersion: "2",
    };

    const command = new GetConfigurationCommand(input);
    const response = await client.send(command);
    console.log(JSON.stringify(event));
    console.log(event.Records[0].body);
}

export {handler}




