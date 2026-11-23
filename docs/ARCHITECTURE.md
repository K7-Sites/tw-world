# TW Idiomas — Arquitetura Técnica

**Versão:** 1.0.0 (planejamento)  
**Data:** 2026-11-14  
**Projeto:** Novo site TW Idiomas / Transworld Idiomas  
**Responsável pela implementação:** K7 Sites  
**Status:** arquitetura proposta; implementação ainda não iniciada

## 1. Objetivo e limites

Construir do zero um site institucional multipágina, responsivo, acessível e otimizado para SEO e conversão, seguindo o Caderno de Implementação Digital e o Caderno de Produção Audiovisual entregues pela TW. O site será desenvolvido em HTML5, CSS3/Tailwind CSS e JavaScript nativo, com componentes gerados em tempo de build. A etapa atual **não inclui desenvolvimento de CRM**; somente preparação de um contrato de entrada de leads para integração futura.

### Escopo da fase 1
- Home; A TW / A Escola; Inglês; Francês; Espanhol; Experiência TW; Onde Estamos; Blog; Contato.
- Versões desktop e mobile; captação de contatos; SEO e analytics; mídia otimizada; monitoramento e documentação.
- Blog inicialmente estático (Markdown), com possibilidade de CMS posteriormente, **dependendo de decisão da TW**.
- Formulários com endpoint serverless seguro, mecanismo de registro/notificação a escolher antes da implementação.

### Fora do escopo
- CRM, painel acadêmico, gestão de alunos, automações comerciais complexas, pagamentos, matrícula digital transacional ou integração com ferramentas sem autorização.
- Produção de fotos ou vídeos; o Caderno Audiovisual descreve entregáveis esperados de produtor externo.

## 2. Fontes e regra de precedência
1. Aprovações recentes da direção TW/Janaína — **decisões de negócio e identidade**.
2. `Novo site - Desenvolvedor.docx` — caderno de implementação digital.
3. `Novo site- Produtor Visual.docx` — caderno audiovisual.
4. Manual de marca e assets oficiais, quando entregues.
5. Conteúdo atual de https://transworld.com.br/ — **referência legada, não aprovação automática para republicação**.
6. Instagram https://www.instagram.com/transworldidiomas/ — canal oficial informado pela cliente; dados mutáveis devem ser revalidados.

Em caso de divergência, registrar a decisão e solicitar aprovação; **não corrigir a copy nem alterar fatos institucionais por conta própria**.

## 3. Identidade e dados

### Tokens da marca confirmados pelo cliente
- Verde principal: `#78AC1C`
- Roxo secundário: `#8717C3`
- Off-white, cinzas, grafite e fontes: **a definir segundo o manual de marca**, não tratar exemplos de protótipo como oficiais.
- Evitar fundos inteiros verdes ou roxos; usar base clara, bastante respiro e fotografia real.
- As variantes de contraste (hover, active, texto, focus) deverão ser derivadas e testadas para WCAG 2.2 AA; não usar branco em texto pequeno sobre verde principal sem verificar contraste.

### Dados publicamente encontrados no site anterior — validar antes de publicar
- Telefone: `(81) 3302-6120`; e-mail: `falecom@transworld.com.br`.
- Endereço: Av. Conde da Boa Vista, 1460, Boa Vista, Recife/PE.
- O site antigo também cita Olinda e outros núcleos, mas o novo briefing prioriza **Boa Vista — Unidade Central** e **CIC — Núcleo Educacional**.
- Idiomas: inglês, francês e espanhol.
- O Instagram informado pela cliente é `@transworldidiomas`.
- Contagens de posts/seguidores e biografia de Instagram são temporárias: não inserir como números permanentes no site.

## 4. Stack e decisões arquiteturais
| Camada | Solução | Motivo |
|---|---|---|
| Marcação | HTML5 semântico | Rastreabilidade, acessibilidade, conteúdo sem JS |
| Layout / estilo | Tailwind CSS 4 compilado + CSS de componentes | Identidade própria, tokens centralizados |
| Scripts | JavaScript ES Modules, sem framework SPA | Menos runtime e manutenção direta |
| Geração de páginas | Eleventy (11ty) + Nunjucks | HTML estático, includes/macros/layouts reutilizáveis |
| Blog | Markdown + Eleventy collections | Conteúdo gerado em HTML |
| Ícones | Lucide, importação seletiva ou SVG local | Evitar payload global desnecessário |
| Testes | Vitest (lógica) + Playwright (E2E) + axe | Qualidade funcional e acessibilidade |
| Padronização | ESLint + Prettier | Convenções reproduzíveis |
| Hospedagem | Vercel | Previews, homologação e produção |
| API de leads | Função serverless com validação de servidor | Evitar segredos no front-end |
| Integração CRM | Adapter/contrato desacoplado (fase 2) | Evoluir sem reescrever UI |

**Nota de implementação:** Eleventy gera HTML; Tailwind CLI gera CSS. Definir scripts reais de build e deploy após inicializar o repositório. Não incluir Vite automaticamente se não houver necessidade justificada.

## 5. Estrutura de pastas alvo
```text
tw-idiomas/
├── src/
│   ├── _data/                    # configurações, navegação e conteúdo validado
│   ├── _includes/
│   │   ├── layouts/              # base, interna, artigo
│   │   ├── components/           # header, footer, button, form, card, FAQ
│   │   └── sections/             # hero, journeys, testimonials, final-cta
│   ├── pages/                    # templates das páginas institucionais
│   ├── blog/                     # Markdown dos artigos
│   ├── styles/                   # main.css, tokens/theme, componentes
│   └── scripts/                  # navegação, formulários, vídeo, analytics
├── public/                       # imagens, vídeos, fontes, favicons
├── api/                          # endpoint serverless de leads
├── tests/                        # unitários, E2E, acessibilidade
├── docs/                         # arquitetura, decisões, conteúdo, SEO, deploy
├── AGENTS.md                     # regras para IA e contribuintes
├── eleventy.config.js
├── package.json
├── .gitignore
└── README.md
```
O diretório final de build poderá ser `_site/`; deve ser ignorado no Git. Os includes não são rotas públicas. URLs finais serão definidos após inventário/redirects.

## 6. Camadas e responsabilidades
- **Content/data:** fatos, CTA, canais, cursos e unidades mantidos em configuração central; distinguir `approved`, `legacy`, `pending`.
- **Templates/layouts:** HTML semântico com herança Nunjucks. Não construir conteúdo essencial no cliente via JS.
- **UI components:** botões, cards, navegação, campos, FAQ; aceitar props explícitas, defaults seguros; uso sem duplicação.
- **Page sections:** seções compostas de componentes, com diferenças editoriais por página.
- **JavaScript:** aprimoramento progressivo (navegação, validação amigável, mídia), módulos sem efeitos globais desnecessários.
- **Lead service:** endpoint com validação real, antispam, proteção contra reenvio, registro/notificação e logs sem PII excessiva; preparado para adapter de CRM.
- **SEO:** templates com title/description/H1/canonical/OG; sitemap, robots, schema apenas quando válido; migração 301.

## 7. Navegação e conteúdo aprovado
Páginas: Home; A TW; Inglês; Francês; Espanhol; Experiência TW; Onde Estamos; Blog; Contato.

Home na sequência especificada pela TW:
1. Hero: H1 **“Idiomas para aprender de verdade.”**, subtítulo **“Inglês, francês e espanhol, a partir dos 4 anos.”**; CTAs **ENCONTRE SEU CURSO** / **CONHEÇA A TW**.
2. História: explicar continuidade Transworld Idiomas → TW Idiomas.
3. Além da aula: acompanhamento, prática, experiências e suporte.
4. Jornadas: Little Kids, Magic Kids, Super Teens e Fluency.
5. Certificações: Magic Kids prepara para **TOEFL Primary®**; Super Teens para **TOEFL Junior®**, sem certificação automática.
6. Vídeo-convite da direção (Janaína), sem autoplay com áudio, com legenda e transcrição.
7. Experiência TW: TRAIL, Study Lab e diferenciais validados.
8. Intercâmbio: acesso/facilitação via parcerias internacionais; bloco secundário.
9. Onde estamos: Boa Vista — Unidade Central; CIC — Núcleo Educacional.
10. Depoimentos reais/autorizados e CTA final.

### Guardrails editoriais
- Não publicar `CONNECT` nem nomes de livros didáticos.
- Usar `TRAIL` na grafia oficial e `teacher` nas comunicações.
- Nunca prometer aprovação ou emissão automática de certificações.
- Não criar páginas finas por palavras-chave nem copiar textos antigos indiscriminadamente.
- `VALIDAR` implica **bloqueio de publicação**.

## 8. Mídia e direitos de imagem
Conforme caderno de audiovisual:
- 45 fotos finais (F01–F45) com originais e versões web; usar cena F01 no hero se adequado.
- Vídeo hero **6–12 s**, mudo, horizontal e vertical, com poster.
- Vídeo-convite da Janaína **30–40 s**, 16:9 com legenda/transcrição; versão vertical/corte curto só se contratado.
- B-roll BR01–BR10; arquivos nomeados/organizados.
- Não expor nomes, notas, listas, telas ou dados pessoais; guardar autorizações de uso, sobretudo de menores.
- Nunca presumir autorização de imagem a partir de arquivo disponível.
- Responsive images (`picture`, `srcset`, `sizes`), dimensões explícitas, WebP/AVIF quando adequado, poster de vídeo; não lazy-load do visual LCP.

## 9. SEO, acessibilidade e desempenho
- HTML `lang="pt-BR"`, landmark semântico, heading hierarchy, labels e links descritivos.
- Navegação por teclado, foco visível, controle por Escape, contraste, `prefers-reduced-motion` e WCAG 2.2 AA como meta.
- Titles, metas e H1 únicos; Open Graph, canonical, sitemap, robots, 301, 404 e 410 quando aplicável.
- Schema de `EducationalOrganization`/`Organization`, `Course`, `Article`, `BreadcrumbList` onde houver conteúdo real e aplicabilidade; sem prometer rich results.
- GA4/GSC e eventos de conversão; configurar de acordo com consentimento e política LGPD.
- Metas CWV p75: LCP ≤ 2,5 s; INP ≤ 200 ms; CLS ≤ 0,1. Validar em mobile real e laboratório.
- Layout testado incluindo 320, 375, 390, 768, 1024, 1440 px e larguras intermediárias.

## 10. Formulário e preparação para CRM
Campos **propostos**, sujeitos à aprovação: nome, WhatsApp, email opcional, idioma, jornada, unidade, origem/UTM, referência de consentimento quando aplicável.
- `POST` para endpoint no servidor; validação cliente + servidor e limites de tamanho.
- Anti-bot e rate limits; proteger segredos com variáveis de ambiente.
- Desabilitar envio durante requisição e implementar chave idempotente no servidor para evitar duplicidade real.
- Não afirmar que a submissão deu certo antes de obter confirmação.
- Destino de leads, armazenamento, retenção, política de privacidade e notificação **pendentes de definição**.
- Planejar `LeadRepository`/`LeadNotifier`/`CrmAdapter` como interfaces conceituais; não construir integração CRM na fase 1.

## 11. Publicação, controle de versão e rollback
- `feature/*` → PR → `develop` (homologação) → PR aprovado → `main` (produção).
- Proteger `main`, exigir verificações automatizadas e revisão; sem push direto e sem deploy não autorizado.
- Homologação: URL de preview, `noindex` e/ou controle de acesso; garantir que ela não entre no sitemap público.
- Antes do cutover: inventariar URLs atuais, registrar redirects, validar DNS, backup, SSL e plano de rollback.
- Depois do cutover: conferir 301/404, sitemap/GSC, eventos, formulários, métricas e erros.

## 12. Fases e critérios de aceite
1. **Discovery**: inventário de URLs, dados confirmados x legados, recebimento de manual/assets.
2. **Design system**: tokens, wireframe mobile+desktop e Home aprovada.
3. **Scaffold**: Eleventy + Tailwind + scripts + testes + pipeline de homologação.
4. **Home**: dez seções previstas, copy aprovada, acessibilidade e responsividade.
5. **Internas e blog**: conteúdo indexável, componentes compartilhados.
6. **Form/SEO/analytics**: dados seguros, rastreamento consentido, redirects validados.
7. **QA**: Playwright, acessibilidade manual, SEO e desempenho.
8. **Publicação**: autorização formal, rollback preparado, documentação e revisão pós-lançamento.

## 13. Pendências / decisões abertas
- Manual da marca (logo, tipografia, aplicação e acessibilidade das cores).
- Copy integral por página; textos pendentes/`VALIDAR`.
- Endereços, horário, telefone, WhatsApp, unidades, programas e alegações institucionais atuais.
- Definir se a TW precisa editar blog e conteúdo sem desenvolvedor (CMS versus Markdown).
- Fluxo de contatos: email, armazenamento seguro, acesso, retenção, anti-spam e consentimento.
- Disponibilidade das 45 fotos e vídeos, autorizações, formatos e direitos.
- Inventário completo de URLs e presença orgânica anterior; domínios/hosting/acessos.
- Definir eventuais requisitos do CRM na fase 2, sem implementá-los agora.

## 14. Documentos relacionados
- `AGENTS.md` — regras vinculantes de agentes IA, escopo, permissões e verificações.
- `docs/DECISIONS.md` — decisões aprovadas (criar quando iniciar repositório).
- `docs/CONTENT-INVENTORY.md` — evidências e conteúdo (criar durante Discovery).
- `docs/SEO-MIGRATION.md` — URLs anteriores e redirects (criar antes da publicação).

> Este documento é especificação inicial: decisões ainda pendentes devem permanecer explicitamente pendentes, nunca ser presumidas como aprovadas.
