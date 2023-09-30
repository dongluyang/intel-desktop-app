module.exports = {
  packagerConfig: {
    "extraResources": "./resources/rembg.exe",
    "icon": './src/images/icon'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
          // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
          iconUrl: 'https://url/to/icon.ico',
          // The ICO file to use as the icon for the generated Setup.exe
          setupIcon: './src/images/icon.ico'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],


  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'dongluyang',
          name: 'intel-desktop-app'
        },
        authToken:'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',
        prerelease: true
      }
    }
  ],


  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
        // If you are familiar with Vite configuration, it will look really familiar.
        build: [
          {
            // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
            entry: 'src/main.js',
            config: 'vite.main.config.mjs',
          },
          {
            entry: 'src/preload.js',
            config: 'vite.preload.config.mjs',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.mjs',
          },
        ],
      },
    },
  ],
};
