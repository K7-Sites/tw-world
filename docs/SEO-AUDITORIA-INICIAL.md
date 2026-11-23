# TW Idiomas — Auditoria inicial do site legado

**Data:** 2026-11-14  
**Status:** parcial / levantamento público, não substitui crawler, sitemap nem Google Search Console.  
**Site analisado:** https://transworld.com.br/

## Fontes e limite da auditoria
- Site público indexado nos resultados da web em 2026-11-14. Acesso direto à página inicial apresentou HTTP 429 na ferramenta utilizada.
- Documentos da TW: `Novo site - Desenvolvedor.docx` e `Novo site- Produtor Visual.docx`.
- Este inventário **não é lista exaustiva de URLs**. Verificar 200/301/404, canonical, titles, sitemap e indexação com acesso técnico antes de definir redirects.

## URLs confirmadas na pesquisa pública
| URL legada | Conteúdo identificado | Destino pretendido | Decisão preliminar | Status |
|---|---|---|---|---|
| `/` | Home: faixas etárias, cursos, intercâmbio, blog e formulário | Home | Manter URL, reconstruir conteúdo | Confirmada na indexação |
| `/escola/` | Apresentação institucional, metodologia, benefícios | A TW / A Escola | Preferir manter URL | Confirmada na indexação |
| `/ingles/` | Curso de inglês | Inglês e jornadas | Manter URL | Confirmada na indexação |
| `/frances/` | Curso de francês | Francês | Manter URL | Confirmada na indexação |
| `/espanhol/` | Curso de espanhol | Espanhol | Manter URL | Confirmada na indexação |
| `/pratos-tradicionais-da-culinaria-francesa-4/` | Artigo culinária francesa | Artigo blog | Preservar ou redirecionar conforme auditoria | Confirmada na indexação |
| `/conheca-os-principais-exames-de-proficiencia-em-ingles/` | Artigo exames | Artigo blog | Revisar fatos e preservar valor SEO | Confirmada na indexação |
| `/6-pratos-imperdiveis-da-culinaria-espanhola/` | Artigo culinária espanhola | Artigo blog | Preservar ou redirecionar conforme auditoria | Confirmada na indexação |
| `/conheca-21-paises-que-falam-espanhol-e-se-inspire-para-aprender-o-idioma/` | Artigo espanhol | Artigo blog | Revisar e preservar valor SEO | Confirmada na indexação |
| `/quais-destas-71-frases-do-cotidiano-em-ingles-voce-ja-domina/` | Artigo de inglês | Artigo blog | Revisar e preservar valor SEO | Confirmada na indexação |

**Páginas novas do briefing**: Experiência TW, Onde Estamos, Blog e Contato (URLs públicas definitivas **pendentes** de verificação de rotas já existentes, links e métricas). Nunca presumir que `/blog/`, `/contato/` etc. são rotas novas disponíveis.

## Conteúdo legado: classificação
- **Manter como referência factual a validar:** nome Transworld Idiomas, idiomas inglês/francês/espanhol, telefone `(81) 3302-6120`, e-mail `falecom@transworld.com.br`, endereço da Boa Vista.
- **Não migrar automaticamente:** unidade Olinda e outros núcleos, nomes Kids/Teens/Adult/Aged como arquitetura da nova oferta, Aulas Flex, TW Club, TW Plus, certificações apresentadas como centro aplicador, curso online, países específicos e promessas comerciais.
- **Briefing novo prevalece:** TW / Transworld; Little Kids, Magic Kids, Super Teens, Fluency; TRAIL; Study Lab; preparação TOEFL Primary® e TOEFL Junior® sem certificação garantida; Boa Vista e CIC em destaque; intercâmbio via parcerias.

## Funil atual observado
- Entrada via Home ou páginas de cursos → CTA de interesse / WhatsApp → formulário de matrícula/contato.
- Formulário da Home inclui nome, telefone, unidade, e-mail, turma e idioma.
- No novo site: validar campos e destino dos dados, implementar endpoint seguro, idempotência e eventos de conversão; 'matrícula' só será usada como ação transacional se aprovada.

## Pendências para fechar o inventário
1. Exportar lista integral de URLs públicas do sitemap e/ou crawler com status HTTP, title, meta, canonical, H1, links internos e imagens.
2. Consultar Search Console: cliques, impressões, páginas indexadas e erros; definir prioridade de preservação.
3. Confirmar lista atual de unidades, telefone, WhatsApp, idiomas e oferta com a direção.
4. Confirmar se a nova URL de 'A TW' será `/escola/` e avaliar páginas institucionais correlatas.
5. Inventariar todos os posts e decidir manter, revisar, redirecionar ou remover (410 em casos justificados).
6. Criar matriz final `URL antiga → URL nova → código HTTP → justificativa → aprovação` antes da publicação.
7. Não publicar redirecionamentos sem teste contra cadeias e loops.

## Fontes públicas consultadas
- https://transworld.com.br/
- https://transworld.com.br/escola/
- https://transworld.com.br/ingles/
- https://transworld.com.br/frances/
- https://transworld.com.br/espanhol/
- https://transworld.com.br/pratos-tradicionais-da-culinaria-francesa-4/
- https://transworld.com.br/conheca-os-principais-exames-de-proficiencia-em-ingles/
- https://transworld.com.br/6-pratos-imperdiveis-da-culinaria-espanhola/
- https://transworld.com.br/conheca-21-paises-que-falam-espanhol-e-se-inspire-para-aprender-o-idioma/
- https://transworld.com.br/quais-destas-71-frases-do-cotidiano-em-ingles-voce-ja-domina/
