const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.resolver.alias = {
  ...(config.resolver.alias ?? {}),
  "@app": path.resolve(projectRoot, "src/app"),
  "@features": path.resolve(projectRoot, "src/features"),
  "@shared": path.resolve(projectRoot, "src/shared"),
};

module.exports = config;
