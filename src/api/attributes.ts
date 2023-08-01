import { ElementNode, AttrNode } from 'lehbs-parser/dist/types/lib/v1/nodes-v1';
import { builders, print } from 'lehbs-parser';
import { charsOfConcatTextNode } from '../utils';

import { reg } from '../utils';

export function addClass<R extends Array<ElementNode>>(this: R, value: string) {
  const classNames = value.split(reg.rspace);

  this.forEach((ele) => {
    let attrNode = ele.attributes.find((attr) => attr.name === 'class');
    if (!attrNode) {
      attrNode = builders.attr('class', builders.text(''));
      ele.attributes.push(attrNode);
    }
    if (attrNode.value.type === 'ConcatStatement') {
      const currentCharsArr = charsOfConcatTextNode(attrNode.value);

      const newClsMap: Record<string, number> = {};
      currentCharsArr.forEach((charsObj) => {
        const { chars } = charsObj;
        chars.forEach((char) => {
          if (!char) {
            return;
          }
          if (newClsMap[char]) {
            newClsMap[char] += 1;
          } else {
            newClsMap[char] = 1;
          }
        });
      });
      classNames.forEach((cn) => {
        if (!cn) {
          return;
        }
        if (newClsMap[cn]) {
          newClsMap[cn] += 1;
        } else {
          newClsMap[cn] = 1;
        }
      });

      const newClsValue = Object.keys(newClsMap)
        .filter((key) => newClsMap[key] === 1)
        .join(' ');

      attrNode.value.parts.push(builders.text(` ${newClsValue}`));
    } else if (attrNode.value.type === 'TextNode') {
      const currentClsArr = attrNode.value.chars.split(reg.rspace);
      const newClsArr = classNames.filter(
        (cls) => !currentClsArr.includes(cls),
      );
      attrNode.value.chars = `${currentClsArr.join(' ')} ${newClsArr.join(
        ' ',
      )}`.trim();
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
  const classNames = value.split(reg.rspace);

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
        const valid = chars.filter((char) => classNames.includes(char));
        if (valid.length > 0) {
          return true;
        }
      }
    } else if (attrNode.value.type === 'TextNode') {
      const currentClsArr = attrNode.value.chars.split(reg.rspace);
      const valid = currentClsArr.filter((cls) => classNames.includes(cls));
      return valid.length > 0;
    }

    return false;
  });

  return valid;
}

function setAttr(ele: ElementNode, name: string, value: string | null) {
  if (value) {
    const attrNode = ele.attributes.find((attr) => attr.name === name);
    if (!attrNode) {
      const attr = builders.attr(name, builders.text(value));
      ele.attributes.push(attr);
    } else {
      attrNode.value = builders.text(value);
    }
  } else {
    ele.attributes = ele.attributes.filter((attr) => attr.name !== name);
  }
}

class AttributeValue {
  value: AttrNode["value"]
  
  constructor(attr: AttrNode) {
    this.value = attr.value
  }

  toString() {
    const value = this.value

    if (value.type === 'ConcatStatement') {
      const vals = value.parts.map(val => print(val))
      return vals.join('')
    }

    return print(value)
  }
}

function getAttr(ele: ElementNode, name: string) {
  const attribute = ele.attributes.find((attr) => attr.name === name)
  
  if (!attribute) {
    return
  }

  return new AttributeValue(attribute)
}

export function attr<R extends Array<ElementNode>>(
  this: R,
  name?: string | Record<string, string | null>,
  value?: string | null,
) {
  if (!name) {
    // todo
    // 考虑把 hbs 节点返回
    return this;
  }

  if (typeof name === 'object' || value !== undefined) {
    this.forEach((ele) => {
      if (typeof name === 'object') {
        for (const objName of Object.keys(name)) {
          const objValue = name[objName];
          setAttr(ele, objName, objValue);
        }
      } else if (value !== undefined) {
        setAttr(ele, name, value);
      }
    });
  }

  if (typeof name === 'string' && value === undefined) {
    return getAttr(this[0], name)
  }

  return this;
}
