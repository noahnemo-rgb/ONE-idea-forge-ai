import assert from "node:assert/strict";
import test from "node:test";
import { isIdealabCatalog, parseBlueOcean, readSourceUrl } from "./idealabSeed.js";

test("a full Idealab page link is kept", () => {
  const url = readSourceUrl("https://idealab.ai/ideas/living-legacy");
  assert.equal(url, "https://idealab.ai/ideas/living-legacy");
  assert.equal(isIdealabCatalog(url), true);
});

test("script and login links are dropped", () => {
  assert.equal(readSourceUrl("javascript:alert(1)"), "");
  assert.equal(readSourceUrl("https://user:pass@idealab.ai/x"), "");
  assert.equal(isIdealabCatalog("https://example.com/idea"), false);
});

test("a dive needs exactly three named wedges", () => {
  const niches = parseBlueOcean(
    JSON.stringify({
      niches: [
        { name: "Shop hours", wedge: "Evening repair", why_open: "Shops close at 5", citations: ["https://idealab.ai/ideas/a"] },
        { name: "Tool library", wedge: "Borrow, do not buy", why_open: "Storage is the cost", citations: ["notaurl"] },
        { name: "Repair notes", wedge: "One page per tool", why_open: "Owners forget settings", citations: [] },
      ],
    }),
  );
  assert.equal(niches.length, 3);
  assert.deepEqual(niches[0].citations, ["https://idealab.ai/ideas/a"]);
  assert.deepEqual(niches[1].citations, []);
  assert.equal(parseBlueOcean('{"niches":[{"name":"Only one","wedge":"No"}]}'), null);
});
