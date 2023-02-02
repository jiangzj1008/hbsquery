import { preprocess as parse, builders, traverse, print } from 'lehbs-parser';

export interface Iapi {
  html: () => string;
}

// $('div ')
export function load(code: string) {
  const ast = parse(code);

  function fn(selector: string) {
    traverse(ast, {
      ElementNode: {
        enter: (node) => {
          const attr = builders.attr('class', builders.text('show'));
          node.attributes.push(attr);
        },
      },
    });
  }

  Object.assign(fn, {
    html: () => print(ast),
  });

  return fn as unknown as Iapi;
}
