# RITM — preparação e português brasileiro

## Origem

- Repositório: https://github.com/blizzardsnake/ritm
- Release: `ritm-v1.3.9-personal.3`, branch de origem `personal`.
- Commit da tag e da branch na consulta: `95f41277c46ae34f2c66142d09ae61ccf9a0bd98`.
- APK original baixado e conferido: SHA-256 `109302151e6bcaf1e260ce51ee0112ba6092c8466aa543f272ebb94bd392326a`, igual ao publicado na release.
- Branch local das alterações: `fabio/pt-br-personal-3`. Nenhuma alteração enviada ao GitHub.

## O que existe

O aplicativo usa React 19, Vite, Zustand e Capacitor 7, não Flutter. As telas estão em `frontend/src/views`, os componentes em `frontend/src/components`, os dados em `frontend/src/store` e as funções de cálculo em `frontend/src/lib`. O projeto Android está em `frontend/android`. O servidor Node em `api` é opcional para a versão móvel local.

A interface original já tinha português BR. As telas da edição pessoal herdavam inglês quando não havia tradução; isso causava a mistura de “Your day” com uma data brasileira. A primeira alteração foi traduzir esse título para “Seu dia” e completar os textos da edição pessoal. Não foram alterados cálculos, exercícios, instruções de exercícios, nomes de alimentos ou registros existentes.

## Alterações

- Traduções brasileiras de início, alimentação, plano alimentar, metas, progresso, recuperação, assistente, privacidade, atualizações e criadores.
- Textos fixos do assistente e dos créditos passaram pelo sistema de tradução. A opção de tentar novamente também recebeu tradução.
- A abreviação de gorduras passou de F para G. A unidade visual em cirílico “100 г” passou a usar a unidade do idioma. Os valores nutricionais permanecem iguais.
- Nomes dos canais de notificações de descanso em português brasileiro. Esses recursos nativos seguem o idioma do Android.
- Cópia de teste: `local.opengym.personal.test`, nome “RITM Teste BR”, versão `1.3.9-personal.3.ptbr-test.1`. A assinatura de depuração é independente da assinatura do autor.

## Dados e backup

O aplicativo atual usa `local.opengym.personal`. A cópia de teste usa outro identificador, portanto mantém arquivos privados e armazenamento separados. Nenhum aplicativo foi desinstalado, substituído ou conectado ao perfil do usuário durante esta preparação.

1. No RITM atual, abra Configurações → Dados → Exportar backup (JSON). Se houver fotos ou vídeos, use também a opção de exportação que os inclui.
2. Guarde o arquivo fora do aplicativo e mantenha uma cópia intacta.
3. Instale somente o APK identificado como “RITM Teste BR”. Confira que os dois ícones existem.
4. Selecione Configurações → Idioma → Português (Brasil), se necessário. Importe o backup exclusivamente na cópia de teste: a importação pode substituir todo o conteúdo dessa cópia. Confira os treinos, pesagens, refeições, receitas e planos antes de passar a usá-la.

O backup automático salva cópias datadas em Documents/openGym e mantém as 14 mais recentes. As duas instalações podem usar esse destino de documentos; durante o primeiro teste mantenha o backup automático desligado na cópia e guarde uma exportação manual com nome próprio. Não conecte a cópia ao mesmo servidor antes de decidir como tratar a sincronização.

A migração pessoal continua na versão de esquema 1. Não foi criada migração nem alterado o formato de exportação. O código rejeita esquemas futuros que não entende. Os testes usam dados fictícios; o conteúdo real do celular não foi acessado e sua restauração ainda exige conferência no aparelho.

## Segurança e licenças

O projeto possui proteção local opcional por senha e biometria, armazenamento seguro de chave de API no Android e validações de assinatura, identificador e integridade para atualizações. A proteção da interface não criptografa o backup exportado. Solicitações de IA enviam o relatório ao OpenRouter e ao provedor do modelo após a ação e o consentimento; os testes locais não enviaram diários nem chaves a esses serviços. A cópia de teste não atende aos requisitos de assinatura e identificador do atualizador da versão original, que rejeita sua atualização por esse canal.

`npm audit` apontou 24 alertas herdados: 8 moderados, 12 altos e 4 críticos. Há alerta crítico direto em `@capacitor/android` sobre carregamento de conteúdo remoto na origem do aplicativo pelo proxy HTTP interno; também há um em `@capacitor/ios`, e alertas transitivos em `handlebars` e `tar`. Isso é um inventário de dependências, não uma demonstração de exploração neste aplicativo. O arquivo de dependências não foi atualizado nesta tarefa de tradução. A correção dessas dependências precisa de uma etapa própria e testes de compatibilidade antes de considerar distribuição pública.

O código declara AGPL-3.0-or-later: preservar os avisos e a licença e disponibilizar o código correspondente ao distribuir uma versão modificada. A entrega local inclui o código-fonte e o patch. Consulte `LICENSE` e `NOTICE.md` para os termos integrais. Os mapas corporais têm atribuição MIT; os dados alimentares usam fontes USDA/CC0 e Open Food Facts/ODbL/DbCL; a fonte Manrope usa SIL OFL. As imagens e animações dos exercícios têm direitos de terceiros e o próprio projeto informa pendências de titularidade e permissões não transferíveis. Não foram baixadas para inclusão no APK nem acrescentadas novas imagens; o carregamento remoto existente foi preservado. Isso não estabelece uma nova licença para redistribuir essas mídias.

## Ferramentas

Git, Node 22 e npm já estavam disponíveis. Flutter e Dart não são necessários. Foram preparados JDK 21 portátil da Microsoft, SDK Android com plataforma 36, ferramentas 35.0.0 e Gradle 8.11.1 dentro da pasta de trabalho, sem configurar instalações globais. No Windows, o Java precisou de um caminho temporário ASCII, conforme a orientação de compilação do repositório.

Para reproduzir: `npm ci` em `frontend`, construir com `VITE_MOBILE=1` e `APP_BUILD=ptbr-test.1`, executar `cap sync android`, depois `gradlew.bat :app:assembleDebug :app:testDebugUnitTest`. Use as bases de mídia fixadas em `scripts/build-ritm.ps1`. Não use o script de publicação nem a assinatura do autor para esta cópia.

## Limites da tradução

As outras línguas foram preservadas. Nomes de exercícios, alimentos cadastrados, conteúdo de relatórios antigos, respostas geradas por IA, nomes próprios e textos integrais oficiais de licenças não foram reescritos. A conferência visual foi feita em navegador local; o comportamento nativo e a preservação dos seus dados reais precisam ser conferidos no aparelho. O resultado dos testes executados acompanha esta entrega.

## Validação em 31 de outubro de 2026

- APK original: versão, identificador, SHA-256 e certificado conferidos. O certificado corresponde ao configurado na release.
- Bateria geral: 3.353 testes passaram, 2 foram ignorados e 1 falhou na exigência de mesmas chaves para todos os idiomas. Essa regra foi ajustada com uma lista explícita das sete novas chaves exclusivas do português BR; as verificações de campos vazios, parâmetros e chaves compartilhadas foram mantidas.
- Após essa correção: 23 testes de idioma, verificação de idiomas, assistente e análise semanal passaram. Mais 18 testes de estatísticas passaram após traduzir os períodos. Não foi repetida toda a bateria geral; os testes afetados foram repetidos.
- Rodada específica inicial: 38 testes de idioma e nomes de exercícios passaram. A verificação final de textos-fonte encontrou 1.711 textos usados pelo sistema de tradução, todos presentes nos dicionários. Isso verifica presença, não qualidade linguística automática.
- Os testes gerais aprovados incluem cálculos de treino, nutrientes, receitas, planos alimentares, migração do esquema, importação/exportação, backup com mídia e mesclagem de registros. São testes com dados fictícios, sem usar o diário real.
- Android: 16 testes unitários nativos, zero falhas. Compilação final concluída com sucesso; os testes nativos foram reaproveitados sem mudança de código nativo.
- Assinatura final válida, esquema APK v2. Identificador extraído do APK: `local.opengym.personal.test`; nome extraído: `RITM Teste BR`; versão: `1.3.9-personal.3.ptbr-test.1`, código 10003. Mínimo Android 8 / API 26.
- SHA-256 do APK de teste: `e9a2953a3ee1c403f95676ade888423822f777d2db98cce79e8ba387d9684946`.
- Navegador local: início, idioma/configurações, diário alimentar, plano alimentar, assistente e estatísticas conferidos. Depois de recarregar, o idioma brasileiro foi mantido. As imagens entregues mostram dados vazios de teste.
- A compilação apresentou avisos existentes sobre importações dinâmicas, diretórios Gradle e versões de XML do SDK; os testes de interface também emitiram avisos React. Nenhum impediu a geração final.
- Não testado: instalação física, restauração do backup pessoal, Health Connect no celular, câmera, notificações reais, biometria e respostas de IA ao vivo. Nenhum aplicativo foi publicado ou instalado no celular.

Ferramentas oficiais consultadas: https://developer.android.com/studio e https://learn.microsoft.com/en-us/java/openjdk/download-major-urls .
