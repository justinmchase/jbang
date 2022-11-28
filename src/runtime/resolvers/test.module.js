export default {
  kind: "module",
  imports: [],
  rules: [
    {
      kind: "rule",
      name: "A",
      pattern: {
        kind: "range",
        left: "0",
        right: "9",
      },
    },
    {
      kind: "rule",
      name: "B",
      pattern: {
        kind: "slice",
        pattern: {
          kind: "reference",
          name: "A",
        },
      },
    },
  ],
};
