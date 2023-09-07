# Plain Rules Engine

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)

## Introduction

Plain Rules Engine is a TypeScript library for creating and evaluating simple business rules in Node.js
applications. It provides a flexible way to define and apply rules to your data.

## Features

- Easy rule creation and evaluation.
  Defining a rule in JSON is as simple as:

```
{
    "trackHasStrongLanguage": {
        "conditions": [
            ["$.user.age", "lessThan", 16],
            ["$.tags", "contains", "strong language"]
        ],
        "effect": {
            "action": "omit"
        }
    },
  ... other rules
}
```

You can also define rules in TypeScript:

```ts
export const musicSearchRules: Rule = {
  trackHasStrongLanguage: {
    conditions: [
      ['$.user.age', Operator.LESS_THAN, 16],
      ['$.tags', Operator.CONTAINS, 'strong language'],
    ],
    effect: {
      action: Action.OMIT,
    },
  },
  // Add more rules here
};
```

In this case, the effect defined for "trackHasStrongLanguage" will only be applied to objects that meet all conditions
in conditions array

- Customizable rule actions and conditions.
- Written in TypeScript for type safety.

## Installation

You can install Plain Rules Engine via npm:

```bash
npm install plain-rules-engine
```

## Usage

Here's an example of how to use Plain Rules Engine:

```ts
import {
  RuleEngine,
  type Rule,
  type ApplyRulesResponse,
} from 'plain-rules-engine';

// Define your rules (could be in a JSON file, TS file, an object store, in-memory database etc.). See example rule definition above

// Fetch your rules (you'll have to create the function that does that)
const musicSearchRules: Rule = fetchRulesFromDataSource();

// Instantiate the rule engine
const engine = new RuleEngine(musicSearchRules);

// Define your data
const tracks = [
  {
    title: 'Heal the World',
    artist: 'Michael Jackson',
    year: 1991,
    album: 'Dangerous',
    tags: ['pop', 'society'],
  },
  {
    title: 'The Girl From Last Night',
    artist: 'Jackson Pepper',
    year: 2017,
    album: 'Slot Machine',
    tags: ['rap', 'strong language'],
  },
];

const user = {
  user: {
    age: 14,
    lastLogin: '2023-08-26T16:00:45Z',
  },
};

// Apply the rules
const evaluation = engine.applyRules(tracks, user);

// Handle the results
console.log('RESULT: ', evaluation);
```

For more detailed documentation and examples, please refer to [Building a Rule Engine With TypeScript](https://benjamin-ayangbola.medium.com/building-a-rule-engine-with-typescript-1732d891385c)
— the article that inspired Plain Rules Engine.

## Contribution

We welcome contributions from the community. If you'd like to contribute to this project or have any questions, issues, or suggestions, please feel free to open an issue.

## License

This project is licensed under the [Apache-2.0 License](README.md).
