# Especificação do Produto — Weather App

## Overview

O Weather App é uma aplicação web responsiva para consultas rápidas de previsão
do tempo. A pessoa usuária pesquisa uma cidade pelo nome e consulta as condições
atuais e a previsão diária de cinco dias, podendo exibir as temperaturas em
Celsius ou Fahrenheit.

Na v1, a busca é manual. A experiência é em português do Brasil, não exige conta
e não armazena buscas ou dados meteorológicos. As consultas usam os serviços
Open-Meteo de geocoding e previsão; o nome pesquisado e as coordenadas da cidade
selecionada são enviados a esse serviço.

**Objetivos do produto**

- Permitir encontrar e selecionar a cidade correta, inclusive quando nomes se
  repetem.
- Apresentar clima atual e previsão de cinco dias em formato fácil de consultar.
- Permitir alternar a unidade de temperatura sem inconsistência entre valores.
- Comunicar o estado e o resultado de cada consulta, inclusive quando houver
  falha.

## Functional Requirements

- **FR1 — Buscar cidade:** permitir submeter um nome de cidade pelo botão de
  busca ou pela tecla Enter. Remover espaços no início e no fim; não iniciar
  requisição para texto vazio ou composto apenas por espaços. Preservar acentos,
  espaços internos e pontuação do nome pesquisado.
- **FR2 — Desambiguar resultados:** apresentar cada resultado como cidade,
  subdivisão administrativa disponível e país. Se esses campos não distinguirem
  resultados homônimos, incluir coordenadas para que cada opção seja única.
  Usar a identidade geográfica do resultado selecionado nas consultas seguintes.
- **FR3 — Exibir clima atual:** após a seleção, mostrar cidade e localização,
  temperatura atual em unidade indicada e condição climática em português do
  Brasil, mapeada dos códigos WMO retornados pelo Open-Meteo.
- **FR4 — Exibir previsão:** mostrar cinco datas locais consecutivas: hoje e os
  quatro dias seguintes. Cada entrada completa contém data, condição climática e
  temperaturas mínima e máxima.
- **FR5 — Alternar unidade:** iniciar em Celsius e permitir alternar para
  Fahrenheit sem nova requisição meteorológica. Converter os valores em Celsius
  com `F = C * 9 / 5 + 32`; exibir temperaturas arredondadas ao inteiro mais
  próximo, com empates afastando-se de zero. O controle se aplica a todas as
  temperaturas visíveis.
- **FR6 — Informar estados da consulta:** expor carregamento e ausência de
  resultados por uma região acessível `role="status"`; expor falhas por
  `role="alert"`. A busca sem resultados não é uma falha de serviço.
- **FR7 — Tentar novamente:** oferecer nova tentativa para falha de geocoding e
  de previsão. Preservar, respectivamente, o nome normalizado pesquisado ou a
  identidade geográfica selecionada.
- **FR8 — Personalizar aparência:** iniciar com tema claro e permitir escolher
  entre tema claro e escuro. Em dispositivos com ponteiro preciso, exibir um
  brilho decorativo que acompanha o ponteiro sem bloquear interações; respeitar
  a preferência de redução de movimento.

## User Stories

- **US1 (FR1):** Como decisor do dia a dia, quero buscar uma cidade pelo nome
  para consultar suas condições sem precisar conhecer sua localização
  geográfica.
- **US2 (FR2):** Como viajante planejador, quero distinguir cidades com o mesmo
  nome por estado, região ou país para selecionar o destino correto.
- **US3 (FR3):** Como decisor do dia a dia, quero ver a temperatura e a condição
  climática atuais da cidade selecionada para decidir como me preparar.
- **US4 (FR4):** Como viajante planejador, quero consultar a previsão diária de
  cinco dias para organizar minha semana.
- **US5 (FR5):** Como decisor do dia a dia, quero alternar entre Celsius e
  Fahrenheit para interpretar todas as temperaturas na unidade que prefiro.
- **US6 (FR6):** Como viajante planejador, quero receber informações claras
  durante o carregamento, quando não houver resultados ou quando ocorrer uma
  falha para entender o estado da consulta.
- **US7 (FR7):** Como decisor do dia a dia, quero tentar novamente uma consulta
  que falhou para obter as condições atuais da cidade.

## Acceptance Criteria

- **AC1.1 (FR1):**
  - **Given** que o campo de busca está vazio ou contém apenas espaços;
  - **When** a pessoa usuária tenta submeter a busca;
  - **Then** nenhuma requisição de geocoding é iniciada e a interface indica que um nome de cidade é obrigatório.
- **AC1.2 (FR1):**
  - **Given** que o campo contém `  São José d'Água  `;
  - **When** a pessoa usuária submete pelo botão ou por Enter;
  - **Then** a busca recebe `São José d'Água`, preservando acentos, apóstrofo e espaços internos, e a aplicação exibe carregamento.
- **AC1.3 (FR1):**
  - **Given** que o geocoding retorna uma ou mais cidades para o nome pesquisado;
  - **When** a resposta é apresentada;
  - **Then** cada resultado retornado aparece como opção selecionável e o estado de carregamento termina.
- **AC2.1 (FR2):**
  - **Given** que a busca retorna duas ou mais cidades com o mesmo nome;
  - **When** as opções são apresentadas;
  - **Then** cada opção apresenta um rótulo geográfico distinto composto por cidade, subdivisão e país disponíveis, usando coordenadas se esses campos não forem suficientes para distingui-la.
- **AC2.2 (FR2):**
  - **Given** que há opções de cidades com o mesmo nome;
  - **When** a pessoa usuária seleciona uma opção;
  - **Then** as requisições meteorológicas usam latitude e longitude da opção selecionada e a tela identifica essa mesma opção.
- **AC3.1 (FR3):**
  - **Given** que a resposta atual do Open-Meteo contém localização, temperatura e código WMO válidos para a cidade selecionada;
  - **When** os dados são exibidos;
  - **Then** a tela mostra a localização selecionada, a temperatura com unidade e a condição correspondente ao código WMO.
- **AC4.1 (FR4):**
  - **Given** que a previsão diária está completa e o fuso retornado pelo serviço define a data local D;
  - **When** a previsão é exibida;
  - **Then** são exibidas exatamente as datas D, D+1, D+2, D+3 e D+4, nessa ordem, sem lacunas.
- **AC4.2 (FR4):**
  - **Given** que uma entrada diária completa é exibida;
  - **When** a pessoa usuária a consulta;
  - **Then** ela contém data em `dd/MM`, condição WMO em português e temperaturas mínima e máxima com a unidade ativa.
- **AC4.3 (FR4):**
  - **Given** que a resposta da previsão não contém dados para um ou mais dos cinco dias;
  - **When** a aplicação apresenta o resultado;
  - **Then** exibe somente entradas diárias completas, não duplica nem substitui dias e informa por `role="status"` que a previsão está incompleta.
- **AC5.1 (FR5):**
  - **Given** que a aplicação foi aberta em uma sessão nova;
  - **When** os controles de temperatura são exibidos;
  - **Then** Celsius está ativo e Fahrenheit pode ser selecionado.
- **AC5.2 (FR5):**
  - **Given** que temperaturas atuais e diárias incluem `20 °C`;
  - **When** a pessoa usuária seleciona Fahrenheit;
  - **Then** todas as temperaturas visíveis são convertidas, `20 °C` é exibido como `68 °F` e nenhum valor permanece identificado em Celsius.
- **AC5.3 (FR5):**
  - **Given** que uma cidade e seus dados meteorológicos estão exibidos;
  - **When** a unidade de temperatura é alternada;
  - **Then** cidade, condições e datas permanecem inalteradas e nenhuma nova requisição meteorológica é iniciada.
- **AC6.1 (FR6):**
  - **Given** que uma busca ou consulta de previsão foi iniciada e ainda não terminou;
  - **When** a aplicação aguarda a resposta;
  - **Then** `role="status"` informa carregamento em até 100 ms e deixa de informar carregamento quando a operação termina.
- **AC6.2 (FR6):**
  - **Given** que a busca terminou sem cidades correspondentes;
  - **When** a aplicação apresenta o resultado;
  - **Then** `role="status"` informa `Nenhuma cidade encontrada` e nenhuma opção ou previsão de busca anterior é apresentada como resultado atual.
- **AC6.3 (FR6):**
  - **Given** que ocorre uma falha de rede ou do serviço durante a consulta;
  - **When** a aplicação recebe ou detecta a falha;
  - **Then** `role="alert"` informa `Não foi possível concluir a consulta`, o carregamento termina e a ação de nova tentativa fica disponível.
- **AC6.4 (FR6):**
  - **Given** que a resposta é inválida ou omite campos obrigatórios de uma ou mais seções meteorológicas;
  - **When** a aplicação processa a resposta;
  - **Then** não renderiza como válida nenhuma seção ou entrada incompleta, mantém as seções completas, informa quais dados estão indisponíveis e, se nenhuma seção completa restar, exibe o erro de AC6.3.
- **AC6.5 (FR6):**
  - **Given** que uma requisição não recebe resposta em 10 segundos;
  - **When** o limite de tempo é atingido;
  - **Then** a requisição é cancelada, o carregamento termina, `role="alert"` informa a falha e a ação de nova tentativa fica disponível.
- **AC7.1 (FR7):**
  - **Given** que uma consulta de geocoding ou de previsão falhou;
  - **When** o erro é exibido;
  - **Then** há um botão `Tentar novamente` associado à operação que falhou.
- **AC7.2 (FR7):**
  - **Given** que uma consulta de geocoding falhou para um nome normalizado;
  - **When** a pessoa usuária aciona `Tentar novamente`;
  - **Then** a aplicação repete o geocoding com o mesmo nome e exibe carregamento.
- **AC7.3 (FR7):**
  - **Given** que a consulta meteorológica falhou para uma cidade selecionada;
  - **When** a pessoa usuária aciona `Tentar novamente`;
  - **Then** a aplicação repete a consulta para as mesmas coordenadas e exibe carregamento.
- **AC7.4 (FR7):**
  - **Given** que uma nova tentativa foi iniciada;
  - **When** ela termina com falha;
  - **Then** o erro e a ação de nova tentativa permanecem disponíveis.
- **AC7.5 (FR7):**
  - **Given** que uma nova tentativa foi iniciada;
  - **When** ela termina com sucesso;
  - **Then** são exibidos dados válidos da consulta repetida e o estado de erro é removido.
- **AC8.1 (FR8):**
  - **Given** que a aplicação foi aberta;
  - **When** nenhum tema foi selecionado;
  - **Then** o tema claro está ativo e o controle expõe essa seleção.
- **AC8.2 (FR8):**
  - **Given** que o controle de tema está disponível;
  - **When** a pessoa seleciona claro ou escuro;
  - **Then** fundo, textos, cartões, campos e controles adotam o tema escolhido com contraste legível.
- **AC8.3 (FR8):**
  - **Given** um dispositivo com ponteiro preciso e sem redução de movimento;
  - **When** o ponteiro se move sobre a aplicação;
  - **Then** um brilho decorativo acompanha sua posição sem capturar eventos ou alterar o layout.

## Non-Functional Requirements

- **NFR1 — Responsividade:** em larguras de 320, 768 e 1280 px, busca, unidade,
  clima atual e previsão permanecem utilizáveis, sem rolagem horizontal da página
  ou conteúdo sobreposto.
- **NFR2 — Usabilidade:** busca e unidade estão disponíveis na tela principal;
  resultados de cidade são selecionáveis e clima atual e previsão têm títulos
  distintos.
- **NFR3 — Acessibilidade:** atender WCAG 2.2 nível AA. Toda ação funciona por
  teclado, tem nome acessível e foco visível; mensagens de estado usam os roles
  definidos em FR6 e não dependem apenas de cor.
- **NFR4 — Performance:** exibir carregamento em até 100 ms após submissão;
  cancelar requisições após 10 segundos sem resposta; atualizar a unidade em até
  100 ms sem nova requisição meteorológica.
- **NFR5 — Confiabilidade:** validar os campos obrigatórios antes de renderizar;
  falhas, payloads inválidos e dados ausentes não encerram a aplicação nem
  produzem valores inventados.
- **NFR6 — Compatibilidade:** suportar as duas versões estáveis mais recentes de
  Chrome, Edge, Firefox e Safari desktop, Safari em iOS e Chrome em Android.
- **NFR7 — Privacidade:** não exigir conta, coletar dados pessoais, persistir
  buscas/preferências ou enviar telemetria. Enviar ao Open-Meteo somente o nome
  pesquisado e, após seleção, as coordenadas necessárias à previsão.
- **NFR8 — Idioma e datas:** exibir textos e condições em pt-BR, datas em
  `dd/MM` e respeitar o fuso local retornado para a cidade selecionada.

## Rastreabilidade

| User Story | Requisito funcional | Critérios de aceite | Requisitos não funcionais relevantes |
| --- | --- | --- | --- |
| US1 — Buscar cidade | FR1 | AC1.1, AC1.2, AC1.3, AC6.1, AC6.2 | NFR1, NFR2, NFR3, NFR4, NFR6, NFR7, NFR8 |
| US2 — Distinguir cidades homônimas | FR2 | AC2.1, AC2.2 | NFR1, NFR2, NFR3, NFR5, NFR6, NFR7, NFR8 |
| US3 — Consultar clima atual | FR3 | AC3.1, AC6.3, AC6.4, AC6.5 | NFR1, NFR3, NFR5, NFR6, NFR7, NFR8 |
| US4 — Consultar previsão | FR4 | AC4.1, AC4.2, AC4.3, AC6.3, AC6.4, AC6.5 | NFR1, NFR3, NFR5, NFR6, NFR7, NFR8 |
| US5 — Alternar unidade | FR5 | AC5.1, AC5.2, AC5.3 | NFR1, NFR2, NFR3, NFR4, NFR6, NFR7 |
| US6 — Entender estados da consulta | FR6 | AC1.1, AC1.3, AC6.1, AC6.2, AC6.3, AC6.4, AC6.5, AC7.1, AC7.4 | NFR1, NFR3, NFR4, NFR5, NFR6, NFR7, NFR8 |
| US7 — Tentar novamente | FR7 | AC6.3, AC6.5, AC7.1, AC7.2, AC7.3, AC7.4, AC7.5 | NFR1, NFR3, NFR4, NFR5, NFR6, NFR7 |

## Edge Cases

- **Busca concorrente:** se uma nova busca ou seleção ocorrer antes da resposta
  anterior, ignorar a resposta antiga; somente a operação mais recente pode
  atualizar a interface.
- **Dados parciais:** manter seções completas, omitir seção ou dia com campo
  obrigatório ausente e comunicar a indisponibilidade. Se nenhuma seção
  completa restar, exibir erro recuperável.
- **Previsão curta:** mostrar somente dias completos retornados, sem duplicar ou
  fabricar entradas, e informar que a previsão está incompleta.
- **Falha ou limite de serviço:** qualquer resposta HTTP não bem-sucedida,
  falha de rede ou timeout segue AC6.3/AC6.5; a interface encerra carregamento e
  oferece nova tentativa.
- **Alternância repetida:** após alternâncias rápidas entre unidades, todos os
  valores usam a última unidade selecionada e não há novas requisições.

## Decisões da v1

- Fonte: Open-Meteo Geocoding API e Forecast API, sem chave de API.
- Período: data local de hoje e quatro dias consecutivos seguintes.
- Unidade inicial: Celsius; a seleção não persiste após recarregar a aplicação.
- Busca: manual; sem geolocalização automática.
- Dados: clima atual, condição e temperaturas mínima/máxima diárias. Chuva,
  vento, umidade e sensação térmica não fazem parte da v1.
- Idioma e data: pt-BR e fuso local da cidade.
- Conectividade e persistência: consulta requer internet; buscas, preferências e
  dados não são persistidos localmente nem no servidor.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Open-Meteo indisponível ou limitando requisições | Média | Alto | Aplicar timeout, exibir erro e permitir nova tentativa manual. |
| Resultados de cidades homônimas não distinguíveis | Média | Alto | Exibir subdivisão, país e, se necessário, coordenadas. |
| Resposta meteorológica incompleta | Média | Alto | Validar campos e renderizar somente seções completas. |
| Falha de conversão ou unidade inconsistente | Baixa | Alto | Centralizar conversão e testar valores positivos, negativos e zero. |

## Out of Scope

- Contas, autenticação e perfis de usuário.
- Favoritos, histórico de pesquisas e personalização avançada.
- Solicitação ou uso automático da localização geográfica do dispositivo.
- Alertas meteorológicos e notificações.
- Funcionamento offline, cache e persistência de buscas ou preferências.
- Aplicativos nativos para Android ou iOS.
- Informações meteorológicas além de temperatura e condição climática, como
  chuva, vento, umidade e sensação térmica.