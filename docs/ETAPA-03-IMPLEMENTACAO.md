# Etapa 03 — Scaffold da Home e arquitetura reutilizável

**Status: implementação inicial local, NÃO homologada e NÃO publicável.**

## Implementado
- Eleventy 3 com Nunjucks, layout compartilhado, menu e rodapé globais.
- Nove páginas estruturais; Home com 10 seções na ordem do caderno da TW.
- Tailwind 4 + CSS responsivo; tokens com cores oficiais `#78AC1C` e `#8717C3`.
- Menu com ARIA, Escape, fechamento ao clicar fora e adaptação a mobile.
- Conteúdo HTML estático independentemente de JS.
- Testes básicos de invariantes do briefing; barreira preliminar contra publicação de `[VALIDAR]` e `noindex` ativo.

## Pendências importantes
- Imagens reais F01–F45, vídeo hero e convite; não incluir imagens genéricas de alunos como imagens oficiais.
- Copy integral da TW, localização/contatos validados e identidade vetorial.
- Auditoria completa de URLs antes de confirmar permalinks; redirects 301 e sitemap apenas com conteúdo aprovado.
- Formulários e armazenamento seguro de leads não implementados.
- Testes E2E, WCAG, SEO técnico, CWV e revisões de browser após build.
- Instalação e build com npm pendentes de validação no ambiente conectado à internet.

## Próximas ações
1. Executar `npm install`, `npm run build`, `npm run check` e navegação local.
2. Revisar Home em 320/375/390/768/1024/1440 px.
3. Ajustar arte final e substituir placeholders somente com recursos autorizados.
4. Aprovar copy, URLs e CTA comerciais antes de remover `noindex`.
5. Implementar captação e QA antes da homologação externa.
