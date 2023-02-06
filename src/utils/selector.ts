import * as cssWhat from 'css-what';
import { ElementNode } from 'lehbs-parser/dist/types/lib/v1/nodes-v1';

import { charsOfConcatTextNode } from './attributes';

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

export function isElementSelected(
  node: ElementNode,
  selectors: cssWhat.Selector[],
) {
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
