import { Pattern } from "../patterns/pattern.ts";
import { ExpressionKind } from "./expression.kind.ts";

export type ProjectionFunction = (
  // deno-lint-ignore no-explicit-any
  args: any,
  specials: Record<string, unknown>,
  // deno-lint-ignore no-explicit-any
) => any;

export function isExpression(value: unknown): value is Expression {
  if (value == null) return false;
  if (typeof value !== "object") return false;
  const p = value as Expression;
  return Reflect.has(ExpressionKind, p.kind);
}

export type Expression =
  | IAddExpression
  | IArrayExpression
  | IInvocationExpression
  | ILambdaExpression
  | IMemberExpression
  | INativeExpression
  | IReferenceExpression
  | ISpecialReferenceExpression
  | ISubtractExpression
  | ISubtractExpression
  | IValueExpression;

export interface IAddExpression {
  kind: ExpressionKind.Add;
  left: Expression;
  right: Expression;
}

export interface IArrayExpression {
  kind: ExpressionKind.Array;
  expressions: Expression[];
}

export interface IInvocationExpression {
  kind: ExpressionKind.Invocation;
  expression: Expression;
  args: Expression[];
}

export interface ILambdaExpression {
  kind: ExpressionKind.Lambda;
  pattern: Pattern;
  expression: Expression;
}

export interface IMemberExpression {
  kind: ExpressionKind.Member;
  name: string;
  expression: Expression;
}

export interface INativeExpression {
  kind: ExpressionKind.Native;
  fn: ProjectionFunction;
}

export interface IReferenceExpression {
  kind: ExpressionKind.Reference;
  name: string;
}

export interface ISpecialReferenceExpression {
  kind: ExpressionKind.SpecialReference;
  name: string;
}

export interface ISubtractExpression {
  kind: ExpressionKind.Subtract;
  left: Expression;
  right: Expression;
}

export interface IValueExpression {
  kind: ExpressionKind.Value;
  value: unknown;
}
