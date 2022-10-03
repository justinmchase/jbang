import { IRulePattern, PatternKind } from "../../../runtime/patterns/mod.ts";

export const TerminalPattern: IRulePattern = {
  kind: PatternKind.Rule,
  pattern: {
    kind: PatternKind.Or,
    patterns: [
      { kind: PatternKind.Reference, name: "AnyPattern" },
      { kind: PatternKind.Reference, name: "OkPattern" },
      { kind: PatternKind.Reference, name: "TypePattern" },
      { kind: PatternKind.Reference, name: "SpecialReferencePattern" },
      { kind: PatternKind.Reference, name: "ReferencePattern" },
      { kind: PatternKind.Reference, name: "ObjectPattern" },
      { kind: PatternKind.Reference, name: "RangePattern" },
      { kind: PatternKind.Reference, name: "StringPattern" },
      { kind: PatternKind.Reference, name: "NumberPattern" },
      { kind: PatternKind.Reference, name: "GroupPattern" },
    ],
  },
};