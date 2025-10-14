/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  distDir: "build",
  // Optional: Skip API routes that can't be statically generated
  // exportPathMap: async function () {
  //   return {
  //     "/": { page: "/" },
  //     "/quiz/math": { page: "/quiz/[subject]", params: { subject: "math" } },
  //     "/quiz/science": {
  //       page: "/quiz/[subject]",
  //       params: { subject: "science" },
  //     },
  //     "/quiz/bengali": {
  //       page: "/quiz/[subject]",
  //       params: { subject: "bengali" },
  //     },
  //     "/quiz/english": {
  //       page: "/quiz/[subject]",
  //       params: { subject: "english" },
  //     },
  //     "/quiz/computer": {
  //       page: "/quiz/[subject]",
  //       params: { subject: "computer" },
  //     },
  //   };
  // },
};

export default nextConfig;
