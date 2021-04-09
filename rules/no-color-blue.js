// no-color-blue.js

const stylelint = require('stylelint');
const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = 'testim-plugin/no-color-blue';

const messages = ruleMessages(ruleName, {
    expected: (unfixed, fixed) => `Expected "${unfixed}" to be "${fixed}"`,
});




module.exports = stylelint.createPlugin(ruleName, function getPlugin(primaryOption, secondaryOptionObject, context) {
    return function lint(postcssRoot, postcssResult) {
        const validOptions = validateOptions(
            postcssResult,
            ruleName, {
                //No options for now...
            }
        );

        if (!validOptions) { //If the options are invalid, don't lint
            return;
        }
        const isAutoFixing = Boolean(context.fix);
        postcssRoot.walkDecls(decl => { //Iterate CSS declarations
            const hasBlue = decl.value.includes('blue');
            if (!hasBlue) {
                return; //Nothing to do with this node - continue
            }
            if (isAutoFixing) { //We are in “fix” mode
                const newValue = decl.value.replace('blue', '#0000FF');
                //Apply the fix. It's not pretty, but that's the way to do it
                if (decl.raws.value) {
                    decl.raws.value.raw = newValue;
                } else {
                    decl.value = newValue;
                }
            } else { //We are in “report only” mode
                report({
                    ruleName,
                    result: postcssResult,
                    message: messages.expected('blue', '#0000FF'), // Build the reported message
                    node: decl, // Specify the reported node
                    word: 'blue', // Which exact word caused the error? This positions the error properly
                });
            }
        });
    };
});


module.exports.ruleName = ruleName;
module.exports.messages = messages;