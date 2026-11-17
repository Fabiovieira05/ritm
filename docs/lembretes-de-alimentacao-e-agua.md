# Lembretes de refeições, água e fim do descanso

Versão de teste 1.3.9-personal.3.reminders-test.5. O APK usa o identificador da cópia RITM Teste BR.

## Refeições

Em Alimentação → Lembretes de alimentação e água, habilite Lembretes de refeições e conceda permissão de notificação ao RITM no Android. Na aba Plano alimentar, escolha o plano ativo e use o lápis de cada refeição para ajustar seu horário. Itens sem hora ficam fora da agenda. Ao tocar no aviso, o RITM seleciona o plano e a data do aviso e posiciona a tela na refeição, com os alimentos, quantidades e notas. Se o plano tiver uma exceção por data, ela prevalece sobre a agenda padrão.

O RITM agenda uma janela de sete dias e a renova ao voltar ao aplicativo ou alterar os dados. A hora de entrega depende do Android e pode atrasar em economia de bateria. O Android deste aparelho agenda e entrega os avisos. Referência: https://developer.android.com/develop/background-work/services/alarms

## Água

Habilite Lembrete de água na mesma seção. A estimativa inicial usa o peso mais recente e um fator ajustável de 30 ml por kg. Em perfis com libras, o aplicativo converte o peso para kg antes do cálculo. As metas de cada aviso são acumuladas: um terço, dois terços e o total diário. O aplicativo calcula a meta de planejamento e depende do usuário para acompanhar o que já bebeu.

Com a hora de dormir às 23h e duas horas de antecedência, os avisos ficam em 12h, 18h e 21h. É possível escolher duas ou três horas de antecedência. Se a pessoa dormir mais cedo, os lembretes anteriores são antecipados quando necessário. Horários de dormir antes das 6h são tratados como madrugada do dia seguinte, com último aviso até 23h59 do dia da meta. A antecedência organiza os lembretes e deve ser ajustada à rotina.

## Descanso

O áudio nativo estático ainda não contém dados logo após a criação. A versão anterior saía antes de gravar a amostra de áudio. Agora o RITM copia a amostra e verifica o estado pronto antes de iniciar a reprodução. A opção Sons e o foco de áudio do Android continuam governando o aviso. Referência: https://developer.android.com/reference/android/media/AudioTrack

Passaram 56 testes direcionados e 16 testes unitários Android. A cobertura automatizada inclui a seleção do plano, exceção por data, refeição já registrada, rota do aviso e metas para perfis em libras, horários antecipados e sono após a meia-noite. O teste físico pendente é receber o aviso com tela bloqueada e música no fone, além de tocar numa notificação de refeição e confirmar a abertura do cartão.
