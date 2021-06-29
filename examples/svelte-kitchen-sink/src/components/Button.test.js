import root from '@storybook/global-root';
import Button from './Button.svelte';

const { document } = root;

let target;
let component;

describe('Button Component', () => {
  beforeEach(() => {
    target = document.createElement('div');

    component = new Button({ target });
  });

  it('should render `text` property', () => {
    return new Promise((done) => {
      const text = 'Hello world';
      const expected = `Round corners  ${text}`;

      component.$on('afterUpdate', () => {
        const componentText = target.firstChild.textContent.trim();

        expect(componentText).toEqual(expected);

        done();
      });

      component.$set({ text });
    });
  });
});
