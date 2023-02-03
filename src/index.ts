import { preprocess as parse, builders, traverse, print } from 'lehbs-parser';
import * as cssWhat from 'css-what';
import { ElementNode } from 'lehbs-parser/dist/types/lib/v1/nodes-v1';

export interface IElementsList {
  addClass: (classes: string) => ElementNode[];
}

function isSlementSelected(node: ElementNode, selectors: cssWhat.Selector[]) {
  let valid = false;

  selectors.map((sel) => {
    switch (sel.type) {
      case 'attribute':
        const { name, value } = sel;
        const { attributes } = node;

        const attrNode = attributes.find((attr) => attr.name === name);
        if (!attrNode) {
          break;
        }

        if (attrNode.value.type === 'TextNode') {
          if (attrNode.value.chars.includes(value)) {
            valid = true;
          }
        } else if (attrNode.value.type === 'ConcatStatement') {
          attrNode.value.parts.forEach((part) => {
            if (part.type === 'TextNode') {
              if (part.chars.includes(value)) {
                valid = true;
              }
            }
          });
        }

        break;
      default:
        break;
    }
  });

  return valid;
}

// $('div ')
export function load(code: string) {
  const ast = parse(code);

  function fn(selector: string) {
    const sels = cssWhat.parse(selector);

    let eles: IElementsList & ElementNode[] = Object.assign([], {
      addClass: (classes: string) => {
        eles.forEach((ele) => {
          const attrNode = ele.attributes.find((attr) => attr.name === 'class');
          if (!attrNode) {
            return;
          }
          if (attrNode.value.type === 'ConcatStatement') {
            attrNode.value.parts.push(builders.text(` ${classes}`));
          } else if (attrNode.value.type === 'TextNode') {
            attrNode.value.chars += ` ${classes}`;
          }
        });

        return eles;
      },
    });

    traverse(ast, {
      ElementNode: {
        enter: (node) => {
          sels.map((sel) => {
            if (isSlementSelected(node, sel)) {
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
