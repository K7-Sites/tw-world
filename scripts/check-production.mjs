import { readFileSync, readdirSync } from "node:fs";
const files=readdirSync("src/pages").filter(file=>file.endsWith(".njk"));
const all=files.map(file=>readFileSync(`src/pages/${file}`,"utf8")).join("\n");
if (/\[(?:VALIDAR|PENDENTE):|\[VALIDAR\b|\[PENDENTE\b/i.test(all)) {
 console.error("Bloqueio: existem conteúdos pendentes nas páginas. Produção não autorizada.");
 process.exit(1);
}
if(readFileSync("src/_includes/layouts/base.njk","utf8").includes("noindex,nofollow")) {
 console.error("Bloqueio: marcação de rascunho/noindex ainda ativa.");
 process.exit(1);
}
console.log("Verificação editorial preliminar aprovada; ainda é necessária aprovação humana.");
