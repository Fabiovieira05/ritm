# Cor personalizada e aviso de descanso

Versão Android de teste `1.3.9-personal.3.accent-rest-test.4`, preparada em 6 de novembro de 2026. Identificador `local.opengym.personal.test`.

## Aparência

Em Configurações → Aparência → Cor personalizada, use o seletor visual ou digite uma cor e toque em Salvar. O campo aceita HEX, RGB e RGBA, por exemplo `#4E96FF`, `rgb(78, 150, 255)` e `rgba(78, 150, 255, 0.8)`. A transparência é combinada com o fundo do tema. Quando necessário, o tom aplicado é ajustado para obter contraste com o fundo e os cartões. A preferência guarda o valor escolhido, e a mesma paleta é aplicada ao temporizador nativo.

Os ícones de navegação comuns das Configurações usam o destaque. Ações destrutivas usam vermelho de alerta. Os oito atalhos de cor continuam disponíveis.

## Descanso com a tela bloqueada

A decisão de usar o aviso nativo considera a atividade retomada, o estado interativo e a tela de bloqueio. O temporizador é armado antes do diálogo de permissão de notificações. No fim do descanso, o serviço permanece ativo durante o toque, e o áudio usa a saída de mídia com foco temporário que permite reduzir o volume da música. A reprodução aguarda o avanço do áudio antes de liberar o foco. O encerramento de um aviso verifica o horário do descanso para evitar parar um temporizador mais novo. O sinal depende da opção Sons e da concessão de foco pelo Android.

Referência do Android para foco de áudio e redução temporária de volume. https://developer.android.com/media/optimize/audio-focus

## Validação

- 57 testes de temporizador, ponte nativa, pausa, configurações e traduções aprovados nas verificações direcionadas. Compilação do APK, assinatura e 16 testes unitários Android verificados. Inclui conversão de cor RGBA para a notificação e rejeição de componentes inválidos.
- Prévia local com o fluxo real das Configurações. Verificados ícones com vermelho, aplicação de RGBA e persistência após recarregar.
- Teste no aparelho pendente. Com Sons ligado, reproduza música no fone, inicie um descanso curto e bloqueie a tela. Confira se o toque chega ao fone no fim do tempo e se o volume da música retorna depois.
