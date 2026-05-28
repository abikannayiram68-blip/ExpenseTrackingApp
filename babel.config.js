module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@context': './src/context',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@utils': './src/utils',
            '@constants': './src/constants',
            '@assets': './src/assets',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
