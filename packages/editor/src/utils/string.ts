export const simpleType = (type: string): string => {
  const typeParts = type.split('.');
  return typeParts.at(-1) ?? '';
};

export const typesString = (parameters: Array<{ type: string }>): string => {
  return parameters.map(param => simpleType(param.type)).join(', ');
};

export function stripELExpression(expr: string): string {
  return expr.replace(/^#\{|\}$/g, '').trim();
}
