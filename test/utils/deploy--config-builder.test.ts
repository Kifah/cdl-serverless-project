import {getConfigByEnv} from "../../utils/deploy-config-builder";
import exp = require("constants");

var assert = require('assert');


describe('Utils Test suite', function () {
    it('gets test config correctly', function () {
        const json1 = '[{"admin_name":"test_admin","admin_email":"test@web.de","env":"test"}]';
        const expectedResult = {admin_name: 'test_admin', admin_email: 'test@web.de', env: 'test'};
        const calculated = getConfigByEnv(json1, 'test');
        expect(calculated).toEqual(expectedResult);
    });
    it('gets prod config correctly', function () {
        const json1 = '[{"admin_name":"test_admin","admin_email":"test@web.de","env":"test"},{"admin_name":"prod_admin","admin_email":"prod@web.de","env":"prod"}]';
        const expectedResult = {admin_name: 'prod_admin', admin_email: 'prod@web.de', env: 'prod'};
        const calculated = getConfigByEnv(json1, 'prod');
        expect(calculated).toEqual(expectedResult);
    });
})