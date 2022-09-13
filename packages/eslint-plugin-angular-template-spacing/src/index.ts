import * as pipe from '@package/rules/pipe.rule';
import recommended from '@package/configs/recommended.json';
import * as interpolation from '@package/rules/interpolation.rule';

export default {
    configs: {
        recommended
    },
    rules: {
        [pipe.ruleName]: pipe.ruleModule,
        [interpolation.ruleName]: interpolation.ruleModule,
    },
}
