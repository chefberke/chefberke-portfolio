import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Naming a key beside a `...rest` is how you take that key *out* of the rest,
  // so the name is doing its job precisely by not being read again. The rule
  // ships with this off, which makes the one pattern React has for dropping a
  // prop before it reaches the DOM report as dead code -- see the `node` that
  // components/post/PostBody.tsx takes out of every element it spreads.
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreRestSiblings: true },
      ],
    },
  },
  // Colors belong in lib/tokens.ts. A raw hex anywhere else -- including a
  // Tailwind arbitrary value such as text-[#fff] -- defeats the point of
  // having a single palette to edit.
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["lib/tokens.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-fA-F])/]",
          message:
            "No raw hex colors. Import a token from lib/tokens.ts, or use a semantic class such as text-primary / bg-surface.",
        },
      ],
    },
  },
]);

export default eslintConfig;
