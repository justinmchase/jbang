import { extname } from "std/path/mod.ts";
import { DeclarationKind, ModuleDeclaration } from "./declarations/mod.ts";
import { Module, ModuleKind } from "./modules/mod.ts";
import { IModuleResolvers } from "./resolvers/resolver.ts";
import { ImportResolver, JsonResolver } from "./resolvers/mod.ts";

export type ResolverOptions = {
  declarations?: Record<string, ModuleDeclaration>;
  resolvers?: IModuleResolvers;
  trace?: boolean;
};

export class Resolver {
  public static readonly DefaultResolvers: IModuleResolvers = {
    [".json"]: new JsonResolver(),
    [".ts"]: new ImportResolver(),
    [".js"]: new ImportResolver(),
  };

  private readonly modules = new Map<string, Module>();
  private readonly declarations: Map<string, ModuleDeclaration>;
  private readonly resolvers: IModuleResolvers;
  constructor(opts?: ResolverOptions) {
    const {
      declarations = new Map<string, ModuleDeclaration>(),
      resolvers = Resolver.DefaultResolvers,
    } = opts ?? {};
    this.declarations = new Map(Object.entries(declarations));
    this.resolvers = resolvers;
  }

  public async import(moduleUrl: URL): Promise<Module> {
    if (this.modules.has(moduleUrl.href)) {
      return this.modules.get(moduleUrl.href)!;
    } else {
      const module: Module = {
        kind: ModuleKind.Module,
        moduleUrl,
        imports: new Map(),
        rules: new Map(),
      };
      this.modules.set(moduleUrl.href, module);
      const moduleDeclaration = await this.importModule(moduleUrl);
      for (const { name, pattern, parameters } of moduleDeclaration.rules) {
        module.rules.set(name, {
          kind: ModuleKind.Rule,
          module,
          name,
          parameters,
          pattern,
        });
      }
      for (const i of moduleDeclaration.imports) {
        const resolvedModuleUrl = new URL(i.moduleUrl, moduleUrl);
        if (
          i.kind === DeclarationKind.NativeImport &&
          !this.declarations.has(resolvedModuleUrl.href)
        ) {
          const importedModuleDeclaration = typeof i.module === "function"
            ? i.module()
            : i.module;
          this.declarations.set(
            resolvedModuleUrl.href,
            importedModuleDeclaration,
          );
        }
        const importedModule = await this.import(resolvedModuleUrl);
        for (const name of i.names) {
          module.imports.set(name, {
            kind: ModuleKind.Import,
            name,
            module: importedModule,
          });
        }
      }
      return module;
    }
  }

  private async importModule(moduleUrl: URL): Promise<ModuleDeclaration> {
    if (this.declarations.has(moduleUrl.href)) {
      return this.declarations.get(moduleUrl.href)!;
    } else {
      const ext = extname(moduleUrl.pathname);
      const resolver = this.resolvers[ext];
      if (!resolver) {
        // todo: Use proper errors
        throw new Error(`Unable to resolve file of unknown extension ${ext}`);
      }
      const declaration = await resolver.resolveModule(moduleUrl);
      this.declarations.set(moduleUrl.href, declaration);
      return declaration;
    }
  }
}
