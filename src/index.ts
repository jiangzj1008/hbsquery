import { preprocess as parse, traverse, print } from 'lehbs-parser';
import * as cssWhat from 'css-what';
import { ElementNode } from 'lehbs-parser/dist/types/lib/v1/nodes-v1';

import { Hbsquery } from './hbsquery';
import { charsOfConcatTextNode } from './utils';

export interface IElementsList {
  addClass: (classes: string) => ElementNode[];
}

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
    const spaceReg = /\s+/;
    classes = attrNode.value.chars.split(spaceReg);
  } else if (attrNode.value.type === 'ConcatStatement') {
    const charsArr = charsOfConcatTextNode(attrNode.value);
    charsArr.forEach((charsObj) => {
      const { chars } = charsObj;
      classes = [...classes, ...chars];
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
