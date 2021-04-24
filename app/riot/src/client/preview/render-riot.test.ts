import { document } from 'global';
import { unregister, tag2 } from 'riot';
import { render } from './rendering';
import { asCompiledCode } from './compileStageFunctions';

const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body = document.createElement('body');
document.body.appendChild(rootElement);

beforeEach(() => {
  unregister('#storybook-root');
  rootElement.dataset.is = 'root';
});

describe('render a riot element', () => {
  it('should not work with nothing', () => {
    expect(render(null)).toBe(false);

    expect(rootElement.innerHTML).toEqual('');
  });

  it('can work with some text', () => {
    expect(render({ tags: ['<div><p>some tests</p></div>'] })).toBe(true);

    expect(rootElement.innerHTML).toEqual('<div><p>some tests</p></div>');
  });

  it('can work with raw code', () => {
    expect(render("riot.tag2('root', '<div>raw code</div>', '', '', () => {})")).toBe(true);

    expect(rootElement.innerHTML).toEqual('<div>raw code</div>');
  });

  it('can work with compiled code', () => {
    expect(render([{}])).toBe(true);
    // does only work in true mode, and not in jest mode
  });

  it('will be possible to compile a template before rendering it', () => {
    const compiledTemplate = asCompiledCode('<template><div>raw code</div></template>');

    expect(compiledTemplate).toEqual(
      "tag2('template', '<div>raw code</div>', '', '', function(opts) {\n});"
    );
  });

  it('works with a json consisting in a tagName and opts', () => {
    tag2('hello', '<p>Hello { opts.suffix }</p>', '', '', () => {});

    expect(render({ tagName: 'hello', opts: { suffix: 'World' } })).toBe(true);

    expect(rootElement.innerHTML).toEqual('<p>Hello World</p>');
  });

  it('can nest several tags', () => {
    expect(
      render({
        tags: [
          '<Tag1><div>Inside tag1:<ul><li><Tag2><yield/></Tag2></li></ul></div></Tag1>',
          '<Tag2><div>Inside tag2:<ul><li><Tag3><yield/></Tag3></li></ul></div></Tag2>',
          '<Tag3><div>Inside tag3:<ul><li><Tag4><yield/></Tag4></li></ul></div></Tag3>',
          '<Tag4><div>Inside tag4:<ul><li><Tag5><yield/></Tag5></li></ul></div></Tag4>',
          '<Tag5><div>Inside tag5:<ul><li><yield/></li></ul></div></Tag5>',
        ],
        template: '<Matriochka><div><Tag1>Content</Tag1></div></Matriochka>',
      })
    ).toBe(true);

    expect(rootElement.innerHTML).toMatchSnapshot();
  });

  it('can template some vars', () => {
    expect(
      render({
        tags: [
          {
            content:
              "<SimpleTest><div>simple test ({opts.test || 'without parameter'}). Oh, by the way ({opts.riotValue || '... well, nothing'})</div></SimpleTest>",
            boundAs: 'mustBeUniquePlease',
          },
        ],
        template:
          '<SimpleTest test={ "with a parameter" } value={"value is mapped to riotValue"}></SimpleTest>',
      })
    ).toBe(true);

    expect(rootElement.innerHTML).toMatchSnapshot();
  });

  it('can accept a constructor', () => {
    expect(
      render({
        tags: [
          {
            content:
              "<SimpleTest><div>HACKED : {opts.hacked} ; simple test ({opts.test || 'without parameter'}). Oh, by the way ({opts.riotValue || '... well, nothing'})</div></SimpleTest>",
            boundAs: 'mustBeUniquePlease',
          },
        ],
        template:
          '<SimpleTest hacked={hacked} test={ "with a parameter" } value={"value is mapped to riotValue"}></SimpleTest>',
        tagConstructor: function tagConstructor() {
          this.hacked = true;
        },
      })
    ).toBe(true);

    expect(rootElement.innerHTML).toMatchSnapshot();
  });
});
