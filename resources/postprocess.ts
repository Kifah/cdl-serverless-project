import {SQSEvent, Context} from "aws-lambda";

async function handler(event: SQSEvent, context: Context) {
    console.log(JSON.stringify(event));
    console.log(event.Records[0].body);
}

export {handler}

