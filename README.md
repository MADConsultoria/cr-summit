# CR Summit - Landing Page Estatica

## Estrutura da pagina (arquitetura)
1. `Header fixo` com navegacao por ancoras + CTA de topo
2. `Hero` com promessa principal, data/local, CTA primario
3. `Para quem e` com 3 cards de perfil
4. `O que e o evento` com resumo operacional + agenda/local
5. `Especialistas` com grid de 4 palestrantes
6. `Destravamentos` (beneficios) com 3 cards de valor
7. `Investimento` com ancoragem de preco + CTA para checkout
8. `FAQ` com perguntas objetivas
9. `CTA final` + rodape

## Arquivos do projeto
- `index.html`: estrutura da LP
- `styles.css`: design system, layout e responsividade
- `script.js`: menu mobile e ano dinamico
- `assets/images/*`: placeholders para troca por imagens finais
- `assets/icons/*`: icones de beneficios

## Troca de materiais (quando suas imagens ficarem prontas)
Substitua mantendo os mesmos nomes de arquivo:
- `assets/images/logo-cr-summit.svg`
- `assets/images/hero-desktop.svg` (recomendado 2500x950)
- `assets/images/hero-mobile.svg` (recomendado 1080x1920)
- `assets/images/speaker-boutros.svg` (recomendado 1200x1500)
- `assets/images/speaker-joyce.svg` (recomendado 1200x1500)
- `assets/images/speaker-marcio.svg` (recomendado 1200x1500)
- `assets/images/speaker-raphael.svg` (recomendado 1200x1500)

Se preferir JPG/WebP, basta alterar as extensoes no `index.html`.

## Pontos para voce definir antes do go-live
1. Link real do checkout em `#checkout` (hoje esta `https://SEU-CHECKOUT-AQUI`)
2. Politica de privacidade/termos no rodape
3. Pixel e eventos (Meta + GA4 + GTM)
4. Provas sociais e dados de autoridade (numeros, cases, depoimentos)

## Como testar localmente
Abra `index.html` no navegador.
