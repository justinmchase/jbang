import { Pattern, PatternKind } from '../../runtime/patterns/mod.ts'
import { ExpressionKind } from '../../runtime/expressions/mod.ts'
import { LangPatternKind } from './lang.pattern.ts'

export const ObjectKeyVariablePattern: Pattern = {
  kind: PatternKind.Rule,
  pattern: {
    kind: PatternKind.Projection,
    pattern: {
      kind: PatternKind.Then,
      patterns: [
        {
          kind: PatternKind.Object,
          keys: {
            type: { kind: PatternKind.Equal, value: 'Identifier' },
            value: {
              kind: PatternKind.Variable,
              name: 'alias',
              pattern: { kind: PatternKind.String }
            }
          }
        },
        {
          kind: PatternKind.Object,
          keys: {
            type: { kind: PatternKind.Equal, value: 'Token' },
            value: { kind: PatternKind.Equal, value: ':' },
          }
        },
        {
          kind: PatternKind.Object,
          keys: {
            type: { kind: PatternKind.Equal, value: 'Identifier' },
            value: {
              kind: PatternKind.Variable,
              name: 'name',
              pattern: { kind: PatternKind.String }
            }
          }
        }
      ]
    },
    expression: {
      kind: ExpressionKind.Native,
      fn: ({ alias, name }) => ({
        kind: LangPatternKind.ObjectKeyPattern,
        alias,
        name,
      })
    }
  }
}
