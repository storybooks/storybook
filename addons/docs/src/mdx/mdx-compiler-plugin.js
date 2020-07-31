const mdxToJsx = require('@mdx-js/mdx/mdx-hast-to-jsx');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const camelCase = require('lodash/camelCase');
const jsStringEscape = require('js-string-escape');
const transformSfc = require('./transform-vue-sfc');

// Generate the MDX as is, but append named exports for every
// story in the contents

const STORY_REGEX = /^<Story[\s>]/;
const PREVIEW_REGEX = /^<Preview[\s>]/;
const META_REGEX = /^<Meta[\s>]/;
const RESERVED = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|await|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/;

function getAttr(elt, what) {
  const attr = elt.attributes.find((n) => n.name.name === what);
  return attr && attr.value;
}

const isReserved = (name) => RESERVED.exec(name);
const startsWithNumber = (name) => /^\d/.exec(name);

const sanitizeName = (name) => {
  let key = camelCase(name);
  if (startsWithNumber(key)) {
    key = `_${key}`;
  } else if (isReserved(key)) {
    key = `${key}Story`;
  }
  return key;
};

const getStoryKey = (name, counter) => (name ? sanitizeName(name) : `story${counter}`);

function genAttribute(key, element) {
  const value = getAttr(element, key);
  if (value && value.expression) {
    const { code } = generate(value.expression, {});
    return code;
  }
  return undefined;
}

function genStoryExport(ast, context) {
  let storyName = getAttr(ast.openingElement, 'name');
  let storyId = getAttr(ast.openingElement, 'id');
  storyName = storyName && storyName.value;
  storyId = storyId && storyId.value;

  if (!storyId && !storyName) {
    throw new Error('Expected a story name or ID attribute');
  }

  // We don't generate exports for story references or the smart "current story"
  if (storyId || !storyName) {
    return null;
  }

  // console.log('genStoryExport', JSON.stringify(ast, null, 2));

  const statements = [];
  const storyKey = getStoryKey(storyName, context.counter);

  const bodyNodes = ast.children.filter((n) => n.type !== 'JSXText');
  let storyCode = null;
  let storyVal = null;
  if (!bodyNodes.length) {
    // plain text node
    const { code } = generate(ast.children[0], {});
    storyCode = `'${code}'`;
    storyVal = `() => (
      ${storyCode}
    )`;
  } else {
    const bodyParts = bodyNodes.map((bodyNode) => {
      const body = bodyNode.type === 'JSXExpressionContainer' ? bodyNode.expression : bodyNode;
      const { code } = generate(body, {});
      return { code, body };
    });
    // if we have more than two children
    // 1. Add line breaks
    // 2. Enclose in <> ... </>
    storyCode = bodyParts.map(({ code }) => code).join('\n');
    const storyReactCode = bodyParts.length > 1 ? `<>\n${storyCode}\n</>` : storyCode;
    // keep track if an indentifier or function call
    // avoid breaking change for 5.3
    const BIND_REGEX = /\.bind\(.*\)/;
    if (bodyParts.length === 1 && BIND_REGEX.test(bodyParts[0].code)) {
      storyVal = bodyParts[0].code;
    } else {
      switch (bodyParts.length === 1 && bodyParts[0].body.type) {
        // We don't know what type the identifier is, but this code
        // assumes it's a function from CSF. Let's see who complains!
        case 'Identifier':
          storyVal = `assertIsFn(${storyCode})`;
          break;
        case 'ArrowFunctionExpression':
          storyVal = `(${storyCode})`;
          break;
        default:
          storyVal = `() => (
          ${storyReactCode}
        )`;
          break;
      }
    }
  }

  statements.push(`export const ${storyKey} = ${storyVal};`);

  // always preserve the name, since CSF exports can get modified by displayName
  statements.push(`${storyKey}.storyName = '${storyName}';`);

  const argTypes = genAttribute('argTypes', ast.openingElement);
  if (argTypes) statements.push(`${storyKey}.argTypes = ${argTypes};`);

  const args = genAttribute('args', ast.openingElement);
  if (args) statements.push(`${storyKey}.args = ${args};`);

  let parameters = getAttr(ast.openingElement, 'parameters');
  parameters = parameters && parameters.expression;
  const source = jsStringEscape(context.source || storyCode);
  const sourceParam = `storySource: { source: '${source}' }`;
  if (parameters) {
    const { code: params } = generate(parameters, {});
    statements.push(`${storyKey}.parameters = { ${sourceParam}, ...${params} };`);
  } else {
    statements.push(`${storyKey}.parameters = { ${sourceParam} };`);
  }

  let decorators = getAttr(ast.openingElement, 'decorators');
  decorators = decorators && decorators.expression;
  if (decorators) {
    const { code: decos } = generate(decorators, {});
    statements.push(`${storyKey}.decorators = ${decos};`);
  }

  // eslint-disable-next-line no-param-reassign
  context.storyNameToKey[storyName] = storyKey;

  return {
    [storyKey]: statements.join('\n'),
  };
}

function genPreviewExports(ast, context, sources = []) {
  // console.log('genPreviewExports', JSON.stringify(ast, null, 2));

  const previewExports = {};
  for (let i = 0; i < ast.children.length; i += 1) {
    const child = ast.children[i];
    if (child.type === 'JSXElement' && child.openingElement.name.name === 'Story') {
      const storyExport = genStoryExport(child, {
        ...context,
        source: sources[context.counter],
      });
      if (storyExport) {
        Object.assign(previewExports, storyExport);
        // eslint-disable-next-line no-param-reassign
        context.counter += 1;
      }
    }
  }
  return previewExports;
}

function genMeta(ast, options) {
  let title = getAttr(ast.openingElement, 'title');
  let id = getAttr(ast.openingElement, 'id');
  if (title) {
    if (title.type === 'StringLiteral') {
      title = "'".concat(jsStringEscape(title.value), "'");
    } else {
      try {
        // generate code, so the expression is evaluated by the CSF compiler
        const { code } = generate(title, {});
        // remove the curly brackets at start and end of code
        title = code.replace(/^\{(.+)\}$/, '$1');
      } catch (e) {
        // eat exception if title parsing didn't go well
        // eslint-disable-next-line no-console
        console.warn('Invalid title:', options.filepath);
        title = undefined;
      }
    }
  }
  id = id && `'${id.value}'`;
  const parameters = genAttribute('parameters', ast.openingElement);
  const decorators = genAttribute('decorators', ast.openingElement);
  const component = genAttribute('component', ast.openingElement);
  const subcomponents = genAttribute('subcomponents', ast.openingElement);
  const args = genAttribute('args', ast.openingElement);
  const argTypes = genAttribute('argTypes', ast.openingElement);

  return {
    title,
    id,
    parameters,
    decorators,
    component,
    subcomponents,
    args,
    argTypes,
  };
}

function getExports(node, counter, options) {
  const { value, type, source } = node;
  if (type === 'jsx') {
    if (STORY_REGEX.exec(value)) {
      // Single story
      const ast = parser.parseExpression(value, { plugins: ['jsx'] });
      const storyExport = genStoryExport(ast, { ...counter, source });
      return storyExport && { stories: storyExport };
    }
    if (PREVIEW_REGEX.exec(value)) {
      // Preview, possibly containing multiple stories
      const ast = parser.parseExpression(value, { plugins: ['jsx'] });
      return { stories: genPreviewExports(ast, { ...counter }, source) };
    }
    if (META_REGEX.exec(value)) {
      // Preview, possibly containing multiple stories
      const ast = parser.parseExpression(value, { plugins: ['jsx'] });
      return { meta: genMeta(ast, options) };
    }
  }
  return null;
}

// insert `mdxStoryNameToKey` and `mdxComponentMeta` into the context so that we
// can reconstruct the Story ID dynamically from the `name` at render time
const wrapperJs = `
componentMeta.parameters = componentMeta.parameters || {};
componentMeta.parameters.docs = {
  ...(componentMeta.parameters.docs || {}),
  page: () => <AddContext mdxStoryNameToKey={mdxStoryNameToKey} mdxComponentMeta={componentMeta}><MDXContent /></AddContext>,
};
`.trim();

// Use this rather than JSON.stringify because `Meta`'s attributes
// are already valid code strings, so we want to insert them raw
// rather than add an extra set of quotes
function stringifyMeta(meta) {
  let result = '{ ';
  Object.entries(meta).forEach(([key, val]) => {
    if (val) {
      result += `${key}: ${val}, `;
    }
  });
  result += ' }';
  return result;
}

const hasStoryChild = (node) => {
  if (node.openingElement && node.openingElement.name.name === 'Story') {
    return node;
  }
  if (node.children && node.children.length > 0) {
    return node.children.find((child) => hasStoryChild(child));
  }
  return null;
};

function extractExports(node, options) {
  node.children.forEach((child) => {
    if (child.type === 'jsx') {
      const vueSfc = transformSfc(child.value);
      if (vueSfc) {
        // eslint-disable-next-line no-param-reassign
        child.value = vueSfc.story;
        // eslint-disable-next-line no-param-reassign
        child.source = vueSfc.source;
      }

      try {
        const ast = parser.parseExpression(child.value, { plugins: ['jsx'] });
        if (
          ast.openingElement &&
          ast.openingElement.type === 'JSXOpeningElement' &&
          ast.openingElement.name.name === 'Preview' &&
          !hasStoryChild(ast)
        ) {
          const previewAst = ast.openingElement;
          previewAst.attributes.push({
            type: 'JSXAttribute',
            name: {
              type: 'JSXIdentifier',
              name: 'mdxSource',
            },
            value: {
              type: 'StringLiteral',
              value: encodeURI(
                ast.children
                  .map(
                    (el) =>
                      generate(el, {
                        quotes: 'double',
                      }).code
                  )
                  .join('\n')
              ),
            },
          });
        }
        const { code } = generate(ast, {});
        // eslint-disable-next-line no-param-reassign
        child.value = code;
      } catch {
        /** catch erroneous child.value string where the babel parseExpression makes exception
         * https://github.com/mdx-js/mdx/issues/767
         * eg <button>
         *      <div>hello world</div>
         *
         *    </button>
         * generates error
         * 1. child.value =`<button>\n  <div>hello world</div`
         * 2. child.value =`\n`
         * 3. child.value =`</button>`
         *
         */
      }
    }
  });
  // we're overriding default export
  const defaultJsx = mdxToJsx.toJSX(node, {}, { ...options, skipExport: true });
  const storyExports = [];
  const includeStories = [];
  let metaExport = null;
  const context = {
    counter: 0,
    storyNameToKey: {},
  };
  node.children.forEach((n) => {
    const exports = getExports(n, context, options);
    if (exports) {
      const { stories, meta } = exports;
      if (stories) {
        Object.entries(stories).forEach(([key, story]) => {
          includeStories.push(key);
          storyExports.push(story);
        });
      }
      if (meta) {
        if (metaExport) {
          throw new Error('Meta can only be declared once');
        }
        metaExport = meta;
      }
    }
  });
  if (metaExport) {
    if (!storyExports.length) {
      storyExports.push('export const __page = () => { throw new Error("Docs-only story"); };');
      storyExports.push('__page.parameters = { docsOnly: true };');
      includeStories.push('__page');
    }
  } else {
    metaExport = {};
  }
  metaExport.includeStories = JSON.stringify(includeStories);

  const fullJsx = [
    'import { assertIsFn, AddContext } from "@storybook/addon-docs/blocks";',
    defaultJsx,
    ...storyExports,
    `const componentMeta = ${stringifyMeta(metaExport)};`,
    `const mdxStoryNameToKey = ${JSON.stringify(context.storyNameToKey)};`,
    wrapperJs,
    'export default componentMeta;',
  ].join('\n\n');

  return fullJsx;
}

function createCompiler(mdxOptions) {
  return function compiler(options = {}) {
    this.Compiler = (tree) => extractExports(tree, options, mdxOptions);
  };
}

module.exports = createCompiler;
