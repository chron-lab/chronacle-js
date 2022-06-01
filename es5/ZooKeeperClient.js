"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const ZooKeeper = require("zookeeper");

require("dotenv").config();

class ZooKeeperClient {
  constructor(connectionString) {
    this.zkConnection = connectionString;

    if (!this.zkConnection) {
      this.zkConnection = process.env.CHRONNET_ZookeeperConfig__Connection;
    }

    const timeoutMs = 10000;
    this.zkConfig = {
      connect: this.zkConnection,
      timeout: timeoutMs,
      //debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
      host_order_deterministic: false
    };
    this.zkClient = new ZooKeeper(this.zkConfig);
    this.connected = false;
    this.zkClient.on("connect", async () => {
      this.connected = true;
    });
    this.zkClient.on("error", async err => {
      console.error(err);
      zkClient.close();
    });
    this.zkClient.init();
  }

  connect = (options, cb) => {
    return this.zkClient.connect(options, cb);
  };
  /*
   *  createAll - create at path and include parents if doesn't exist
   */

  createAll = async (path, data, flags) => {
    if (path[0] != "/") path = path + "/";
    let index = 0;

    while (index < path.length && index >= 0) {
      let indexOf = path.indexOf("/", index + 1);
      let before = path.substring(0, indexOf);
      index = indexOf;
      if ((before == null ? void 0 : before.length) > 0 && (await this.exists(before)) === false) await this.zkClient.create(before);
    }

    if (index < path.length) await this.create(path, data, flags);
  };
  /*
   *  create - create at path
   */

  create = async (path, data, flags) => {
    try {
      if ((await this.exists(path)) == false) {
        if (typeof data === "undefined") data = null;
        return await this.zkClient.create(path, data, flags);
      }
    } catch (error) {
      console.error(`create:${path}`, error);
    }
  };
  /*
   *  deleteAll - delete at path and the line under path
   */

  deleteAll = async parentPath => {
    try {
      let tree = await this.listTreePath(parentPath);

      for (let c in tree) {
        const child = tree[c];
        await this.delete(child);
      }

      await this.delete(parentPath);
    } catch (error) {
      console.error(`deleteAll:${parentPath}`, error);
    }
  };
  /*
   *  delete - delete at path
   */

  delete = async (path, version) => {
    try {
      if (await this.exists(path)) {
        if (typeof version === "undefined") version = -1;
        return await this.zkClient.delete_(path, version);
      }
    } catch (error) {
      console.error(`delete:${path}`, error);
    }
  };
  /*
   *  exists - return true if path exists
   */

  exists = async path => {
    return await this.zkClient.pathExists(path);
  };
  /*
   *  get - return data as string or JSON from path
   */

  get = async path => {
    try {
      if (await this.zkClient.get(path)) {
        var data = await this.zkClient.get(path);
        var result = data[1];

        try {
          result = JSON.parse(result);
          return result;
        } catch {}

        return result.toString();
      }
    } catch (error) {
      console.error(`get:${path}`, error);
    }
  };
  /*
   *  listChildren - List children node only
   */

  listChildren = async parentPath => {
    try {
      if (await this.exists(parentPath)) return await this.zkClient.get_children(parentPath);
    } catch (error) {
      console.error(error);
    }
  };
  /*
   *  listChildrenPath - List children full paths
   */

  listChildrenPath = async parentPath => {
    try {
      if (await this.exists(parentPath)) {
        var children = await this.zkClient.get_children(parentPath);
        return children.map(child => parentPath + "/" + child);
      }
    } catch (error) {
      console.error(error);
    }
  };
  /*
   *  listSortedChildrenPath - List children full paths sorted ascending order by sequence number
   */

  listSortedChildrenPath = async parentPath => {
    try {
      const children = await this.listChildrenPath(parentPath);
      return children == null ? void 0 : children.sort((a, b) => parseInt(a.substring(a.length - 10)) - parseInt(b.substring(b.length - 10)));
    } catch (error) {
      console.error(error);
    }
  };
  /*
   *  listTreePath - List full path of all generations under path
   */

  listTreePath = async parentPath => {
    try {
      if ((await this.exists(parentPath)) === false) {
        return;
      }

      let generation = [];
      let children = await this.listChildrenPath(parentPath);

      for (let i in children) {
        const child = children[i];
        let tree = await this.listTreePath(child);
        if (tree) generation.push(...tree);
        generation.push(child);
      }

      return generation;
    } catch (error) {
      console.error(error);
    }
  };
  /*
   *  set - Upsert data
   */

  set = async (path, data, ver) => {
    try {
      if (typeof data === "undefined") data = null;

      if (await this.exists(path)) {
        this.zkClient.set(path, data, ver);
        return;
      }

      this.zkClient.create(path, data);
    } catch (error) {
      console.error(`set:${path}`, error);
    }
  };
  version = async path => {
    try {
      let stat = await this.zkClient.exists(path);
      return stat.version;
    } catch (error) {
      console.error(`create:${path}`, error);
    }
  };
  watchNode = async (path, cb) => {
    try {
      await this.zkClient.w_exists(path, cb);
    } catch (error) {
      console.error(error);
    }
  };
  watchChildren = async (parentPath, cb) => {
    try {
      await this.zkClient.w_get_children(parentPath, cb);
    } catch (error) {
      console.error(error);
    }
  };
}

var _default = ZooKeeperClient;
exports.default = _default;
module.exports = exports.default;