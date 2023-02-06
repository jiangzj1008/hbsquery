import { preprocess as parse, traverse, print } from 'lehbs-parser';
import * as cssWhat from 'css-what';
import { ElementNode } from 'lehbs-parser/dist/types/lib/v1/nodes-v1';

import { Hbsquery } from './hbsquery';
import { isElementSelected } from './utils';

export function load(code: string) {
  const ast = parse(code);

  function fn(selector: string) {
    const sels = cssWhat.parse(selector);

    let eles = new Hbsquery<ElementNode>([]);

    traverse(ast, {
      ElementNode: {
        enter: (node) => {
          sels.map((sel) => {
            if (isElementSelected(node, sel)) {
              eles.push(node);
            }
          });
        },
      },
    });

    return eles;
  }

  fn.html = () => print(ast);

  return fn;
}
