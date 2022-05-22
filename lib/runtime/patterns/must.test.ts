import { tests } from "../../test.ts";
import { PatternKind } from "./pattern.kind.ts";

tests(import.meta.url, () => [
  {
    id: "MUST00",
    description: "ok!",
    pattern: () => ({
      kind: PatternKind.Must,
      name: "Test",
      message: "Testing",
      pattern: { kind: PatternKind.Ok },
    }),
    input: [],
  },
  {
    id: "MUST01",
    description: "fail!",
    pattern: () => ({
      kind: PatternKind.Must,
      name: "Test",
      message: "Testing",
      pattern: { kind: PatternKind.Fail },
    }),
    input: [],
    matched: false,
    errors: [
      { name: "Test", message: "Testing", start: "-1", end: "-1" },
    ],
  },
  {
    id: "MUST01",
    description: "'a'!",
    pattern: () => ({
      kind: PatternKind.Must,
      name: "Test",
      message: "Testing",
      pattern: { kind: PatternKind.Equal, value: "a" },
    }),
    input: "a",
    value: "a",
  },
  {
    id: "MUST01",
    description: "'a'!",
    pattern: () => ({
      kind: PatternKind.Must,
      name: "Test",
      message: "Testing",
      pattern: { kind: PatternKind.Equal, value: "a" },
    }),
    input: "b",
    matched: false,
    done: false,
    errors: [
      { name: "Test", message: "Testing", start: "-1", end: "-1" },
    ],
  },
]);
