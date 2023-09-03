export enum Action {
  ADD = 'add',
  DECREMENT = 'decrement',
  INCREMENT = 'increment',
  OMIT = 'omit',
  OMIT_WITH_SILENT_ERROR = 'omit_with_silent_error',
  REPLACE = 'replace',
}

export enum Operator {
  CONTAINS = 'contains',
  EQUALS = 'equals',
  GREATER_THAN = 'greaterThan',
  GREATER_THAN_OR_EQUALS = 'greaterThanOrEquals',
  LESS_THAN = 'lessThan',
  LESS_THAN_OR_EQUALS = 'lessThanOrEquals',
}
