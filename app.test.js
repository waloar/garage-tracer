import test from "node:test";
import assert from "node:assert/strict";

import { filterProperties, getFilterOptions, properties } from "./app.js";

test("getFilterOptions returns sorted unique localities and provinces", () => {
  const options = getFilterOptions(properties);

  assert.deepEqual(options.localities, [
    "Córdoba",
    "La Plata",
    "Luján de Cuyo",
    "Rosario",
    "San Carlos de Bariloche",
  ]);
  assert.deepEqual(options.provinces, [
    "Buenos Aires",
    "Córdoba",
    "Mendoza",
    "Río Negro",
    "Santa Fe",
  ]);
});

test("filterProperties matches prompt terms ignoring accents", () => {
  const results = filterProperties(properties, {
    prompt: "reciclado cordoba",
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].title, "PH reciclado en zona residencial");
});

test("filterProperties combines locality, province and price range", () => {
  const results = filterProperties(properties, {
    locality: "Rosario",
    province: "Santa Fe",
    minimumPrice: 150000,
    maximumPrice: 190000,
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].title, "Casa familiar con patio y cochera");
});

test("filterProperties returns no results when filters exclude every property", () => {
  const results = filterProperties(properties, {
    province: "Mendoza",
    maximumPrice: 100000,
  });

  assert.equal(results.length, 0);
});
