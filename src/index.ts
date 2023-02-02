import { preprocess as parse, traverse } from 'lehbs-parser';

export function fn() {
  const code = '<div></div>';
  const ast = parse(code);
  console.log(ast);
  const a = [1, 2, 3];
  return 1;
}
