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

  it('concat no hit 1', () => {
    const code = '<div class="show{{cls}}"></div>';
    const $ = load(code);
    const eles = $('.show');

    eles.addClass('newClass');

    expect($.html()).toBe('<div class="show{{cls}}"></div>');
  });

  it('concat no hit 2', () => {
    const code = '<div class="{{cls}}show"></div>';
    const $ = load(code);
    const eles = $('.show');

    eles.addClass('newClass');

    expect($.html()).toBe('<div class="{{cls}}show"></div>');
  });

  it('concat hit', () => {
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
