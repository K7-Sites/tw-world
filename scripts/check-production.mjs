import { readFileSync, readdirSync } from "node:fs";
import seo from "../src/_data/seo.js";

const files = readdirSync("src/pages").filter((file) => file.endsWith(".njk"));
const all = files.map((file) => readFileSync(`src/pages/${file}`, "utf8")).join("\n");
if (/\[(?:VALIDAR|PENDENTE)\b/i.test(all)) {
  console.error("Bloqueio: existem conteúdos pendentes nas páginas. Produção não autorizada.");
  process.exit(1);
}
if (!seo.allowIndexing) {
  console.error("Bloqueio: etapa de rascunho ativa ou indexação não habilitada para o build.");
  process.exit(1);
}
console.log("Verificação editorial preliminar aprovada; ainda é necessária aprovação humana.");
