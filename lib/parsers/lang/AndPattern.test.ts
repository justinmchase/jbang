import { tests } from "../../test.ts";
import { TestLang } from "./Lang.test.ts";
import { LangPatternKind } from "./lang.pattern.ts";

tests("parsers.lang.and", () => [
  {
    id: "AND00",
    description: "x & y",
    pattern: () => TestLang,
    input: "x & y",
    value: {
      kind: LangPatternKind.AndPattern,
      left: {
        kind: LangPatternKind.ReferencePattern,
        name: "x",
      },
      right: {
        kind: LangPatternKind.ReferencePattern,
        name: "y",
      },
    },
  },
]);