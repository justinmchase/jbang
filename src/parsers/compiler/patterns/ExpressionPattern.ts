import { IRulePattern, PatternKind } from "../../../runtime/patterns/mod.ts";
import { LangExpressionKind } from "../../lang/lang.pattern.ts";

export const ExpressionPattern: IRulePattern = {
  kind: PatternKind.Rule,
  pattern: {
    kind: PatternKind.Or,
    patterns: [
      {
        kind: PatternKind.Reference,
        name: LangExpressionKind.AddExpression,
      },
      {
        kind: PatternKind.Reference,
        name: LangExpressionKind.ArrayExpression,
      },
      {
        kind: PatternKind.Reference,
        name: LangExpressionKind.SpecialReferenceExpression,
      },
      {
        kind: PatternKind.Reference,
        name: LangExpressionKind.ReferenceExpression,
      },
    ],
  },
};
