import { ElementNode } from 'lehbs-parser/dist/types/lib/v1/nodes-v1';
import { builders } from 'lehbs-parser';

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

    const removeClsArr = value?.split(/\s+/);
    if (attrNode.value.type === 'ConcatStatement') {
      const textNodeArr = attrNode.value.parts.filter(
        (node) => node.type === 'TextNode',
      );
      // todo
      textNodeArr.forEach((node) => {});
    } else if (attrNode.value.type === 'TextNode') {
      const currentClsArr = attrNode.value.chars.split(/\s+/);
      const newClsArr = currentClsArr.filter(
        (cls) => !removeClsArr?.includes(cls),
      );
      attrNode.value.chars = newClsArr.join(' ');
    }

    return this;
  });
}
