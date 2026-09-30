# Backlog de Tarefas — Weather App

Tarefas derivadas de [weather-app-plan.md](../plans/weather-app-plan.md), ordenadas por fluxo de implementação e dependências. Cada tarefa inclui rastreabilidade à spec. Vite, Vitest, Testing Library, Playwright e Biome já estão configurados.
Tarefas derivadas de [weather-app-plan.md](../plans/weather-app-plan.md), ordenadas por fluxo de implementação e dependências. Cada tarefa inclui rastreabilidade à spec. Vite, Vitest, Testing Library, Playwright e Biome já estão configurados.

## Prioridade e tamanho

Prioridade indica sequência, não remoção de escopo: **P0** forma a primeira versão funcional; **P1** fecha a cobertura automatizada antes da validação final; **P2** é o hardening final, ainda necessário antes de declarar a entrega pronta. Tamanho relativo: **P** pequeno/isolado, **M** esforço moderado ou vários casos, **G** integração, concorrência ou validação ampla.

| Tarefa | Prioridade | Tamanho |
| --- | --- | --- |
| T-01 | P0 | M |
| T-02 | P0 | M |
| T-03 | P0 | P |
| T-04 | P0 | P |
| T-05 | P0 | M |
| T-06 | P0 | G |
| T-07 | P0 | G |
| T-08 | P0 | P |
| T-09 | P0 | M |
| T-10 | P0 | P |
| T-11 | P0 | M |
| T-12 | P0 | P |
| T-13 | P0 | M |
| T-14 | P0 | M |
| T-15 | P1 | P |
| T-16 | P1 | P |
| T-17 | P1 | P |
| T-18 | P1 | M |
| T-19 | P1 | G |
| T-20 | P1 | G |
| T-21 | P1 | P |
| T-22 | P1 | P |
| T-23 | P1 | P |
| T-24 | P1 | M |
| T-25 | P1 | P |
| T-26 | P1 | M |
| T-27 | P1 | G |
| T-28 | P2 | G |
| T-29 | P1 | M |

## Sequência de fatias verticais

1. **Busca e clima atual, primeiro resultado visível:** implementar T-01–T-10 e T-13, que conecta formulário, resultados, consulta e clima atual. Essa fatia demonstra a busca real, a seleção da cidade e a condição atual sem esperar pela previsão completa.
2. **Previsão e unidade:** implementar T-11 e T-12 e então T-14, que integra previsão de cinco dias, alternância °C/°F e responsividade na mesma tela.
3. **Confiança por fluxo:** executar T-15–T-26, agrupando os testes junto às áreas correspondentes: funções puras, services com mocks, hook e componentes/estados.
4. **Validação de ponta a ponta e hardening:** executar T-27 para o caminho principal em desktop/mobile e os cenários de erro; finalizar com T-28 e os gates/auditorias antes da entrega.

## Entrega 9 — Aparência

### T-29 — Adicionar temas e brilho do ponteiro

- **Descrição:** permitir alternar entre temas claro e escuro e adicionar brilho decorativo que acompanha ponteiros precisos.
- **Critérios de aceite:**
  - Tema claro é o padrão e o controle acessível expõe qual tema está ativo.
  - Fundo, textos, cartões, campos e controles mantêm contraste nos dois temas.
  - O brilho acompanha o ponteiro sem bloquear interação ou alterar layout e respeita toque e redução de movimento.
  - Testes verificam tema padrão e alternância; `pnpm lint`, `pnpm build` e `pnpm test` passam.
- **Dependências:** T-14.
- **Arquivos prováveis:** `src/App.tsx`, `src/index.css`, `src/components/ThemeToggle.tsx`, `src/components/CursorSparkle.tsx`.
- **Rastreabilidade:** FR8; AC8.1–AC8.3; NFR1–NFR4.
- **Tipo:** UI

## Entrega 1 — Tipos e funções puras

### T-01 — Definir os contratos de domínio

- **Descrição:** Criar tipos compartilhados para cidade, clima atual, previsão, unidade e estados das consultas.
- **Critérios de aceite:**
  - `City`, `CurrentWeather`, `ForecastDay`, `WeatherData` e `Unit` representam campos e opcionais descritos no modelo de dados do plano.
  - `WeatherData` inclui timezone, seções indisponíveis e indicador de previsão incompleta; temperaturas do domínio são Celsius.
  - `pnpm build` valida os contratos sem erros TypeScript.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`
- **Rastreabilidade:** FR3–FR6; AC3.1, AC4.1–AC4.3, AC6.4, AC5.3.
- **Tipo:** Data

### T-02 — Mapear códigos meteorológicos WMO

- **Descrição:** Implementar função pura que traduz códigos WMO conhecidos em descrições pt-BR.
- **Critérios de aceite:**
  - Cada código definido como suportado retorna descrição não vazia em pt-BR.
  - Código fora do mapeamento retorna resultado de desconhecido, sem atribuir condição incorreta.
  - Testes unitários verificam ao menos um código suportado e um desconhecido.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/utils/weather-codes.ts`
- **Rastreabilidade:** FR3, FR4; AC3.1, AC4.2; NFR5, NFR8.
- **Tipo:** Data

### T-03 — Converter e arredondar temperaturas

- **Descrição:** Implementar conversão de Celsius para Fahrenheit e arredondamento para exibição.
- **Critérios de aceite:**
  - A fórmula aplicada é `F = C * 9 / 5 + 32`, sempre usando a entrada Celsius original.
  - Empates arredondam afastando-se de zero: `0.5` resulta em `1` e `-0.5` em `-1`.
  - Casos de referência incluem `20 °C → 68 °F` e `-40 °C → -40 °F`.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/utils/temperature.ts`
- **Rastreabilidade:** FR5; AC5.2, AC5.3; NFR4.
- **Tipo:** Data

### T-04 — Apresentar datas locais

- **Descrição:** Implementar formatação de datas locais recebidas da API para `dd/MM`.
- **Critérios de aceite:**
  - A entrada ISO `2026-10-01` é apresentada como `01/10`.
  - A saída preserva o dia civil da entrada, sem deslocamento pelo fuso do dispositivo.
  - Testes em fusos locais distintos produzem a mesma saída para a mesma data ISO.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/utils/dates.ts`
- **Rastreabilidade:** FR4; AC4.1, AC4.2; NFR8.
- **Tipo:** Data

## Entrega 2 — Services

### T-05 — Implementar o serviço de geocoding

- **Descrição:** Consultar a Open-Meteo Geocoding API e validar resultados antes de convertê-los em cidades do domínio.
- **Critérios de aceite:**
  - A requisição envia `name`, `count=10`, `language=pt` e `format=json`; o nome preserva acentos, pontuação e espaços internos.
  - Itens sem nome, país, latitude ou longitude válidos não são retornados; `id`, `admin1` e `timezone` podem estar ausentes.
  - Resposta válida sem resultados retorna lista vazia; HTTP não-2xx, erro de rede e JSON inválido produzem falha recuperável.
  - Timeout aborta a requisição em 10 segundos e o serviço respeita sinal de cancelamento do chamador.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/services/geocoding.ts`
- **Rastreabilidade:** FR1, FR2, FR6; AC1.2, AC1.3, AC2.1, AC6.2, AC6.3, AC6.5; NFR5, NFR7.
- **Tipo:** Data

### T-06 — Implementar o serviço de previsão

- **Descrição:** Consultar forecast pelas coordenadas selecionadas e validar clima atual e cada dia independentemente.
- **Critérios de aceite:**
  - A requisição usa latitude/longitude recebidas, campos `current` e `daily` definidos no plano, `timezone=auto`, Celsius e cinco dias.
  - Clima atual só é mapeado com horário, temperatura finita e código WMO válidos; cada dia requer data, código e temperaturas mínima/máxima válidos.
  - São mantidos somente dias completos do intervalo local D a D+4; seções inválidas são marcadas indisponíveis e falta de dias marca previsão incompleta.
  - Ao menos uma seção válida retorna sucesso; nenhuma seção válida, HTTP não-2xx, rede ou JSON inválido resulta em falha recuperável.
  - Timeout aborta em 10 segundos e o serviço respeita o sinal de cancelamento do chamador.
- **Dependências:** T-01, T-02, T-04.
- **Arquivos prováveis:** `src/services/forecast.ts`
- **Rastreabilidade:** FR3, FR4, FR6; AC3.1, AC4.1, AC4.3, AC6.3–AC6.5; NFR5, NFR7, NFR8.
- **Tipo:** Data

## Entrega 3 — Hook de estado

### T-07 — Coordenar consultas e estados no hook

- **Descrição:** Implementar estado de busca, seleção, previsão, unidade e retentativa, descartando respostas obsoletas.
- **Critérios de aceite:**
  - Texto vazio não chama geocoding; texto válido é aparado nas extremidades e preserva acentos, pontuação e espaços internos.
  - Nova busca limpa resultados, cidade e previsão anteriores; seleção consulta as coordenadas da opção selecionada.
  - Geocoding e previsão têm estados independentes; operação obsoleta não altera estado nem mostra erro de cancelamento.
  - Retentativa usa exatamente o nome normalizado ou a identidade geográfica da operação que falhou.
  - Unidade inicial é Celsius; alterá-la não chama serviço nem modifica dados canônicos.
- **Dependências:** T-05, T-06.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`
- **Rastreabilidade:** FR1, FR2, FR5–FR7; AC1.1, AC1.2, AC2.2, AC5.1, AC5.3, AC6.2, AC6.5, AC7.2, AC7.3.
- **Tipo:** Data

## Entrega 4 — Componentes

### T-08 — Criar o formulário de busca

- **Descrição:** Implementar formulário para submissão por botão/Enter e indicação de campo obrigatório.
- **Critérios de aceite:**
  - Submeter por botão ou Enter chama a ação de busca uma vez.
  - Campo vazio ou com espaços apenas apresenta erro associado e não chama a ação.
  - Campo tem nome acessível e mensagem de validação associada programaticamente.
- **Dependências:** T-07.
- **Arquivos prováveis:** `src/components/SearchForm.tsx`
- **Rastreabilidade:** FR1, FR6; AC1.1, AC1.2; NFR2, NFR3.
- **Tipo:** UI

### T-09 — Criar resultados selecionáveis de cidades

- **Descrição:** Exibir opções de geocoding acessíveis e distinguir resultados homônimos.
- **Critérios de aceite:**
  - Cada opção renderiza cidade, subdivisão e país quando disponíveis.
  - Para cidades com os mesmos campos geográficos exibidos, os rótulos são distintos e incluem coordenadas.
  - Ativar cada opção por teclado chama seleção com a identidade e coordenadas daquela cidade.
- **Dependências:** T-07.
- **Arquivos prováveis:** `src/components/CityResults.tsx`
- **Rastreabilidade:** FR2; AC1.3, AC2.1, AC2.2; NFR2, NFR3, NFR5.
- **Tipo:** UI

### T-10 — Apresentar clima atual

- **Descrição:** Implementar apresentação do clima atual e da cidade selecionada.
- **Critérios de aceite:**
  - Dados válidos mostram localização selecionada, descrição WMO, temperatura convertida e símbolo da unidade ativa.
  - `current` ausente ou inválido não é apresentado como temperatura/condição válida.
  - O título da seção distingue clima atual da previsão diária.
- **Dependências:** T-02, T-03, T-07.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`
- **Rastreabilidade:** FR3, FR5, FR6; AC3.1, AC5.2, AC6.4; NFR2, NFR5, NFR8.
- **Tipo:** UI

### T-11 — Apresentar previsão diária

- **Descrição:** Implementar lista de dias válidos e comunicação de previsão incompleta.
- **Critérios de aceite:**
  - Previsão completa renderiza exatamente D–D+4 em ordem; cada dia mostra data `dd/MM`, condição WMO e mínima/máxima com unidade ativa.
  - Para resposta parcial, renderiza somente dias completos disponíveis, sem duplicação ou substituição, e informa previsão incompleta em `role="status"`.
  - Dia ou seção sem dados válidos não é renderizado como previsão válida.
- **Dependências:** T-02, T-03, T-04, T-07.
- **Arquivos prováveis:** `src/components/DailyForecast.tsx`
- **Rastreabilidade:** FR4–FR6; AC4.1–AC4.3, AC6.4; NFR3, NFR5, NFR8.
- **Tipo:** UI

### T-12 — Criar o controle de unidade

- **Descrição:** Implementar escolha acessível entre Celsius e Fahrenheit.
- **Critérios de aceite:**
  - No estado inicial, Celsius está selecionado e Fahrenheit pode ser selecionado.
  - Selecionar unidade chama a ação correspondente uma vez e expõe qual unidade está ativa.
  - O controle não inicia requisição meteorológica.
- **Dependências:** T-03, T-07.
- **Arquivos prováveis:** `src/components/TemperatureUnitToggle.tsx`
- **Rastreabilidade:** FR5; AC5.1, AC5.3; NFR2–NFR4.
- **Tipo:** UI

## Entrega 5 — Integração da aplicação

### T-13 — Integrar busca e clima atual

- **Descrição:** Conectar hook, formulário, resultados selecionáveis e clima atual à tela principal para entregar o primeiro fluxo funcional.
- **Critérios de aceite:**
  - Busca por botão/Enter apresenta opções; selecionar uma cidade consulta as coordenadas selecionadas e apresenta cidade, temperatura e condição atuais válidas.
  - Nova busca não deixa resultados ou clima atual anteriores apresentados como resposta atual.
  - Loading usa `role="status"`; busca vazia usa status; falha usa `role="alert"` com `Tentar novamente` para a operação correspondente.
- **Dependências:** T-08, T-09, T-10.
- **Arquivos prováveis:** `src/App.tsx`
- **Rastreabilidade:** FR1–FR3, FR6, FR7; AC1.1–AC1.3, AC2.2, AC3.1, AC6.1–AC6.3, AC7.1–AC7.5; NFR2, NFR3.
- **Tipo:** UI

### T-14 — Integrar previsão, unidade e responsividade

- **Descrição:** Completar a tela com previsão diária e controle de unidade e aplicar o layout responsivo.
- **Critérios de aceite:**
  - A tela integrada apresenta previsão diária completa/parcial e permite alternar todas as temperaturas entre °C e °F sem nova requisição.
  - Em 320, 768 e 1280 px, busca, unidade, clima atual e previsão permanecem utilizáveis; `document.documentElement.scrollWidth <= window.innerWidth` e não há sobreposição.
  - Foco permanece visível nos controles interativos.
- **Dependências:** T-11, T-12, T-13.
- **Arquivos prováveis:** `src/App.tsx`, `src/index.css`
- **Rastreabilidade:** FR3–FR6; AC3.1, AC4.1–AC4.3, AC5.1–AC5.3, AC6.4; NFR1–NFR4, NFR8.
- **Tipo:** UI

## Entrega 6 — Testes

### T-15 — Testar o mapeamento WMO

- **Descrição:** Testar descrições de códigos suportados e o comportamento para códigos desconhecidos.
- **Critérios de aceite:**
  - Cada código definido como suportado no mapeamento tem caso que verifica sua descrição pt-BR.
  - Um código fora do mapeamento verifica o resultado de desconhecido.
  - `pnpm test -- tests/utils/weather-codes.test.ts` conclui sem falhas.
- **Dependências:** T-02.
- **Arquivos prováveis:** `tests/utils/weather-codes.test.ts`
- **Rastreabilidade:** FR3, FR4; AC3.1, AC4.2; NFR5, NFR8.
- **Tipo:** Test

### T-16 — Testar conversão de unidade Celsius/Fahrenheit

- **Descrição:** Criar testes unitários Vitest para a conversão de unidade, arredondamento e alternâncias repetidas a partir do valor Celsius canônico.
- **Critérios de aceite:**
  - Testes verificam `20 °C → 68 °F`, `-40 °C → -40 °F`, zero e empates positivos/negativos.
  - Alternâncias repetidas calculam sempre a partir do mesmo valor Celsius, sem acumular erro.
  - `pnpm test -- tests/utils/temperature.test.ts` conclui sem falhas.
- **Dependências:** T-03.
- **Arquivos prováveis:** `tests/utils/temperature.test.ts`
- **Rastreabilidade:** FR5; AC5.2, AC5.3; NFR4.
- **Tipo:** Test

### T-17 — Testar apresentação de datas

- **Descrição:** Testar formato e preservação de datas locais.
- **Critérios de aceite:**
  - Casos verificam `2026-10-01 → 01/10`, mudança de mês e mudança de ano.
  - A mesma data ISO produz a mesma saída nos fusos de teste configurados.
  - `pnpm test -- tests/utils/dates.test.ts` conclui sem falhas.
- **Dependências:** T-04.
- **Arquivos prováveis:** `tests/utils/dates.test.ts`
- **Rastreabilidade:** FR4; AC4.1, AC4.2; NFR8.
- **Tipo:** Test

### T-18 — Testar o serviço de geocoding

- **Descrição:** Criar testes dedicados ao service de geocoding usando `fetch` mockado para parâmetros, validação, lista vazia, falhas e cancelamento.
- **Critérios de aceite:**
  - O mock confirma endpoint e parâmetros `name`, `count`, `language` e `format`.
  - Fixtures cobrem resultado válido com campos opcionais, lista vazia e itens inválidos por falta de nome, país ou coordenadas.
  - HTTP não-2xx, rede e JSON inválido verificam erro recuperável; temporizador falso verifica abortamento em 10 segundos.
  - `pnpm test -- tests/services/geocoding.test.ts` passa sem acessar rede real.
- **Dependências:** T-05.
- **Arquivos prováveis:** `tests/services/geocoding.test.ts`
- **Rastreabilidade:** FR1, FR2, FR6; AC1.2, AC1.3, AC2.1, AC6.2, AC6.3, AC6.5; NFR5, NFR7.
- **Tipo:** Test

### T-19 — Testar o serviço de previsão

- **Descrição:** Criar testes dedicados ao service de previsão usando `fetch` mockado para parâmetros, validação por seção/dia, resposta parcial e falhas.
- **Critérios de aceite:**
  - O mock confirma coordenadas selecionadas e todos os parâmetros da consulta.
  - Fixtures verificam payload completo, `current` ausente/inválido, dia incompleto, arrays desalinhados e nenhuma seção válida.
  - Asserções verificam intervalo D–D+4 e valores de `unavailable` e `incompleteDaily` para dados ausentes.
  - HTTP não-2xx, rede, JSON inválido, timeout de 10 segundos e cancelamento são testados sem API real.
  - `pnpm test -- tests/services/forecast.test.ts` conclui sem falhas.
- **Dependências:** T-06.
- **Arquivos prováveis:** `tests/services/forecast.test.ts`
- **Rastreabilidade:** FR3, FR4, FR6; AC3.1, AC4.1, AC4.3, AC6.3–AC6.5; NFR5, NFR7, NFR8.
- **Tipo:** Test

### T-20 — Testar o hook de estado

- **Descrição:** Testar submissão, seleção, concorrência, unidade e retentativas com serviços mockados.
- **Critérios de aceite:**
  - Entrada em branco não chama geocoding; entrada válida chega aparada e preserva acentos, pontuação e espaços internos.
  - Seleção chama forecast com coordenadas exatas da cidade; busca nova limpa os dados anteriores.
  - Resposta resolvida fora de ordem não altera o estado da operação mais recente.
  - Retentativas repetem nome/coordenadas originais; mudar unidade não chama serviço.
  - `pnpm test -- tests/hooks/useWeather.test.ts` conclui sem falhas.
- **Dependências:** T-07.
- **Arquivos prováveis:** `tests/hooks/useWeather.test.ts`
- **Rastreabilidade:** FR1, FR2, FR5–FR7; AC1.1, AC1.2, AC2.2, AC5.3, AC6.2, AC7.2–AC7.5.
- **Tipo:** Test

### T-21 — Testar o formulário de busca

- **Descrição:** Testar validação, submissão por botão/Enter e acessibilidade do formulário.
- **Critérios de aceite:**
  - Testes verificam uma chamada da ação por submissão válida via botão e via Enter.
  - Campo vazio ou somente espaços mostra erro associado e resulta em zero chamadas.
  - Campo e mensagem são encontrados por role/nome acessível.
  - `pnpm test -- tests/components/SearchForm.test.tsx` conclui sem falhas.
- **Dependências:** T-08.
- **Arquivos prováveis:** `tests/components/SearchForm.test.tsx`
- **Rastreabilidade:** FR1; AC1.1, AC1.2; NFR3.
- **Tipo:** Test

### T-22 — Testar seleção de cidades

- **Descrição:** Testar rótulos, distinção de homônimos e seleção por teclado.
- **Critérios de aceite:**
  - Fixture com cidades homônimas produz rótulos distintos, incluindo coordenadas quando os outros campos não bastam.
  - Cada opção expõe metadados disponíveis e chama a ação com a cidade correta.
  - Teste de teclado ativa uma opção e verifica os dados selecionados.
  - `pnpm test -- tests/components/CityResults.test.tsx` conclui sem falhas.
- **Dependências:** T-09.
- **Arquivos prováveis:** `tests/components/CityResults.test.tsx`
- **Rastreabilidade:** FR2; AC1.3, AC2.1, AC2.2; NFR3.
- **Tipo:** Test

### T-23 — Testar apresentação do clima atual

- **Descrição:** Testar conteúdo exibido para clima atual válido e indisponível.
- **Critérios de aceite:**
  - Fixture com `20 °C` e código WMO válido verifica localização, descrição e temperatura/unidade renderizadas.
  - Fixture sem `current` verifica que temperatura e condição atuais não aparecem como válidas.
  - `pnpm test -- tests/components/CurrentWeather.test.tsx` conclui sem falhas.
- **Dependências:** T-10.
- **Arquivos prováveis:** `tests/components/CurrentWeather.test.tsx`
- **Rastreabilidade:** FR3, FR5, FR6; AC3.1, AC5.2, AC6.4; NFR5, NFR8.
- **Tipo:** Test

### T-24 — Testar apresentação da previsão

- **Descrição:** Testar ordem, conteúdo e apresentação parcial da lista de previsão.
- **Critérios de aceite:**
  - Fixture completa verifica cinco dias consecutivos D–D+4 em ordem e os campos de cada dia.
  - Fixture parcial verifica ausência de dia incompleto/duplicado e `role="status"` com aviso de previsão incompleta.
  - `pnpm test -- tests/components/DailyForecast.test.tsx` conclui sem falhas.
- **Dependências:** T-11.
- **Arquivos prováveis:** `tests/components/DailyForecast.test.tsx`
- **Rastreabilidade:** FR4, FR6; AC4.1–AC4.3, AC6.4; NFR3, NFR5, NFR8.
- **Tipo:** Test

### T-25 — Testar o controle de unidade

- **Descrição:** Testar unidade inicial, mudança de seleção e semântica acessível.
- **Critérios de aceite:**
  - O teste verifica Celsius selecionado ao montar e Fahrenheit selecionável.
  - Selecionar Fahrenheit chama a ação uma vez e atualiza a unidade selecionada acessível.
  - `pnpm test -- tests/components/TemperatureUnitToggle.test.tsx` conclui sem falhas.
- **Dependências:** T-12.
- **Arquivos prováveis:** `tests/components/TemperatureUnitToggle.test.tsx`
- **Rastreabilidade:** FR5; AC5.1, AC5.3; NFR3.
- **Tipo:** Test

### T-26 — Testar componentes nos estados loading, erro e vazio

- **Descrição:** Renderizar o componente principal com dependências mockadas e verificar os estados de loading, busca vazia e erro com Testing Library.
- **Critérios de aceite:**
  - Uma promise pendente de geocoding ou forecast mantém `role="status"` com mensagem de carregamento; ao resolver, a mensagem de loading desaparece.
  - Geocoding resolvido com lista vazia apresenta `Nenhuma cidade encontrada` em `role="status"` e não apresenta resultados anteriores.
  - Service rejeitado apresenta `Não foi possível concluir a consulta` em `role="alert"` e botão `Tentar novamente`; nova falha mantém ambos e sucesso remove o alerta.
  - Resposta parcial preserva seção válida e informa seção indisponível sem renderizar dado incompleto.
  - `pnpm test -- tests/App.test.tsx` conclui sem falhas.
- **Dependências:** T-14.
- **Arquivos prováveis:** `tests/App.test.tsx`
- **Rastreabilidade:** FR6, FR7; AC6.1–AC6.5, AC7.1, AC7.4, AC7.5; NFR3–NFR5.
- **Tipo:** Test

### T-27 — Validar fluxos ponta a ponta

- **Descrição:** Implementar cenários E2E determinísticos com APIs interceptadas e verificar fluxo principal, falhas e responsividade.
- **Critérios de aceite:**
  - Cenário principal busca cidade, seleciona homônimo, verifica clima/previsão e alterna unidade sem request adicional.
  - O fluxo principal completo é executado em viewport desktop de 1280 px e mobile de 320 px, usando as mesmas respostas de API interceptadas.
  - Cenários verificam busca sem resultados, falha de geocoding com retentativa, falha de forecast com retentativa e resposta parcial.
  - Nos viewports 320, 768 e 1280 px, `scrollWidth <= innerWidth`; controles não se sobrepõem e funcionam por teclado com foco visível.
  - Todos os requests Open-Meteo são interceptados; testes não dependem de serviço externo.
  - `pnpm test:e2e` conclui sem falhas nos navegadores configurados; navegadores não executados são identificados.
- **Dependências:** T-14, T-15, T-16, T-17, T-18, T-19, T-20, T-21, T-22, T-23, T-24, T-25, T-26.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`
- **Rastreabilidade:** FR1–FR7; AC1.1–AC7.5; NFR1–NFR8.
- **Tipo:** Test

## Entrega 7 — Hardening

### T-28 — Executar gates e revisar acessibilidade

- **Descrição:** Executar gates do repositório e registrar verificações manuais de acessibilidade e compatibilidade.
- **Critérios de aceite:**
  - `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` retornam código de saída zero.
  - Revisão WCAG 2.2 AA registra teclado, nomes acessíveis, foco visível, mensagens que não dependem só de cor e contraste mínimo 4.5:1 para texto normal e 3:1 para texto grande/componentes aplicáveis.
  - Matriz registra pass/fail/bloqueado para navegadores suportados; indisponibilidade de dispositivos reais (iOS Safari/Android Chrome) é anotada, não presumida como aprovação.
- **Dependências:** T-27.
- **Arquivos prováveis:** `src/`, `tests/`
- **Rastreabilidade:** NFR1, NFR3, NFR6; AC6.1–AC6.4.
- **Tipo:** Infra
