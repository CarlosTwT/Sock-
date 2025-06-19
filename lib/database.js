const fs = require("node:fs");
const path = require("node:path");

class Database {
  #data;
  constructor(filename) {
    this.databaseFile = path.join(".", filename);
    this.#data = {};
  }
  default = () => {
    return {
      user: {},
      group: {},
      changelog: {},
      settings: {
        self: false,
        online: false,
        anticall: false,
        blockcmd: [],
        max_upload: "100MB",
        resetlimit: "02:00",
      },
    };
  };
  init = async () => {
    const data = await this.read();
    this.#data = { ...this.#data, ...data };
    return this.#data;
  };
  read = async () => {
    if (fs.existsSync(this.databaseFile)) {
      const data = fs.readFileSync(this.databaseFile);
      return JSON.parse(data);
    } else {
      return this.default();
    }
  };

  save = async () => {
    const jsonData = JSON.stringify(this.#data, null, 2);
    fs.writeFileSync(this.databaseFile, jsonData);
  };
  add = async (type, id, newData) => {
    if (!this.#data[type]) return `- Tipe data ${type} no  encontrado!`;
    if (!this.#data[type][id]) {
      this.#data[type][id] = newData;
    }
    await this.save();
    return this.#data[type][id];
  };
  delete = async (type, id) => {
    if (this.#data[type] && this.#data[type][id]) {
      delete this.#data[type][id];
      await this.save();
      return `- ${type} con ID ${id} se ha elimminado.`;
    } else {
      return `- ${type} con ID ${id} no encontrado!`;
    }
  };
  get = (type, id) => {
    if (this.#data[type] && this.#data[type][id]) {
      return this.#data[type][id];
    } else {
      return `- ${type} con ID ${id} no encontrado!`;
    }
  };
  main = async (m) => {
    await this.read();
    if (m.isGroup) {
      await this.add("group", m.cht, {
        mute: false,
        sewa: {
          status: false,
          expired: 0,
        },
        message: 0,
        status: "not_announcement",
      });
    }
    await this.add("user", m.sender, {
      name: "No tengo nombre",
      limit: 100,
      register: false,
      premium: {
        status: false,
        expired: 0,
      },
      banned: {
        status: false,
        expired: 0,
      },
    });
    await this.save();
    return this.list();
  };
  list = () => {
    return this.#data;
  };
}

module.exports = Database;