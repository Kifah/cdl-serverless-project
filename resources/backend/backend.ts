import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from "aws-lambda";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {backendPost} from "./backend-post";
import {backendGet} from "./backend-get";

const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    let message: string = 'nothing yet';

    try {
        switch (event.httpMethod) {
            case 'GET':
                return backendGet(event, ddbClient);
            case 'POST':
                return backendPost(event, ddbClient);
            default:
                break;
        }
    } catch (error) {
        console.error(error);
        // @ts-ignore
        return {
            statusCode: 500,
            body: JSON.stringify('error')
        }
    }


    return {
        statusCode: 200,
        body: JSON.stringify(message)
    };
}

export {handler}