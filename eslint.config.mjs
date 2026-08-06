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
