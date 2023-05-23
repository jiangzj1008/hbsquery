import { preprocess as parse, traverse, print } from 'lehbs-parser';
import * as cssWhat from 'css-what';
import { ElementNode } from 'lehbs-parser/dist/types/lib/v1/nodes-v1';

import { Hbsquery } from './hbsquery';
import { isElementSelected } from './utils';

export function load(code: string) {
  const ast = parse(code);

  function fn(selector: string | ElementNode) {
    const isElement = typeof selector !== 'string';

    let eles = new Hbsquery<ElementNode>([]);

    if (isElement) {
      eles.push(selector);
      return eles;
    }

    const sels = cssWhat.parse(selector);

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

  fn.template = () => print(ast);

  return fn;
}
