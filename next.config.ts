import { NextConfig } from "next";

const config: NextConfig = {
  webpack: (config) => {
    config.resolve.alias["~"] = __dirname;
    return config;
  },
};

export default config;
