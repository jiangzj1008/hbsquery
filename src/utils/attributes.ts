import {
  ConcatStatement,
  TextNode,
} from 'lehbs-parser/dist/types/lib/v1/nodes-v1';

const spaceReg = /\s+/;

export function charsOfConcatTextNode(node: ConcatStatement) {
  const ret: Array<{
    index: number;
    chars: string[];
    leadingChar: string;
    tailingChar: string;
  }> = [];

  const length = node.parts.length;
  node.parts.forEach((part, index) => {
    if (part.type === 'TextNode') {
      const firstPart = index === 0;
      const lastPart = index === length - 1;
      const leadingSpace = /^\s/.test(part.chars);
      const tailingSpace = /\s$/.test(part.chars);
      const chars = part.chars.split(spaceReg);
      const leadingChar = !leadingSpace && !firstPart ? chars.splice(0, 1) : [];
      const tailingChar =
        !tailingSpace && !lastPart ? chars.splice(chars.length - 1, 1) : [];

      ret.push({
        index,
        chars,
        leadingChar: leadingChar[0],
        tailingChar: tailingChar[0],
      });
    }
  });

  return ret;
}
