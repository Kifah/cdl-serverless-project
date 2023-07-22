interface DeployConfigStructure {
    admin_name: string;
    admin_email: string;
    env: string;
}


export function getConfigByEnv(jsonString: string, env: string): DeployConfigStructure {

    const objectFromJson = JSON.parse(jsonString);
    let returnValue;
    returnValue = objectFromJson.filter(
        function (objectFromJson: DeployConfigStructure) {
            return objectFromJson.env == env
        }
    );
    return returnValue[0];

}
