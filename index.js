const postcss = require('postcss');
const rootSelectors = [':root', 'html'];
const bodySelector = 'body';
const exclusions = /(^:|^to$|^from$|%$|html$|body$)/;

module.exports = postcss.plugin('postcss-isolate', function (opts) {
  opts = opts || {};
  var rootWrapper = `${opts.rootWrapper}`;
  var namespace = `${opts.namespace}`;

  function isExclusion(selector) {
    return selector.match(exclusions);
  }

  return function (css, result) {
    css.walkRules(function (rule) {

      // Remove line breaks before turning selectors into array
      var selectors = rule.selector.replace(/(\r\n|\n|\r)/gm, '').split(',').filter(n => n !== '');

      // Handle empty selectors
      // TODO Remove this node entirely
      if (selectors.length === 0) {
        selectors = ['html'];
        rule.nodes = [];
      }
      
      rule.selector = selectors.map((selector) => {
        if (rootSelectors.indexOf(selector) > -1) {
          // html
          return rootWrapper;
        } else if (selector === bodySelector) {
          // body
          return `${rootWrapper} ${namespace}`;
        } else if (selector === rootWrapper || selector === namespace) {
          // rootWrapper or namespace
          return selector;
        } else if (!isExclusion(selector)) {
          // !excluded selectors
          return `${rootWrapper} ${namespace} ${selector}`;
        } else {
          // everything else
          return selector;
        }
      }).join(',');

    });
  };
});
