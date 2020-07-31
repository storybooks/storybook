const compiler = require('vue-template-compiler');

const CODE_REGEX = /^([\S\s]*?<Story[\S\s]*?>)[\S\s]*?```vue([\S\s]+?)```[\S\s]*?(<\/Story>[\S\s]*?)$/;
const SCRIPT_REGEX = /export default[\S\s]*?{([\S\s]+)}[\S\s]*?$/;

module.exports = function transformVueSfc(value) {
  const codeParts = CODE_REGEX.exec(value);
  if (!codeParts) {
    return false;
  }
  let source = codeParts[2];
  const parsedSfcCode = compiler.parseComponent(source);
  const storyTemplate =
    parsedSfcCode.template && `template: \`${parsedSfcCode.template.content}\`,`;
  const scriptMatch = parsedSfcCode.script && SCRIPT_REGEX.exec(parsedSfcCode.script.content);
  const storyScript = scriptMatch ? scriptMatch[1] : '';

  const story = `
{{
  ${storyTemplate}
  ${storyScript}
}}
`;
  // Transform any remaining stories (for previews)
  let lastPart = codeParts[3];
  const vueSfc = transformVueSfc(lastPart);
  if (vueSfc) {
    lastPart = vueSfc.story;
    const sources = Array.isArray(vueSfc.source) ? vueSfc.source : [vueSfc.source];
    source = [source, ...sources];
  }
  const result = codeParts[1] + story + lastPart;
  return {
    source,
    story: result,
  };
};
