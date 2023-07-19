exports.handler = async (event: any) => {
    console.log(JSON.stringify(event));
    console.log(event.Records[0].body);
};