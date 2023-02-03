import { load } from '../index';

describe('basic', () => {
  it('html function', () => {
    const code = '<div></div>';
    const $ = load(code);

    expect($.html()).toBe(code);
  });

  it('addClass function', () => {
    const code = '<div class="show"></div>';
    const $ = load(code);
    const eles = $('.active, .show');

    eles.addClass('newClass');

    expect($.html()).toBe('<div class="show newClass"></div>');
  });
});
