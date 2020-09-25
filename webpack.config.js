const path = require("path");

module.exports = {
  entry: { index: path.resolve(__dirname, "src", "main.js") },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'bundle.js'
  },
  
  mode: 'development',

  module: {
    rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ttf|woff|woff2|eot)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        }
      ]
}

};
