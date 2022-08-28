import { tests } from "../../test.ts";
import { TestLang } from "./TestLang.test.ts";
import { LangExpressionKind, LangPatternKind } from "./lang.pattern.ts";

tests(import.meta.url, () => [
  {
    id: "PROJECT00",
    description: "can parse a projection",
    pattern: () => TestLang,
    input: "x -> $0",
    value: {
      kind: LangPatternKind.ProjectionPattern,
      pattern: {
        kind: LangPatternKind.ReferencePattern,
        name: "x",
      },
      expression: {
        kind: LangExpressionKind.SpecialReferenceExpression,
        name: "$0",
      },
    },
  },
  {
    id: "PROJECT01",
    description: "can parse a variable",
    pattern: () => TestLang,
    input: "x:y -> $0",
    value: {
      kind: LangPatternKind.ProjectionPattern,
      pattern: {
        kind: LangPatternKind.VariablePattern,
        name: "x",
        pattern: {
          kind: LangPatternKind.ReferencePattern,
          name: "y",
        },
      },
      expression: {
        kind: LangExpressionKind.SpecialReferenceExpression,
        name: "$0",
      },
    },
  },
]);
