export default {
  kind: "module",
  imports: [],
  exports: [],
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
