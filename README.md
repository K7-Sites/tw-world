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

Abrir `http://localhost:3000/`.

```bash
npm run build
npm run check
```

## Indexação

- O domínio definitivo é `https://transworld.com.br/`. O build gera o sitemap e os metadados desse domínio. O ambiente de revisão mantém `noindex`.
- Após a autorização de publicação, altere `stage` em `src/_data/site.js` para `PUBLISHED` e configure `TW_ENABLE_INDEXING=1` no ambiente de produção. Execute `npm run guard:production` e gere o build em um diretório limpo.
- O Blog está fora do sitemap enquanto estiver sem artigos. Ao publicar conteúdo aprovado, remova `seoIndex: false` do template do Blog.

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
