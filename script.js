import {
  filterProperties,
  formatPrice,
  getFilterOptions,
  properties,
} from "./app.js";

const form = document.querySelector("#search-form");
const promptField = document.querySelector("#prompt");
const localityField = document.querySelector("#localidad");
const provinceField = document.querySelector("#provincia");
const minimumPriceField = document.querySelector("#precio-min");
const maximumPriceField = document.querySelector("#precio-max");
const resultsGrid = document.querySelector("#results-grid");
const resultsSummary = document.querySelector("#results-summary");

const populateSelect = (select, values) => {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
};

const renderResults = (listings) => {
  resultsSummary.textContent = `${listings.length} propiedad${listings.length === 1 ? "" : "es"} encontrada${listings.length === 1 ? "" : "s"}`;
  resultsGrid.replaceChildren();

  if (!listings.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent =
      "No encontramos propiedades con esos filtros. Prueba con otros criterios.";
    resultsGrid.append(emptyState);
    return;
  }

  const cards = listings.map((property) => {
    const article = document.createElement("article");
    article.className = "property-card";

    const copy = document.createElement("div");
    copy.className = "property-copy";

    const title = document.createElement("h3");
    title.textContent = property.title;

    const location = document.createElement("p");
    location.className = "property-location";
    location.textContent = `${property.zone} · ${property.locality}, ${property.province}`;

    const description = document.createElement("p");
    description.textContent = property.description;

    copy.append(title, location, description);

    const aside = document.createElement("div");
    aside.className = "property-aside";

    const price = document.createElement("p");
    price.className = "property-price";
    price.textContent = formatPrice(property.price);

    const image = document.createElement("img");
    image.className = "property-image";
    image.src = property.thumbnail;
    image.alt = property.title;
    image.loading = "lazy";

    aside.append(price, image);
    article.append(copy, aside);

    return article;
  });

  resultsGrid.append(...cards);
};

const syncFilters = () => {
  const filtered = filterProperties(properties, {
    prompt: promptField.value,
    locality: localityField.value,
    province: provinceField.value,
    minimumPrice: minimumPriceField.value,
    maximumPrice: maximumPriceField.value,
  });

  renderResults(filtered);
};

const { localities, provinces } = getFilterOptions(properties);
populateSelect(localityField, localities);
populateSelect(provinceField, provinces);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  syncFilters();
});

form.addEventListener("input", syncFilters);

syncFilters();
