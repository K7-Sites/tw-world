# TW Idiomas — Design System / Especificação inicial

**Versão:** 0.1 (pré-wireframe)  
**Status:** orienta desenvolvimento, mas não substitui manual de marca nem aprovação da Home.

## Princípios
- Design próprio: moderno, humano, reconhecível como TW; imagem real da escola acima de clichês educacionais.
- Base clara, verde e roxo em pontos específicos; espaço em branco generoso.
- Mobile-first; conteúdo principal legível em HTML, sem JS.
- Fotografia documental dirigida e vídeos previstos no Caderno Audiovisual; usar somente materiais autorizados.
- Não inventar textos finais, depoimentos, dados, certificados ou cursos.

## Cores
| Token | Valor | Fonte | Uso |
|---|---|---|---|
| `--color-tw-green` | `#78AC1C` | Cliente | Marca, ilustrações, realces e acentos |
| `--color-tw-purple` | `#8717C3` | Cliente | Realces, seções secundárias, ícones |
| `--color-bg` | pendente | Manual / protótipo | Superfícies claras |
| `--color-text` | pendente | Manual / protótipo | Texto principal |
| `--heading-color` | `#364263` | Aprovado pelo responsável do projeto | Títulos em superfícies claras. No rodapé verde e nas seções escuras, usar a variante branca. |
| `--color-border` | pendente | Manual / protótipo | Divisórias e campos |
| `--color-green-interactive` | pendente de contraste | Design system | Botões com texto legível |
| `--color-focus` | pendente de contraste | Design system | Foco visível |

Não usar texto branco pequeno em `#78AC1C` sem validação WCAG; definir e testar variante de ação. Não alterar as duas cores oficiais. O mesmo cuidado vale para textos em roxo sobre fundo claro.

## Tipografia e escala
- A interface usa Jost variável local, com pesos de 400 a 800.
- A escala compartilhada usa `--type-h1` a `--type-h5`, `--type-lead`, `--type-body` e `--type-small`.
- Usar `clamp()` nos títulos principais e `rem` no corpo, respeitando zoom 200%.
- Parágrafos com linha confortável, contraste e largura de leitura adequada.

## Layout
- O container compartilhado oferece larguras máximas de 76 rem para leitura, 100 rem como padrão e 112 rem para composições amplas.
- Gutters responsivos; blocos com ritmo vertical uniforme.
- Breakpoints guiados por conteúdo; testes em 320, 375, 390, 768, 1024 e 1440px e entre tamanhos.
- Mobile hero com crop/asset próprio e CTAs utilizáveis sem sobreposição.

## Componentes do MVP
1. `site-header`: logo, navegação principal, menu mobile acessível, CTA quando aprovado.
2. `site-footer`: contatos e links validados, canais sociais, política e privacidade.
3. `button`/`text-link`: variantes primária/secundária, focus, disabled e loading quando aplicável.
4. `section-heading`: eyebrow opcional, heading e texto aprovado.
5. `course-card`: imagem, jornada, resumo e CTA; sem inventar faixa etária/programa.
6. `media-picture` e `video-hero`: `<picture>`, `srcset`, dimensões, poster e reduced-motion.
7. `video-invite`: playback sob ação do usuário, legendas e transcrição.
8. `lead-form`: labels, feedback de erro/sucesso, antiduplo envio e integração API.
9. `testimonial-card`: somente depoimentos reais/autorizados.
10. `faq`: HTML semântico, conteúdo validado, navegação por teclado.
11. `location-card`: somente unidades confirmadas.
12. `article-card`: blog com título, data, autor se houver, resumo e link.

## Home — ordem definida pela TW
| # | Seção | Conteúdo | Evidência / mídia |
|---|---|---|---|
| 01 | Hero | H1 'Idiomas para aprender de verdade.'; sub 'Inglês, francês e espanhol, a partir dos 4 anos.'; CTA 'ENCONTRE SEU CURSO' / 'CONHEÇA A TW' | F01 ou vídeo loop + poster |
| 02 | História | Continuidade Transworld → TW | Foto humana e copy aprovada |
| 03 | Além da aula | Prática, acompanhamento, experiências e suporte | Fotos F26–F40 |
| 04 | Jornadas | Little Kids, Magic Kids, Super Teens e Fluency | Fotos F02–F25 |
| 05 | Certificações | Magic Kids prepara TOEFL Primary®; Super Teens prepara TOEFL Junior® | Texto cuidadoso sem garantia |
| 06 | Vídeo-convite | Janaína, duração 30–40s, captions/transcrição | Vídeo-convite |
| 07 | Experiência TW | TRAIL, Study Lab e suporte | Fotos F31–F40 |
| 08 | Intercâmbio | Acesso a oportunidades via parcerias | Aprovado e secundário |
| 09 | Onde estamos | Boa Vista / CIC | Fotos F41–F45 e endereços validados |
| 10 | Prova social + CTA | Depoimentos e captação | Permissão de uso necessária |

## Estados e QA de cada componente
- Normal / hover / focus-visible / active / disabled / loading se pertinente.
- Navegação por teclado e Escape onde aplicável; sem armadilhas de foco.
- Zoom 200%, orientações e idiomas; texto alternativo útil em imagens informativas.
- Sem layout shift significativo por mídia; respeito a `prefers-reduced-motion`.
- JS como progressive enhancement; links essenciais são links reais.

## Prévia dos componentes

- A rota local `/styleguide/` está disponível com o servidor Eleventy. O build padrão não gera a página.
- As macros em `components/ui.njk` oferecem botões `primary`, `secondary` e `ghost`, cards, badges, títulos, containers e seções `light`, `dark`, `brand` e `gradient`.
- O atributo `data-lang` define `--accent`, `--highlight` e `--theme-gradient` na região. A prévia usa verde para inglês, azul para francês e terracota para espanhol.
- As sombras `--shadow-sm`, `--shadow-md`, `--shadow-lg` e `--shadow-glow` aparecem nos cards da prévia. Use `data-reveal` para entrada ao rolar e `data-reveal-group` para entrada em sequência.

## Ordem de aprovação da interface
1. Receber logos e manual de marca; confirmar tipografia e cores complementares.
2. Criar wireframe de baixa fidelidade desktop/mobile com a copy autorizada.
3. Revisar/validar hierarquia dos 10 blocos, CTA e mídia prevista.
4. Propor 1 direção visual, validar Home antes de replicar componentes.
5. Produzir UI kit/documentação dos componentes; testar e refinar.

## Observações técnicas
- Implementação preferida: Eleventy/Nunjucks + Tailwind CSS 4 compilado + CSS de componentes + JS modular.
- Centralizar tokens; não dispersar hexadecimais nos templates.
- Não usar Tailwind via CDN em produção.
- O repositório deve conter `AGENTS.md` e `docs/ARCHITECTURE.md`, que prevalecem sobre sugestões não aprovadas.
