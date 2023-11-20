import { Pattern } from "./patterns/mod.ts";
import { Input } from "../input.ts";
import { Memos } from "../memo.ts";
import { DefaultModule, Module, Rule, Special } from "./modules/mod.ts";
import { Resolver } from "./resolve.ts";
import { runtime } from "./runtime.ts";
import { StackFrame } from "./stack/frame.ts";
import { StackFrameKind } from "./stack/stackFrameKind.ts";

export type ScopeOptions = {
  trace: boolean;
  specials: Map<string, Special>;
  globals: Record<string, unknown>;
  resolver: Resolver;
}

export const DefaultOptions: () => ScopeOptions = () => ({
  globals: runtime,
  specials: new Map(),
  trace: false,
  resolver: new Resolver(),
});

export class Scope {
  public static readonly Default = () => new Scope();
  public static readonly From = (input: Input | Iterable<unknown> | Iterator<unknown>) => Scope.Default().withInput(
    input instanceof Input
    ? input
    : Input.From(input)
  );

  public readonly options: ScopeOptions;
  constructor(
    public readonly module: Module = DefaultModule(),
    public readonly parent: Scope | undefined = undefined,
    public readonly variables: Record<string, unknown> = {},
    public readonly stream: Input = Input.Default(),
    public readonly memos: Memos = new Memos(),
    public readonly stack: StackFrame[] = [],
    options?: Partial<ScopeOptions>,
  ) {
    this.options = {
      ...DefaultOptions(),
      ...options,
    };
  }

  public get depth() {
    return this.stack.length;
  }

  public getSpecial(name: string) {
    return this.options.specials?.get(name);
  }

  public getRule(name: string): Rule | undefined {
    return this.module.rules.has(name)
      ? this.module.rules.get(name)
      : this.module.imports.get(name)?.module.rules.get(name);
  }

  public withInput(input: Input) {
    return new Scope(
      this.module,
      this.parent,
      this.variables,
      input,
      this.memos,
      this.stack,
      this.options,
    );
  }

  public addVariables(variables: Record<string, unknown>) {
    return new Scope(
      this.module,
      this.parent,
      Object.assign({}, this.variables, variables),
      this.stream,
      this.memos,
      this.stack,
      this.options,
    );
  }

  public setVariables(variables: Record<string, unknown>) {
    return new Scope(
      this.module,
      this.parent,
      Object.assign({}, this.variables, variables),
      this.stream,
      this.memos,
      this.stack,
      this.options,
    );
  }

  public pushRule(rule: Rule) {
    return new Scope(
      this.module,
      this.parent,
      {},
      this.stream,
      this.memos,
      [...this.stack, { kind: StackFrameKind.Rule, rule }],
      this.options,
    );
  }

  public pushPipeline(pipeline: Pattern) {
    return new Scope(
      this.module,
      this.parent,
      {},
      this.stream,
      this.memos,
      [...this.stack, { kind: StackFrameKind.Pipeline, pipeline }],
      this.options,
    );
  }

  public pushModule(module: Module) {
    if (this.module === module) {
      return this;
    }
    return new Scope(
      module,
      undefined,
      {},
      this.stream,
      this.memos,
      this.module !== module ? [...this.stack, { kind: StackFrameKind.Module, module }] : this.stack,
      this.options,
    );
  }

  /// <summary>
  /// The scope should be the original scope from before the rule was pushed.
  /// The entire original scope is returned, except for the stream and memos.
  /// </summary>
  public pop(scope: Scope) {
    return new Scope(
      scope.module,
      scope.parent,
      scope.variables,
      this.stream,
      this.memos,
      scope.stack,
      scope.options,
    );
  }

  public withOptions(options: Partial<ScopeOptions>) {
    return new Scope(
      this.module,
      this.parent,
      this.variables,
      this.stream,
      this.memos,
      this.stack,
      {
        ...this.options,
        ...options,
      },
    );
  }
}
