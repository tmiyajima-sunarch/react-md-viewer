import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';
import { Children, cloneElement, createElement, useMemo } from 'react';
import { createKeyGenerator, KeyGenerator } from './utils';

export const DefaultMarkdownItOptions: MarkdownIt.Options = {
  breaks: true,
  linkify: true,
  typographer: true,
};

export function createMarkdownIt(
  options: MarkdownIt.Options = DefaultMarkdownItOptions
): MarkdownIt {
  return MarkdownIt(options);
}

export type ReactMDViewerProps = {
  markdownIt?: MarkdownIt;
  text?: string;
  classNames?: Record<string, string>;
};

export function ReactMDViewer({
  markdownIt = createMarkdownIt(),
  text,
  classNames,
}: ReactMDViewerProps): JSX.Element {
  const tokens = useMemo(
    () => (text ? markdownIt.parse(text, {}) : undefined),
    [text, markdownIt]
  );

  const transformed = useMemo(
    () => (tokens ? transform(tokens, { classNames }) : undefined),
    [classNames, tokens]
  );

  return <div data-testid="react-md-viewer">{transformed}</div>;
}

type TransformOptions = {
  keyGenerator?: KeyGenerator;
  classNames?: Record<string, string>;
};

function transform(
  tokens: Token[],
  {
    keyGenerator = createKeyGenerator(),
    classNames = {},
  }: TransformOptions = {}
): JSX.Element {
  const stack: JSX.Element[] = [<></>];

  for (const token of tokens) {
    switch (token.nesting) {
      case 1: {
        const element = createNestElement(token, keyGenerator, classNames);
        stack.push(element);
        break;
      }

      case -1: {
        const element = stack.pop();
        checkDefined(element, 'No element on unnesting');
        const parent = stack.pop();
        checkDefined(parent, 'No parent element');
        const newParent = cloneElementAddingChildren(parent, [element]);
        stack.push(newParent);
        break;
      }

      case 0: {
        const element = createFlatElement(token, keyGenerator, classNames);
        const parent = stack.pop();
        checkDefined(parent, 'No parent element');
        const newParent = cloneElementAddingChildren(parent, [element]);
        stack.push(newParent);
        break;
      }

      default:
        throw new Error(
          `Unexpected nesting value '${
            token.nesting
          }' on token '${JSON.stringify(token)}'`
        );
    }
  }

  check(stack.length === 1, `Unexpected stack size: ${stack.length}`);
  return stack[0];
}

function createNestElement(
  token: Token,
  keyGenerator: KeyGenerator,
  classNames: Record<string, string>
): JSX.Element {
  const tag = determinTag(token);
  const props = attrsToProps(token.attrs);
  const className = joinClassNames(props.className, classNames[tag]);
  return createElement(tag, { key: keyGenerator(), ...props, className });
}

function createFlatElement(
  token: Token,
  keyGenerator: KeyGenerator,
  classNames: Record<string, string>
): JSX.Element {
  // imgの場合、children内にaltの内容が含まれてくるが、
  // それをそのままElementのchildrenにしてしまうとエラーになるため、特別対処が必要
  // contentにもaltの内容が入るため、それを使用する
  if (token.tag === 'img') {
    const tag = 'img';
    const props = attrsToProps(token.attrs);
    const className = joinClassNames(props.className, classNames[tag]);
    return createElement(tag, {
      ...props,
      alt: token.content,
      className,
    });
  }

  const tag = determinTag(token);
  const props = attrsToProps(token.attrs);
  const className = joinClassNames(props.className, classNames[tag]);
  const children = token.children
    ? transform(token.children, { keyGenerator, classNames })
    : token.content
    ? token.content
    : undefined;
  return createElement(
    tag,
    { key: keyGenerator(), ...props, className },
    children
  );
}

function determinTag(token: Token): string {
  if (token.tag === 'code' && token.block) {
    return 'pre';
  }

  if (token.tag) {
    return token.tag;
  }

  return token.block ? 'div' : 'span';
}

function joinClassNames(...classNames: (string | undefined)[]): string {
  return classNames.filter(Boolean).join(' ');
}

function cloneElementAddingChildren(
  parent: JSX.Element,
  children: JSX.Element[]
): JSX.Element {
  const currentChildren = Children.toArray(parent.props.children);
  return cloneElement(parent, parent.props, [...currentChildren, ...children]);
}

function attrsToProps(attrs: Token['attrs']): Record<string, any> {
  if (!attrs) {
    return {};
  }

  return attrs.reduce((props, [k, v]) => {
    if (k === 'style') {
      props[k] = styleStringToObject(v);
    } else {
      props[k] = v;
    }
    return props;
  }, {} as Record<string, any>);
}

function styleStringToObject(style: string): Record<string, string> {
  return style
    .split(';')
    .map((prop) => prop.split(':') as [string, string])
    .reduce((props, [k, v]) => {
      props[k.trim()] = v.trim();
      return props;
    }, {} as Record<string, string>);
}

function check(state: boolean, message?: string): void {
  if (!state) {
    throw new Error(`Assertion failure: ${message}`);
  }
}

function checkDefined<T>(
  value: T | undefined,
  message?: string
): asserts value is T {
  check(value !== undefined, message);
}
