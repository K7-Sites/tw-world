# TW Idiomas — site institucional (rascunho)

Projeto sob as regras de `AGENTS.md` e `docs/ARCHITECTURE.md`.

## Stack
HTML5 gerado por Eleventy 3/Nunjucks, Tailwind 4 compilado, CSS próprio, JavaScript ES Modules. Sem framework SPA.

## Início local
Requer Node.js 20+ e acesso ao registro npm:

```bash
npm install
npm run dev
```

Abrir o endereço informado pelo Eleventy (normalmente `http://localhost:8080`).

```bash
npm run build
npm run check
```

**Importante:** este pacote é um protótipo técnico. Todas as páginas usam `noindex` e existem blocos `[VALIDAR]`/`[PENDENTE]`. O comando `npm run guard:production` deve falhar até a aprovação editorial; ele não substitui testes nem revisão humana.

## Estrutura
- `src/_includes/layouts`: HTML compartilhado (head/header/footer via layout).
- `src/_includes/components`: macros reutilizáveis.
- `src/_data`: navegação, dados institucionais e jornadas.
- `src/pages`: nove templates de página, com rotas provisórias.
- `src/styles`: Tailwind + CSS de componentes.
- `src/scripts`: módulos nativos de interação.
- `docs`: arquitetura, decisões e pendências.

## Atenção
Nenhuma URL nova está aprovada para produção; verificar as URLs antigas e redirects com a TW e Search Console. Não publicar mídias, depoimentos e copy não aprovados, nem ativar formulários sem backend seguro e política LGPD.
