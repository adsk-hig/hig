const path = require("path");

module.exports = storybookBaseConfig => {
  // Ensure Babel transpiles story source in adjacent packages
  const babelRule = storybookBaseConfig.module.rules[0];
  babelRule.include = [path.resolve(__dirname, "../../../../packages")];

  storybookBaseConfig.module.rules.push(
    {
      test: /\.(scss|css)$/,
      loaders: ["style-loader", "css-loader", "sass-loader"]
    },
    {
      test: /\.svg$/,
      issuer: /\.js$/,
      loaders: [
        {
          loader: "babel-loader"
        },
        {
          loader: "@svgr/webpack"
        }
      ]
    },
    {
      test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
      loaders: [
        {
          loader: "file-loader",
          options: {
            name: "static/media/[name].[hash:8].[ext]"
          }
        }
      ]
    }
  );

  storybookBaseConfig.resolve.modules.push(
    path.resolve(__dirname, "../../../../packages")
  );

  return storybookBaseConfig;
};
