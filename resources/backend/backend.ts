import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    let message: string = 'nothing yet';

    switch (event.httpMethod) {
        case 'GET':
            message = 'Hello from GET!'
            break;
        case 'POST':
            message = 'Hello from POST!'
            break;
        default:
            break;
    }


    return {
        statusCode: 200,
        body: JSON.stringify(message)
    };
}

export {handler}