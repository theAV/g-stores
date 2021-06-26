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
        // extraResources: ["src/datastore/db.js"],
      },
    },
  },
};
