import {SQSEvent} from "aws-lambda";
import { AppConfigClient, GetConfigurationCommand } from "@aws-sdk/client-appconfig"; // ES Modules import

const client = new AppConfigClient({region: "eu-central-1"});


async function handler(event: SQSEvent) {

    const input = {
        "Application": "issues-app",
        "ClientId": "example-id",
        "Configuration": "notification-information",
        "Environment": "dev",
        "ConfigurationVersion": "3"
    };

    const command = new GetConfigurationCommand(input);
    const response = await client.send(command);

    // This fires after the blob has been read/loaded.
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
        // @ts-ignore
        const text = e.srcElement.result;
        console.log(text);
    });

// Start reading the blob as text.
    // @ts-ignore
    reader.readAsText(response.Content);


    //console.log(JSON.stringify(event));
    //console.log(event.Records[0].body);
}

export {handler}




