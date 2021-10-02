"use strict";

const Store = require("electron-store");

class DataStore extends Store {
  constructor(settings) {
    super(settings);
    this.userPreference =
      this.get("user_preferences") || JSON.stringify([{ test: "data" }]);
  }
  saveItems() {
    this.set("user_preferences", this.userPreference);
    return this;
  }
  getItems() {
    return (this.userPreference = this.get("user_preferences") || JSON.stringify([{ test: "data" }]));
  }
  deleteItem() {
    this.delete("user_preferences");
    return this;
  }
}

module.exports = DataStore;
