const webpack = require( 'webpack' )
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const PROJECT_ROOT = require( 'path' ).resolve( __dirname );

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: './dist/',
    filename: '[name].js',
    library: 'conso',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: [ '', '.js', '.vue' ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.css$/,
        loader: 'style!less!css'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: `${ PROJECT_ROOT }/examples/demo.html`,
      inject: 'head'
    }),
    new webpack.optimize.UglifyJsPlugin( {
      minimize : true,
      sourceMap : false,
      mangle: true,
      compress: {
        warnings: false
      }
    } )
  ]
}
