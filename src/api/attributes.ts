import { ElementNode } from 'lehbs-parser/dist/types/lib/v1/nodes-v1';
import { builders } from 'lehbs-parser';
import { charsOfConcatTextNode } from '../utils';

import { reg } from '../utils';

export function addClass<R extends Array<ElementNode>>(this: R, value: string) {
  this.forEach((ele) => {
    let attrNode = ele.attributes.find((attr) => attr.name === 'class');
    if (!attrNode) {
      attrNode = builders.attr('class', builders.text(''));
      ele.attributes.push(attrNode);
    }
    if (attrNode.value.type === 'ConcatStatement') {
      attrNode.value.parts.push(builders.text(` ${value}`));
    } else if (attrNode.value.type === 'TextNode') {
      attrNode.value.chars = `${attrNode.value.chars} ${value}`.trim();
    }
  });

  return this;
}

export function removeClass<R extends Array<ElementNode>>(
  this: R,
  value?: string,
) {
  this.forEach((ele) => {
    let attrNode = ele.attributes.find((attr) => attr.name === 'class');

    if (!attrNode) {
      return this;
    }

    if (!value) {
      ele.attributes = ele.attributes.filter((attr) => attr.name !== 'class');
    }

    const removeClsArr = value?.split(reg.rspace);
    if (attrNode.value.type === 'ConcatStatement') {
      const charsArr = charsOfConcatTextNode(attrNode.value);
      const attrValue = attrNode.value;
      charsArr.forEach((charsObj) => {
        const { index, chars, leadingChar, tailingChar } = charsObj;
        const newChars = chars.filter((char) => !removeClsArr?.includes(char));
        const textNode = attrValue.parts[index];
        if (textNode.type !== 'TextNode') {
          throw new Error(`AttrNode index[{${index}}] is not TextNode`);
        } else {
          textNode.chars = `${leadingChar} ${newChars.join(
            ' ',
          )} ${tailingChar}`;
          const middleChars = newChars.join(' ');
          const leadingChars = leadingChar ? `${leadingChar} ` : '';
          const tailingChars = tailingChar ? ` ${tailingChar}` : '';
          textNode.chars = leadingChars + middleChars + tailingChars;
          textNode.chars = textNode.chars.trim();
        }
      });
    } else if (attrNode.value.type === 'TextNode') {
      const currentClsArr = attrNode.value.chars.split(reg.rspace);
      const newClsArr = currentClsArr.filter(
        (cls) => !removeClsArr?.includes(cls),
      );
      attrNode.value.chars = newClsArr.join(' ');
    }

    return this;
  });
}

export function hasClass<R extends Array<ElementNode>>(this: R, value: string) {
  const valid = this.some((ele) => {
    let attrNode = ele.attributes.find((attr) => attr.name === 'class');
    if (!attrNode) {
      return false;
    }

    if (attrNode.value.type === 'ConcatStatement') {
      const charsArr = charsOfConcatTextNode(attrNode.value);
      for (let index = 0; index < charsArr.length; index++) {
        const charsObj = charsArr[index];
        const { chars } = charsObj;
        if (chars.includes(value)) {
          return true;
        }
      }
    } else if (attrNode.value.type === 'TextNode') {
      const currentClsArr = attrNode.value.chars.split(reg.rspace);
      return currentClsArr.includes(value);
    }

    return false;
  });

  return valid;
}
