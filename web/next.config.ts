import type { NextConfig } from "next";
// @ts-expect-error srfs
import withWorkbox from "next-with-workbox";

const nextConfig: NextConfig = {
    output: 'export',
};

export default withWorkbox({
    workbox: {
        dest: "public",
        swDest: "sw.js",
        swSrc: "worker.ts",
        force: true,
    },
    ...nextConfig,
})
