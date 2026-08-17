export const properties = [
  {
    id: 1,
    title: "Casa familiar con patio y cochera",
    zone: "Barrio Norte",
    locality: "Rosario",
    province: "Santa Fe",
    description:
      "Propiedad de 3 dormitorios con patio verde, cochera cubierta y rápida conexión al centro.",
    price: 185000,
    thumbnail:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: 2,
    title: "Departamento luminoso cerca del río",
    zone: "Puerto Norte",
    locality: "Rosario",
    province: "Santa Fe",
    description:
      "Unidad de 2 ambientes con balcón, amenities y vista despejada en una zona moderna.",
    price: 142000,
    thumbnail:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: 3,
    title: "PH reciclado en zona residencial",
    zone: "Güemes",
    locality: "Córdoba",
    province: "Córdoba",
    description:
      "PH con cocina integrada, patio propio y terminaciones renovadas a pocas cuadras del polo gastronómico.",
    price: 126000,
    thumbnail:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: 4,
    title: "Casa moderna con jardín y parrilla",
    zone: "Chacras de Coria",
    locality: "Luján de Cuyo",
    province: "Mendoza",
    description:
      "Casa de diseño contemporáneo con galería, jardín amplio y espacio para reuniones familiares.",
    price: 268000,
    thumbnail:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: 5,
    title: "Dúplex con terraza y home office",
    zone: "Centro",
    locality: "La Plata",
    province: "Buenos Aires",
    description:
      "Dúplex de 4 ambientes con terraza privada, escritorio independiente y buena conectividad.",
    price: 198000,
    thumbnail:
      "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=320&q=80",
  },
  {
    id: 6,
    title: "Cabaña de montaña para inversión",
    zone: "Villa Catedral",
    locality: "San Carlos de Bariloche",
    province: "Río Negro",
    description:
      "Propiedad ideal para renta turística con vista a la montaña y equipamiento completo.",
    price: 221000,
    thumbnail:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=320&q=80",
  },
];

const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

const matchesPrompt = (property, prompt) => {
  const normalizedPrompt = normalizeText(prompt);

  if (!normalizedPrompt) {
    return true;
  }

  const searchableText = normalizeText(
    [
      property.title,
      property.zone,
      property.locality,
      property.province,
      property.description,
    ].join(" "),
  );

  return normalizedPrompt
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => searchableText.includes(term));
};

export function getFilterOptions(listings) {
  return {
    localities: [...new Set(listings.map((property) => property.locality))].sort(
      (left, right) => left.localeCompare(right, "es"),
    ),
    provinces: [...new Set(listings.map((property) => property.province))].sort(
      (left, right) => left.localeCompare(right, "es"),
    ),
  };
}

export function filterProperties(listings, filters = {}) {
  const prompt = filters.prompt ?? "";
  const locality = filters.locality ?? "";
  const province = filters.province ?? "";
  const minimumPrice =
    filters.minimumPrice === "" || filters.minimumPrice == null
      ? null
      : Number(filters.minimumPrice);
  const maximumPrice =
    filters.maximumPrice === "" || filters.maximumPrice == null
      ? null
      : Number(filters.maximumPrice);

  return listings.filter((property) => {
    const matchesLocality = !locality || property.locality === locality;
    const matchesProvince = !province || property.province === province;
    const matchesMinimumPrice =
      minimumPrice == null || property.price >= minimumPrice;
    const matchesMaximumPrice =
      maximumPrice == null || property.price <= maximumPrice;

    return (
      matchesPrompt(property, prompt) &&
      matchesLocality &&
      matchesProvince &&
      matchesMinimumPrice &&
      matchesMaximumPrice
    );
  });
}

export function formatPrice(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
