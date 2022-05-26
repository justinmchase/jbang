import { Pattern, PatternKind } from "../runtime/patterns/mod.ts";
import { Basic, Compiler, Lang } from "./mod.ts";

export const Meta: Pattern = {
  kind: PatternKind.Block,
  rules: {
    Basic,
    Lang,
    Compiler,
    Main: {
      kind: PatternKind.Rule,
      pattern: {
        kind: PatternKind.Pipeline,
        steps: [
          { kind: PatternKind.Reference, name: "Basic" },
          { kind: PatternKind.Reference, name: "Lang" },
          { kind: PatternKind.Reference, name: "Compiler" },
        ],
      },
    },
  },
};