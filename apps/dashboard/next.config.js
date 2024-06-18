/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.BASE_PATH ?? "/__dev__",
    experimental: {
        // reactCompiler: true,
        // ppr: true,
    },
};

export default nextConfig;
