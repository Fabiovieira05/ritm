# Tela mais limpa — segunda etapa

- O botão flutuante do assistente passa a respeitar a opção de desligar a IA neste dispositivo (`coachLocal.mode = off`). A alteração reage imediatamente; ao reativar a IA, o atalho volta.
- O aviso permanente de uso local sem servidor deixa de aparecer na versão móvel. O espaço reservado no topo também é removido. Conectar ao servidor continua disponível nas configurações.
- Alertas de falha de sincronização, autenticação e alterações aguardando envio continuam disponíveis para quem usa servidor. O indicador de visitante da versão web foi preservado.
- O cartão do assistente no início não foi removido nesta etapa: a solicitação foi aplicada ao botão flutuante ao lado de Começar.
- Nenhuma alteração em cálculos, registros, backups, provedores de IA ou preferências já salvas. A escolha de desligar a IA continua sendo armazenada pelo fluxo existente.

## Validação em 31 de outubro de 2026

26 testes de TabBar e SyncBanner aprovados, incluindo desligar e reativar a IA, preservar Começar, ocultar o aviso local e limpar o espaço do topo. Os testes de falhas reais de sincronização continuam aprovados. Compilações Vite e Android concluídas; 16 testes unitários nativos aprovados. Conferência no navegador usando o controle real “Desligar o Treinador neste celular”: o atalho flutuante desapareceu e o início ficou sem a faixa de conexão. Não foram usados dados reais do celular.

Versão Android de teste: `1.3.9-personal.3.clean-test.3`, identificador `local.opengym.personal.test`, com a mesma assinatura das cópias anteriores. A instalação física ainda precisa de conferência; o RITM original não foi substituído nem desinstalado. Não há publicação de APK como release.
