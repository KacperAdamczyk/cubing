let basePath;
if (process.env.NODE_ENV === "development") {
  basePath = process.env.BASE_PATH ?? "/__dev__";
}
if (process.env.NODE_ENV === "production") {
  basePath = process.env.BASE_PATH;
}

console.info(`Base path: ${basePath}`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
};

export default nextConfig;
