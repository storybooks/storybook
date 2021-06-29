import root from '@storybook/global-root';
import { eventToShortcut, keyToSymbol } from '../lib/shortcut';

const ev = (attr) => new root.KeyboardEvent('keydown', { ...attr });

describe('eventToShortcut', () => {
  test('it handles alt key inputs', () => {
    const output = eventToShortcut(ev({ altKey: true, key: 'Alt' }));

    expect(output).toEqual(null);
  });
  test('it handles ctrl key inputs', () => {
    const output = eventToShortcut(ev({ ctrlKey: true, key: 'Control' }));
    expect(output).toEqual(null);
  });
  test('it handles meta key inputs', () => {
    const output = eventToShortcut(ev({ metaKey: true, key: 'Meta' }));
    expect(output).toEqual(null);
  });
  test('it handles shift key inputs', () => {
    const output = eventToShortcut(ev({ shiftKey: true, key: 'Shift' }));
    expect(output).toEqual(null);
  });
  test('it handles enter key inputs', () => {
    const output = eventToShortcut(ev({ key: 'Enter' }));
    expect(output).toEqual(null);
  });
  test('it handles tab key inputs', () => {
    const output = eventToShortcut(ev({ key: 'Tab' }));
    expect(output).toEqual(null);
  });
  test('it handles space bar inputs', () => {
    const output = eventToShortcut(ev({ key: ' ' }));
    expect(output).toEqual(['space']);
  });
  test('it handles escape inputs', () => {
    const output = eventToShortcut(ev({ key: 'Escape' }));
    expect(output).toEqual(['escape']);
  });
  test('it capitalizes a letter key through', () => {
    const output = eventToShortcut(ev({ key: 'a' }));
    expect(output).toEqual(['A']);
  });
  test('it passes regular key through', () => {
    const output = eventToShortcut(ev({ key: '1' }));
    expect(output).toEqual(['1']);
  });
  test('it passes modified regular key through', () => {
    const output = eventToShortcut(ev({ altKey: true, key: '1' }));
    expect(output).toEqual(['alt', '1']);
  });
});

describe('keyToSymbol', () => {
  test('control returns a caret', () => {
    const result = keyToSymbol('control');
    expect(result).toBe('⌃');
  });

  test('meta returns ⌘', () => {
    const result = keyToSymbol('meta');
    expect(result).toEqual('⌘');
  });
  test('shift returns ⇧', () => {
    const result = keyToSymbol('shift');
    expect(result).toBe('⇧​');
  });
  test('enter returns an empty string', () => {
    const result = keyToSymbol('Enter');
    expect(result).toBe('');
  });

  test("' ' returns SPACE", () => {
    const result = keyToSymbol(' ');
    expect(result).toEqual('SPACE');
  });
  test('escape returns esc', () => {
    const result = keyToSymbol('escape');
    expect(result).toEqual('');
  });
  test('ArrowUp returns ↑​​​', () => {
    const result = keyToSymbol('ArrowUp');
    expect(result).toBe('↑');
  });
  test('ArrowDown returns ↓​​​', () => {
    const result = keyToSymbol('ArrowDown');
    expect(result).toBe('↓');
  });
  test('ArrowLeft returns ←', () => {
    const result = keyToSymbol('ArrowLeft');
    expect(result).toBe('←');
  });

  test('ArrowRight returns →', () => {
    const result = keyToSymbol('ArrowRight');
    expect(result).toBe('→');
  });

  test('it capitalizes a lowercase key', () => {
    const output = keyToSymbol('a');
    expect(output).toBe('A');
  });
});
