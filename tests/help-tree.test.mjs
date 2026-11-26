import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { loadModule } from "./helpers/load-module.mjs";

const { ngoHelpTree, coordinatorHelpTree, findHelpPath } = loadModule("src/components/Dashboard/Help/help-tree.ts");

const locales = ["de", "en"].map((lang) => ({
  lang,
  help: JSON.parse(readFileSync(`public/locales/${lang}/translations.json`, "utf8")).dashboard.help,
}));

const flatten = (tree) => tree.flatMap((node) => [node, ...flatten(node.children ?? [])]);

for (const [name, tree] of [
  ["ngo", ngoHelpTree],
  ["coordinator", coordinatorHelpTree],
]) {
  const nodes = flatten(tree);
  const ids = new Set(nodes.map(({ id }) => id));

  test(`${name} help tree has unique ids`, () => {
    assert.equal(ids.size, nodes.length);
  });

  test(`${name} related links stay inside the tree`, () => {
    for (const node of nodes) for (const id of node.related ?? []) assert.ok(ids.has(id), `${node.id} -> ${id}`);
  });

  for (const { lang, help } of locales) {
    test(`${name} help tree is fully translated in ${lang}`, () => {
      for (const node of nodes) {
        const entry = help.nodes[node.id];
        assert.ok(entry?.title, `${lang} title for ${node.id}`);
        if (!node.children) assert.ok(entry.blocks?.length, `${lang} blocks for ${node.id}`);
      }
    });
  }
}

test("de and en answers have the same shape", () => {
  const [de, en] = locales.map(({ help }) => help.nodes);
  assert.deepEqual(Object.keys(de).sort(), Object.keys(en).sort());
  for (const id of Object.keys(de)) {
    const shape = (blocks = []) => blocks.map((block) => Object.entries(block).map(([k, v]) => [k, [v].flat().length]));
    assert.deepEqual(shape(de[id].blocks), shape(en[id].blocks), id);
  }
});

test("findHelpPath returns the path from the root to the node", () => {
  assert.deepEqual(
    findHelpPath(ngoHelpTree, "ngoCreateDuplicate").map(({ id }) => id),
    ["ngoCreate", "ngoCreateDuplicate"],
  );
  assert.deepEqual(findHelpPath(ngoHelpTree, "coordProcess"), []);
  assert.deepEqual(findHelpPath(ngoHelpTree, null), []);
});
