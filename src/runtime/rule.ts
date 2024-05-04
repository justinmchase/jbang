import {
  error,
  fail,
  lr,
  Match,
  MatchErrorCode,
  MatchKind,
  ok,
} from "../match.ts";
import { Scope } from "./scope.ts";
import { Rule } from "./modules/mod.ts";
import { match } from "./match.ts";
import { StackFrameKind } from "./stack/stackFrameKind.ts";

export function rule(rule: Rule, scope: Scope): Match {
  const { module, pattern } = rule;
  let memo = scope.memos.get(scope.stream.path, rule);
  if (!memo) {
    memo = scope.memos.set(scope.stream.path, rule, lr(scope, rule.pattern));
    const subScope = scope
      .pushModule(module)
      .pushRule(rule);

    const m = match(pattern, subScope);
    memo.match = m;
    switch (m.kind) {
      case MatchKind.LR:
        return grow(rule, subScope);
      case MatchKind.Error:
        return m;
      case MatchKind.Fail:
        return fail(scope, rule.pattern, [m]);
      case MatchKind.Ok:
        return ok(
          scope,
          scope.withInput(m.scope.stream),
          rule.pattern,
          m.value,
          [m],
        );
    }
  } else {
    const m = memo.match;
    const frame = scope.stack[scope.stack.length - 1];
    switch (m.kind) {
      case MatchKind.Error:
        return m;
      case MatchKind.LR:
        if (frame?.kind !== StackFrameKind.Rule) {
          return error(
            scope,
            rule.pattern,
            MatchErrorCode.IndirectLeftRecursion,
            `Unexpected stack frame kind ${frame.kind}`,
          );
        } else if (!Object.is(frame.rule, rule)) {
          // This is a different rule than the one we're trying to match
          // Therefore ILR is detected and we should fail
          // todo: should this be an error instead?
          return fail(scope, rule.pattern);
        } else {
          // Otherwise end the LR and continue
          return m;
          // return ok(scope, scope.withInput(m.scope.stream), rule.pattern, undefined, [memo.match])
        }
      case MatchKind.Fail:
        return fail(scope, rule.pattern, [m]);
      case MatchKind.Ok:
        return ok(
          scope,
          scope.withInput(m.scope.stream),
          rule.pattern,
          m.value,
          [m],
        );
    }
  }
}

function grow(rule: Rule, scope: Scope): Match {
  const { pattern } = rule;
  let growing = true;
  let m: Match = fail(scope, pattern);
  const start = scope.stream;
  const memo = scope.memos.get(start.path, rule);
  if (!memo) {
    throw Error("Expected memo to be set");
  }

  while (growing) {
    memo.match = m;
    const growScope = m
      .scope
      .withInput(start);

    const result = match(pattern, growScope);
    const progressed =
      result.scope.stream.path.compareTo(m.scope.stream.path) > 0;
    switch (result.kind) {
      case MatchKind.LR:
      case MatchKind.Error:
        return result;
      case MatchKind.Fail:
        growing = false;
        break;
      case MatchKind.Ok:
        if (!progressed) {
          growing = false;
        } else {
          m = result;
        }
        break;
    }
  }

  switch (m.kind) {
    case MatchKind.Fail:
      return fail(scope, pattern, [m]);
    case MatchKind.Ok:
      return ok(scope, m.scope, pattern, m.value, [m]);
  }
}
