import { tests } from "../../test.ts";
import { TestLang } from "./TestLang.test.ts"
import { LangExpressionKind, LangPatternKind } from "./lang.pattern.ts";

tests(import.meta.url, () => [
  {
    id: "ORPATTERN00",
    description: "can parse a reference expression",
    pattern: () => TestLang,
    input: "x | y",
    value: {
      kind: LangPatternKind.OrPattern,
      left: {
        kind: "ReferencePattern",
        name: "x",
      },
      right: {
        kind: "ReferencePattern",
        name: "y",
      },
    },
  },
  {
    id: "ORPATTERN01",
    description: "can parse a projection expression",
    pattern: () => TestLang,
    input: "x -> $0 | y",
    value: {
      kind: LangPatternKind.OrPattern,
      left: {
        kind: LangPatternKind.ProjectionPattern,
        pattern: {
          kind: "ReferencePattern",
          name: "x",
        },
        expression: {
          kind: LangExpressionKind.SpecialReferenceExpression,
          name: "$0",
        },
      },
      right: {
        kind: "ReferencePattern",
        name: "y",
      },
    },
  },
  {
    id: "ORPATTERN02",
    description: "can parse two then expressions",
    pattern: () => TestLang,
    input: "w x | y z",
    value: {
      kind: LangPatternKind.OrPattern,
      left: {
        kind: LangPatternKind.ThenPattern,
        left: {
          kind: LangPatternKind.ReferencePattern,
          name: "w",
        },
        right: {
          kind: LangPatternKind.ReferencePattern,
          name: "x",
        },
      },
      right: {
        kind: LangPatternKind.ThenPattern,
        left: {
          kind: LangPatternKind.ReferencePattern,
          name: "y",
        },
        right: {
          kind: LangPatternKind.ReferencePattern,
          name: "z",
        },
      },
    },
  },
]);
