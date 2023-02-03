import { preprocess as parse, builders, traverse, print } from 'lehbs-parser';
import * as cssWhat from 'css-what';
import { ElementNode } from 'lehbs-parser/dist/types/lib/v1/nodes-v1';

export interface IElementsList {
  addClass: (classes: string) => ElementNode[];
}

const spaceReg = /\s+/;

function checkAttribute(node: ElementNode, selector: cssWhat.Selector) {
  if (selector.type !== 'attribute') {
    return false;
  }

  const { name, value } = selector;
  const { attributes } = node;

  const attrNode = attributes.find((attr) => attr.name === name);
  if (!attrNode) {
    return false;
  }

  let classes: string[] = [];

  if (attrNode.value.type === 'TextNode') {
    classes = attrNode.value.chars.split(spaceReg);
  } else if (attrNode.value.type === 'ConcatStatement') {
    const length = attrNode.value.parts.length;
    attrNode.value.parts.forEach((part, index) => {
      if (part.type === 'TextNode') {
        const firstPart = index === 0;
        const lastPart = index === length - 1;
        const leadingSpace = /^\s/.test(part.chars);
        const tailingSpace = /\s$/.test(part.chars);
        const chars = part.chars.split(spaceReg);
        !leadingSpace && !firstPart && chars.splice(0, 1);
        !tailingSpace && !lastPart && chars.splice(chars.length - 1, 1);
        classes = [...classes, ...chars];
      }
    });
  }

  if (classes.includes(value)) {
    return true;
  }

  return false;
}

function checkTag(node: ElementNode, selector: cssWhat.Selector) {
  if (selector.type !== 'tag') {
    return false;
  }

  const { name } = selector;

  return node.tag === name;
}

function isElementSelected(node: ElementNode, selectors: cssWhat.Selector[]) {
  let valid = true;

  selectors.forEach((sel) => {
    switch (sel.type) {
      case 'attribute':
        if (!checkAttribute(node, sel)) {
          valid = false;
        }
        break;
      case 'tag':
        if (!checkTag(node, sel)) {
          valid = false;
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
          let attrNode = ele.attributes.find((attr) => attr.name === 'class');
          if (!attrNode) {
            attrNode = builders.attr('class', builders.text(''));
            ele.attributes.push(attrNode);
          }
          if (attrNode.value.type === 'ConcatStatement') {
            attrNode.value.parts.push(builders.text(` ${classes}`));
          } else if (attrNode.value.type === 'TextNode') {
            attrNode.value.chars = `${attrNode.value.chars} ${classes}`.trim();
          }
        });

        return eles;
      },
      removeClass: (cls?: string) => {
        eles.forEach((ele) => {});
      },
    });

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
