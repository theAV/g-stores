module.exports = {
  lintOnSave: false,
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    externals: {
      sequelize: "require('sequelize')",
      mysql: "require('mysql2')",
    },
  },
  pluginOptions: {
    electronBuilder: {
      externals: ["sequelize", "mysql2"],
      nodeIntegration: true,
      builderOptions: {
        productName: "G Stores",
        appId: "com.glazelabs.gstores",
        copyright: "Copyright © 2021 GlazeLabs",
        win: {
          target: ["nsis"],
          icon: "build/icon.ico",
        },
        nsis: {
          installerIcon: "build/icon.ico",
          uninstallerIcon: "build/icon.ico",
          uninstallDisplayName: "G Stores Uninstall",
        },
      },
      publish: ["github"],
    },
  },
};
