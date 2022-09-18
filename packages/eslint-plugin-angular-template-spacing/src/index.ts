import * as pipe from '@package/src/rules/pipe.rule';
import recommended from '@package/src/configs/recommended.json';
import * as interpolation from '@package/src/rules/interpolation.rule';

// eslint-disable-next-line import/no-default-export
export default {
    configs: {
        recommended,
    },
    rules: {
        [pipe.ruleName]: pipe.ruleModule,
        [interpolation.ruleName]: interpolation.ruleModule,
    },
};
