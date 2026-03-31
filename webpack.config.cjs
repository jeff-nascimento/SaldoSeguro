/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // Define o modo de desenvolvimento para builds mais rápidos e source-maps detalhados
  mode: 'development',

  // Ponto de entrada principal do seu projeto TypeScript
  entry: path.resolve(__dirname, 'src/index.ts'),

  module: {
    rules: [
      // Regra para arquivos TypeScript (.ts ou .tsx)
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // Ganha performance ao não validar tipos durante o build (o ForkTsChecker faz isso em paralelo)
              transpileOnly: true,
            },
          },
        ],
      },

      // Regra para arquivos CSS
      {
        test: /\.css$/,
        // MiniCssExtractPlugin extrai o CSS para arquivos .css separados
        // css-loader interpreta os imports de CSS dentro do seu código TS/JS
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },

      // Regra para imagens e assets
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name][ext]',
        },
      },

      // Regra para processar o HTML (útil para carregar imagens direto do .html)
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },

  resolve: {
    // Permite importar arquivos sem precisar colocar a extensão .ts ou .js
    extensions: ['.tsx', '.ts', '.js'],
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // Limpa a pasta 'dist' antes de cada novo build
    clean: true,
  },

  plugins: [
    // Gera o index.html na pasta dist injetando automaticamente os scripts e links de CSS
    new HtmlWebpackPlugin({
      title: 'TypeScript Híbrido',
      template: './src/index.html',
    }),

    // Plugin que faz a extração real do CSS para um arquivo separado
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),

    // Executa a checagem de tipos do TypeScript em um processo separado (melhora a velocidade)
    new ForkTsCheckerWebpackPlugin(),
  ],

  // Facilita o debug mostrando o código original no console do navegador
  devtool: 'source-map',

  // Configuração do servidor de desenvolvimento (npm run dev)
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    open: true, // Abre o navegador automaticamente
    hot: true, // Habilita Hot Module Replacement
    historyApiFallback: true,
  },
};
