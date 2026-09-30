## Contexto

A empresa precisa de uma aplicação web de previsão do tempo para consultas
rápidas no dia a dia. O usuário deve informar uma cidade e visualizar o clima
atual e a previsão dos próximos cinco dias, podendo alternar a unidade de
temperatura entre Celsius e Fahrenheit.

O produto deve priorizar uma experiência simples, clara e responsiva, com foco
em dispositivos móveis, sem impedir o uso em telas maiores. A primeira versão
deve concentrar-se na consulta de previsão, sem escopo explícito para contas,
favoritos ou personalização avançada.

## Requisitos Funcionais

- **RF1 — Buscar cidade:** permitir que o usuário pesquise uma cidade por nome.
- **RF2 — Desambiguar resultados:** quando houver cidades com o mesmo nome,
	apresentar informações adicionais, como estado, região ou país, para apoiar a
	seleção correta.
- **RF3 — Exibir clima atual:** mostrar, no mínimo, temperatura, condição
	climática e localização consultada.
- **RF4 — Exibir previsão:** mostrar a previsão de cinco dias, com data,
	condição climática e temperaturas mínima e máxima.
- **RF5 — Alternar unidade:** permitir alternar entre Celsius e Fahrenheit e
	atualizar todos os valores de temperatura exibidos.
- **RF6 — Informar estados da consulta:** comunicar visualmente carregamento,
	ausência de resultados e falhas de rede ou do serviço.
- **RF7 — Tentar novamente:** oferecer uma ação de nova tentativa quando uma
	consulta falhar.

## Requisitos Não-Funcionais

- **RNF1 — Responsividade:** a interface deve ser mobile-first e funcionar em
	smartphones, tablets e desktops, sem perda de conteúdo ou controles.
- **RNF2 — Usabilidade:** a busca e a alternância de unidade devem ser fáceis de
	localizar e usar, com informações organizadas para consulta rápida.
- **RNF3 — Acessibilidade:** suportar navegação por teclado, labels e roles
	semânticos, foco visível e contraste suficiente para leitura.
- **RNF4 — Performance:** apresentar feedback imediato durante buscas e evitar
	requisições desnecessárias ao alternar entre Celsius e Fahrenheit.
- **RNF5 — Confiabilidade:** tratar indisponibilidade da rede, respostas
	inválidas e ausência de resultados sem quebrar a aplicação.
- **RNF6 — Compatibilidade:** funcionar nos navegadores modernos mais comuns em
	suas versões atuais.
- **RNF7 — Privacidade:** não exigir autenticação nem coletar dados pessoais
	para realizar uma consulta.

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Serviço meteorológico indisponível ou limitando requisições | Média | Alto | Exibir erro acionável, permitir nova tentativa e avaliar cache posteriormente. |
| Resultados ambíguos para o nome informado | Alta | Médio | Mostrar país, estado ou coordenadas nos resultados de busca. |
| Dados meteorológicos incompletos ou incompatíveis | Média | Alto | Validar a resposta e definir valores substitutos ou mensagem clara. |
| Interface difícil de usar em telas pequenas | Média | Alto | Adotar layout mobile-first e validar em diferentes larguras. |
| Conversão incorreta entre Celsius e Fahrenheit | Baixa | Alto | Centralizar a conversão em lógica testável e cobrir os limites relevantes. |
| Usuário interpretar previsão de cinco dias de forma diferente | Média | Médio | Definir explicitamente se o período inclui o dia atual e exibir datas claras. |

## Perguntas em Aberto

1. Qual serviço ou API fornecerá os dados meteorológicos? Há restrições de custo,
	 quota ou necessidade de chave de API?
2. A previsão de cinco dias inclui o dia atual ou os cinco dias seguintes?
3. Quais informações, além da temperatura e condição, devem aparecer no clima
	 atual e na previsão, como chuva, vento, umidade ou sensação térmica?
4. Qual unidade deve ser usada por padrão na primeira visita?
5. A aplicação deve sugerir a localização atual do usuário ou trabalhar apenas
	 com busca manual?
6. Quais idiomas e formatos de data devem ser suportados?
7. A consulta anterior deve ser preservada localmente para uso posterior ou
	 funcionamento parcial offline?
8. Existe necessidade de favoritos, histórico, alertas meteorológicos ou login?
9. Quais navegadores, tamanhos de tela e requisitos de acessibilidade precisam
	 ser oficialmente suportados?

## Suposições

- A aplicação será acessada principalmente por usuários individuais, sem login.
- O usuário terá conexão com a internet no momento da consulta.
- A busca será feita por nome de cidade, sem geolocalização automática na
	primeira versão.
- A fonte de dados fornecerá localização, clima atual e previsão diária de pelo
	menos cinco dias.
- A unidade selecionada será aplicada de forma consistente a todas as
	temperaturas da tela.
- A interface inicial será disponibilizada em português do Brasil.
- O produto será uma aplicação web responsiva, sem requisito inicial de app
	nativo para Android ou iOS.
