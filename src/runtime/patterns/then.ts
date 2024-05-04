import { fail, Match, MatchKind, ok } from "../../match.ts";
import { Scope } from "../scope.ts";
import { match } from "../match.ts";
import { IThenPattern } from "./pattern.ts";

export function then(pattern: IThenPattern, scope: Scope): Match {
  const { patterns } = pattern;
  let end = scope;
  const matches: Match[] = [];
  const values: unknown[] = [];
  for (const pattern of patterns) {
    const m = match(pattern, end);
    matches.push(m);

    switch (m.kind) {
      case MatchKind.LR:
      case MatchKind.Error:
        return m;
      case MatchKind.Fail:
        return fail(scope, pattern, matches);
      case MatchKind.Ok:
        values.push(m.value);
        end = m.scope;
        break;
    }
  }

  return ok(scope, end, pattern, values, matches);
}
