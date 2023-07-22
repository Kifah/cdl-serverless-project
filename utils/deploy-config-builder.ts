interface deployConfigStructure {
    admin_name: string;
    admin_email: string;
    env: string;
}


export function getConfigByEnv(jsonString: string, env: string): deployConfigStructure {
    const objectFromJson = JSON.parse(jsonString);
    return objectFromJson.filter(
        function (objectFromJson: deployConfigStructure) {
            return objectFromJson.env == env
        }
    );

}

const json1 = '[{"admin_name":"test_admin","admin_email":"test@web.de","env":"test"}]';
const json2 = '[{"admin_name":"test_admin","admin_email":"test@web.de","env":"test"},"admin_name":"prod_admin","admin_email":"prod@web.de","env":"prod"}]';
console.log(getConfigByEnv(json1, 'test'));
console.log(getConfigByEnv(json2, 'test'));
console.log(getConfigByEnv(json2, 'prod'));