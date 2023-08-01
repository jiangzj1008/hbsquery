import { load } from '../index';

describe('add class', () => {
  it('pure html 1', () => {
    const code = '<div class="show"></div><div class="active"></div>';
    const $ = load(code);
    const eles = $('.active, .show');

    eles.addClass('active show');

    expect($.template()).toBe(
      '<div class="show active"></div><div class="active show"></div>',
    );
  });

  it('pure html 2', () => {
    const code = '<div class="show active"></div><div class="show"></div>';
    const $ = load(code);
    const eles = $('.active.show');

    eles.addClass('newClass');

    expect($.template()).toBe(
      '<div class="show active newClass"></div><div class="show"></div>',
    );
  });

  it('concat statement 1', () => {
    const code = '<div class="show{{cls}}"></div>';
    const $ = load(code);
    const eles = $('.show');

    eles.addClass('newClass');

    expect($.template()).toBe('<div class="show{{cls}}"></div>');
  });

  it('concat statement 2', () => {
    const code = '<div class="{{cls}}show"></div>';
    const $ = load(code);
    const eles = $('.show');

    eles.addClass('newClass');

    expect($.template()).toBe('<div class="{{cls}}show"></div>');
  });

  it('concat statement 3', () => {
    const code = '<div class="show {{cls}}show"></div>';
    const $ = load(code);
    const eles = $('div.show');

    eles.addClass('show newClass');

    expect($.template()).toBe('<div class="show {{cls}}show newClass"></div>');
  });

  it('empty class', () => {
    const code = '<div></div>';
    const $ = load(code);
    const eles = $('div');

    eles.addClass('newClass');

    expect($.template()).toBe('<div class="newClass"></div>');
  });
});

describe('remove class', () => {
  it('pure html 1', () => {
    const code = '<div class="show"></div><div class="active"></div>';
    const $ = load(code);
    const eles = $('.active, .show');

    eles.removeClass('show active');

    expect($.template()).toBe('<div class></div><div class></div>');
  });

  it('concat statement 1', () => {
    const code = '<div class="active valid show{{cls}}valid"></div>';
    const $ = load(code);
    const eles = $('.active');

    eles.removeClass('valid');

    expect($.template()).toBe('<div class="active show{{cls}}valid"></div>');
  });

  it('concat statement 2', () => {
    const code = '<div class="active show{{cls}} valid"></div>';
    const $ = load(code);
    const eles = $('.valid');

    eles.removeClass('active valid');

    expect($.template()).toBe('<div class="show{{cls}}"></div>');
  });

  it('concat statement 3', () => {
    const code = '<div class="show{{cls}} show"></div>';
    const $ = load(code);
    const eles = $('div.show');

    eles.removeClass();

    expect($.template()).toBe('<div></div>');
  });

  it('concat statement 4', () => {
    const code = '<div class="show{{cls}} valid"></div>';
    const $ = load(code);
    const eles = $('div.show');

    eles.removeClass('show');

    expect($.template()).toBe('<div class="show{{cls}} valid"></div>');
  });
});

describe('has class', () => {
  it('pure html 1', () => {
    const code = '<div class="show"></div><div class="active"></div>';
    const $ = load(code);
    const eles = $('.active, .show');

    const valid = eles.hasClass('valid show');

    expect(valid).toBe(true);
  });

  it('pure html 2', () => {
    const code = '<div class="show"></div><div class="active"></div>';
    const $ = load(code);
    const eles = $('.active, .show');

    const valid = eles.hasClass('valid');

    expect(valid).toBe(false);
  });

  it('concat statement 1', () => {
    const code = '<div class="active valid show{{cls}}valid"></div>';
    const $ = load(code);
    const eles = $('.active');

    const valid = eles.hasClass('show');

    expect(valid).toBe(false);
  });

  it('concat statement 2', () => {
    const code = '<div class="active show{{cls}} valid"></div>';
    const $ = load(code);
    const eles = $('.valid');

    const valid = eles.hasClass('active');

    expect(valid).toBe(true);
  });

  it('concat statement 3', () => {
    const code = '<div class="{{cls}}show"></div>';
    const $ = load(code);
    const eles = $('div');

    const valid = eles.hasClass('show');

    expect(valid).toBe(false);
  });
});

describe('set attr', () => {
  it('pure html 1', () => {
    const code = '<div class="show"></div><div class="active"></div>';
    const $ = load(code);
    const eles = $('.active, .show');

    eles.attr('class', 'cls');

    expect($.template()).toBe('<div class="cls"></div><div class="cls"></div>');
  });

  it('concat statement 1', () => {
    const code = '<div class="show {{cls}}"></div>';
    const $ = load(code);
    const eles = $('.show');

    eles.attr('id', 'id');

    expect($.template()).toBe('<div id="id" class="show {{cls}}"></div>');
  });

  it('concat statement 2', () => {
    const code = '<div class="show {{cls}}"></div>';
    const $ = load(code);
    const eles = $('.show');

    eles.attr({ id: 'id', 'data-type': 'button' });

    expect($.template()).toBe(
      '<div id="id" data-type="button" class="show {{cls}}"></div>',
    );
  });

  it('concat statement 3', () => {
    const code = '<div class="show {{cls}}"></div>';
    const $ = load(code);
    const eles = $('.show');

    eles.attr('class', null);

    expect($.template()).toBe('<div></div>');
  });
});

describe('get attr', () => {
  it('TextNode', () => {
    const code = '<div class="show"></div><div class="active"></div>';
    const $ = load(code);
    const eles = $('div');

    const val = eles.attr('class');

    expect(val.toString()).toBe('show');
  });

  it('MustacheStatement', () => {
    const code = '<div class={{cls}}></div>';
    const $ = load(code);
    const eles = $('div');

    const val = eles.attr('class');

    expect(val.toString()).toBe('{{cls}}');
  });

  it('ConcatStatement', () => {
    const code = '<div class="container {{#if valid}}cls{{/if}} layout"></div>';
    const $ = load(code);
    const eles = $('.container');

    const val = eles.attr('class');

    expect(val.toString()).toBe('container {{#if valid}}cls{{/if}} layout');
  });

  it('for loop', () => {
    const code = '<div class="first"></div><div class="{{cls}}"></div>';
    const $ = load(code);
    const $divs = $('div');

    $divs.forEach((el) => {
      const $el = $(el);
      const val = $el.attr('class');

      if ($el.hasClass('first')) {
        expect(val.toString()).toBe('first');
      } else {
        expect(val.toString()).toBe('{{cls}}');
      }
    });
  });
});
