import { load } from '../index';

describe('add class', () => {
  it('pure html 1', () => {
    const code = '<div class="show"></div><div class="active"></div>';
    const $ = load(code);
    const eles = $('.active, .show');

    eles.addClass('newClass');

    expect($.html()).toBe(
      '<div class="show newClass"></div><div class="active newClass"></div>',
    );
  });

  it('pure html 2', () => {
    const code = '<div class="show active"></div><div class="show"></div>';
    const $ = load(code);
    const eles = $('.active.show');

    eles.addClass('newClass');

    expect($.html()).toBe(
      '<div class="show active newClass"></div><div class="show"></div>',
    );
  });

  it('concat statement 1', () => {
    const code = '<div class="show{{cls}}"></div>';
    const $ = load(code);
    const eles = $('.show');

    eles.addClass('newClass');

    expect($.html()).toBe('<div class="show{{cls}}"></div>');
  });

  it('concat statement 2', () => {
    const code = '<div class="{{cls}}show"></div>';
    const $ = load(code);
    const eles = $('.show');

    eles.addClass('newClass');

    expect($.html()).toBe('<div class="{{cls}}show"></div>');
  });

  it('concat statement 3', () => {
    const code = '<div class="show{{cls}} show"></div>';
    const $ = load(code);
    const eles = $('div.show');

    eles.addClass('newClass');

    expect($.html()).toBe('<div class="show{{cls}} show newClass"></div>');
  });

  it('empty class', () => {
    const code = '<div></div>';
    const $ = load(code);
    const eles = $('div');

    eles.addClass('newClass');

    expect($.html()).toBe('<div class="newClass"></div>');
  });
});

describe('remove class', () => {
  it('pure html 1', () => {
    const code = '<div class="show"></div><div class="active"></div>';
    const $ = load(code);
    const eles = $('.active, .show');

    eles.removeClass('show active');

    expect($.html()).toBe('<div class></div><div class></div>');
  });

  it('concat statement 1', () => {
    const code = '<div class="active valid show{{cls}}valid"></div>';
    const $ = load(code);
    const eles = $('.active');

    eles.removeClass('valid');

    expect($.html()).toBe('<div class="active show{{cls}}valid"></div>');
  });

  it('concat statement 2', () => {
    const code = '<div class="active show{{cls}} valid"></div>';
    const $ = load(code);
    const eles = $('.valid');

    eles.removeClass('active valid');

    expect($.html()).toBe('<div class="show{{cls}}"></div>');
  });

  it('concat statement 3', () => {
    const code = '<div class="show{{cls}} show"></div>';
    const $ = load(code);
    const eles = $('div.show');

    eles.removeClass();

    expect($.html()).toBe('<div></div>');
  });

  it('concat statement 4', () => {
    const code = '<div class="show{{cls}} valid"></div>';
    const $ = load(code);
    const eles = $('div.show');

    eles.removeClass('show');

    expect($.html()).toBe('<div class="show{{cls}} valid"></div>');
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
