import {SQSEvent} from "aws-lambda";

async function handler(event: SQSEvent) {
    console.log(JSON.stringify(event));
    console.log(event.Records[0].body);
}

export {handler}

