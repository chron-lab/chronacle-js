"use strict";

var _ = require(".");

describe("testZooKeeperClient", () => {
  const zk = new _.ZooKeeperClient("localhost:2181");

  const deleteMockTree = async () => {
    await zk.delete("/x/y/y1/y11");
    await zk.delete("/x/y/y1/y12");
    await zk.delete("/x/y/y1");
    await zk.delete("/x/y/y2");
    await zk.delete("/x/y");
    await zk.delete("/x/z/z1");
    await zk.delete("/x/z/z2");
    await zk.delete("/x/z");
    await zk.delete("/x");
  };

  const createMockTree = async () => {
    await zk.create("/x");
    await zk.create("/x/y");
    await zk.create("/x/y/y1");
    await zk.create("/x/y/y1/y11");
    await zk.create("/x/y/y1/y12");
    await zk.create("/x/y/y2");
    await zk.create("/x/z");
    await zk.create("/x/z/z1");
    await zk.create("/x/z/z2");
  };

  it("should create recursive", async () => {
    await deleteMockTree();
    await zk.createAll("/x/y/y1");
    return zk.exists("/x/y/y1").should.eventually.equal(true);
  });
  it("should list tree", async () => {
    await deleteMockTree();
    await createMockTree();
    let tree = await zk.listTreePath("/x");
    console.log(tree);
    tree.length.should.equal(8);
    tree.includes("/x/y/y1/y11");
    tree.includes("/x/y/y1/y12");
    tree.includes("/x/y/y1");
    tree.includes("/x/y/y2");
    tree.includes("/x/y");
    tree.includes("/x/z/z1");
    tree.includes("/x/z/z2");
    tree.includes("/x/z");
  });
  it("should delete tree", async () => {
    await deleteMockTree();
    await createMockTree();
    await zk.deleteAll("/x");
    return zk.exists("/x").should.eventually.equal(false);
  }); // it("should delete recursive", async () => {
  //     const zk = new ZooKeeperClient("localhost:2181");
  //     await zk.delete("/a/b/c");
  //     await zk.delete("/a/b");
  //     await zk.delete("/a");
  //     await zk.create("/a");
  //     await zk.create("/a/b");
  //     await zk.create("/a/b/c");
  //     await zk.deleteAll("/a");
  //     return zk.exists("/a").should.eventually.equal(false);
  // });
  // it("should not contain undefined when creating empty node", async () => {
  //     const zk = new ZooKeeperClient("localhost:2181");
  //     await zk.delete("/a");
  //     await zk.create("/a");
  //     const a = await zk.get("/a");
  //     chai.should().equal(a, null);
  // });
  // it("should create or update using set", async () => {
  //     const zk = new ZooKeeperClient("localhost:2181");
  //     await zk.delete("/b");
  //     await zk.set("/b");
  //     let b = await zk.get("/b");
  //     chai.should().equal(b, null);
  //     await zk.set("/b", "b");
  //     b = await zk.get("/b");
  //     b.should.equal("b");
  // });
});