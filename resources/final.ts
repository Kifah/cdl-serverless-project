exports.handler = async (event: any) => {
    console.log(event.Records[0].body);
};