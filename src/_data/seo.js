import site from "./site.js";

const origin = new URL(site.baseUrl).origin;
const logo = origin + "/assets/images/brand/transworld-idiomas-logo.png";
const organization = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": origin + "/#tw-idiomas",
  name: site.name,
  alternateName: site.historicalName,
  url: origin + "/",
  logo,
  telephone: site.contact.phoneHref,
  email: site.contact.email,
  sameAs: [site.instagram, site.linkedin, site.facebook],
}).replaceAll("<", "\\u003c");

export default {
  origin,
  socialImage: origin + "/assets/images/brand/tw-idiomas-social.jpg",
  organization,
  allowIndexing: site.stage === "PUBLISHED" && process.env.TW_ENABLE_INDEXING === "1",
};
