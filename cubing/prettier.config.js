/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-astro"],
  tailwindFunctions: ["cn"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};

export default config;
