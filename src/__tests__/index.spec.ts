import { load } from '../index';

describe('basic', () => {
  it('html function', () => {
    const code = '<div></div>';
    const $ = load(code);

    expect($.template()).toBe(code);
  });
});
