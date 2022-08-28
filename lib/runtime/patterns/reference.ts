import { Scope } from "../../scope.ts";
import { Match } from "../../match.ts";
import { match } from "../match.ts";
import { IReferencePattern } from "./pattern.ts";

export function reference(args: IReferencePattern, scope: Scope): Match {
  const { name } = args;
  const rule = scope.getRule(name);
  if (rule) {
    const s = scope.pushRef(name);
    const m = match(rule, s);
    // console.log(`${scope.stream.path} (${Deno.inspect(scope.stream.value, { colors: true, depth: 10 })}) match (${name})`)
    return m.popRef(scope);
  } else {
    return Match.Fail(scope).pushError(
      "MissingReference",
      `The rule ${name} was not found`,
      scope,
      scope,
    );
  }
}
