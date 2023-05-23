import { load } from '../index';

describe('basic', () => {
  it('html function', () => {
    const code = '<div></div>';
    const $ = load(code);

    expect($.template()).toBe(code);
  });

  it('load element', () => {
    const code = '<div class="first"></div><div></div>';
    const $ = load(code);
    const $divs = $('div');

    $divs.forEach((el) => {
      const $el = $(el);
      if ($el.hasClass('first')) {
        $el.attr({ 'data-type': 'first' });
      } else {
        $el.attr({ 'data-type': 'normal' });
      }
    });

    const target =
      '<div data-type="first" class="first"></div><div data-type="normal"></div>';

    expect($.template()).toBe(target);
  });
});
