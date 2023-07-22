import {SQSEvent} from "aws-lambda";

async function handler(event: SQSEvent) {
    console.log('notification will be sent to:');
    console.log(process.env.ADMIN_EMAIL);
    console.log(JSON.stringify(event));
    console.log(event.Records[0].body);
}

export {handler}




