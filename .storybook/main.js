module.exports = {
  stories: [
    '../src/**/*.mdx',
    "../src/**/*.stories.tsx"],

  // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-themes"
  ],

  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [["react-app", { flow: false, typescript: true }]],
      },
    });
    config.resolve.extensions.push(".ts", ".tsx");

    return config;
  },

  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },

  docs: {}
};
