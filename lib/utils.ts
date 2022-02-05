export type KeyGenerator = () => string;

export function createKeyGenerator(
  prefix = 'react-md-viewer-',
  start = 1
): KeyGenerator {
  let id = start;
  return () => `react-md-viewer-${id++}`;
}
