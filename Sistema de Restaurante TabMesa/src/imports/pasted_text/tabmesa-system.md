Crie um sistema completo de gerenciamento de restaurante chamado TabMesa.

O TabMesa é um sistema integrado para restaurantes que utiliza tablets instalados nas mesas para que os clientes possam consultar o cardápio e realizar pedidos. O sistema também possui uma área para cozinha, uma área para caixa e uma área administrativa para o Administrador (ADM).

O objetivo é criar uma solução completa, moderna e funcional, simulando um sistema real de restaurante.

O projeto deve ser criado em português do Brasil (PT-BR).

Não criar apenas wireframes. Criar uma interface de alta fidelidade, profissional, moderna e pronta para apresentação, com todos os fluxos principais conectados através de protótipo interativo.

1. NOME E IDENTIDADE DO SISTEMA
Nome do sistema:

TabMesa

Criar uma identidade visual própria para o TabMesa.

O sistema deve transmitir:

Tecnologia
Restaurante
Praticidade
Organização
Agilidade
Modernidade
Criar um logotipo simples para o TabMesa, podendo utilizar um símbolo relacionado a mesa, talheres, prato ou tablet.

Utilizar uma identidade visual elegante e profissional.

Sugestão de cores:

Cor primária: laranja queimado ou terracota
Cor secundária: vermelho suave
Fundo: branco e tons de bege/cinza claro
Texto principal: cinza muito escuro/preto
Verde: sucesso e disponibilidade
Amarelo: alerta e aguardando ação
Vermelho: erro, cancelamento e indisponibilidade
Azul: informações
Não exagerar nas cores. Manter aparência sofisticada e limpa.

2. OBJETIVO DO TABMESA
O TabMesa deverá integrar três áreas principais:

CLIENTE
→ realiza pedidos pelo tablet da mesa.

COZINHA
→ recebe os pedidos e atualiza o status do preparo.

CAIXA
→ acompanha as mesas, recebe solicitações de fechamento de conta e realiza o pagamento presencial.

ADMINISTRADOR
→ gerencia produtos, usuários, mesas, tablets, disponibilidade e demais configurações.

Todos esses módulos devem estar conectados.

Uma alteração realizada em um módulo deve refletir nos outros módulos quando fizer sentido.

Exemplo:

Cliente faz um pedido:
→ aparece na cozinha.

Cozinha marca como pronto:
→ cliente recebe atualização no tablet.

Cliente fecha a conta:
→ caixa recebe imediatamente a informação.

Caixa confirma o pagamento:
→ mesa passa para "Livre".

3. PERFIS DE USUÁRIO
O sistema deverá possuir três tipos principais de acesso:

Administrador (ADM)
Possui acesso completo ao sistema.

Pode:

Gerenciar usuários
Gerenciar produtos
Cadastrar produtos
Editar produtos
Excluir produtos
Alterar disponibilidade
Gerenciar mesas
Vincular tablets às mesas
Visualizar pedidos
Visualizar contas
Acompanhar pagamentos
Visualizar dashboard
Gerenciar configurações
Usuário comum / Cliente
Acessa o sistema exclusivamente pelo tablet instalado na mesa.

Pode:

Visualizar cardápio
Pesquisar produtos
Visualizar detalhes dos produtos
Adicionar produtos ao pedido
Alterar quantidades
Remover produtos antes da confirmação
Confirmar pedidos
Fazer novos pedidos durante a refeição
Acompanhar pedidos
Visualizar a conta
Fechar a conta
Não pode:

Alterar o número da mesa
Acessar outras mesas
Alterar preços
Alterar produtos
Alterar disponibilidade
Realizar pagamento diretamente pelo tablet
Cozinha
Possui acesso somente à interface de pedidos da cozinha.

Pode:

Visualizar novos pedidos
Visualizar pedidos em preparo
Iniciar preparo
Marcar pedido como pronto
Visualizar pedidos entregues
Atualizar status dos pedidos
4. REGRA FUNDAMENTAL — IDENTIFICAÇÃO DA MESA
Cada tablet deverá estar previamente cadastrado e vinculado a uma mesa específica.

O cliente não deverá digitar o número da mesa manualmente.

Exemplo:

Tablet cadastrado:

Tablet TB-012

Vinculado à:

Mesa 12

Quando o cliente abrir o sistema, o TabMesa deverá automaticamente identificar:

Mesa 12

O cliente não poderá alterar essa informação.

Isso evita erros de pedidos enviados para mesas incorretas.

Todo pedido realizado nesse tablet deverá obrigatoriamente possuir a seguinte informação:

Mesa: 12

5. TELA DE ABERTURA DO TABLET
Criar uma tela inicial elegante para o tablet.

Exibir:

Logo TabMesa

"Bem-vindo!"

"Você está na Mesa 12"

Mensagem:

"Faça seu pedido diretamente pelo tablet."

Botão:

"Ver cardápio"

Também disponibilizar acesso ao:

"Meu pedido"

e

"Minha conta"

O número da mesa deve aparecer sempre de maneira discreta, mas visível no topo da interface.

Exemplo:

TabMesa | Mesa 12

6. CARDÁPIO DO CLIENTE
Criar uma interface otimizada para touchscreen.

No topo:

Logo TabMesa
Mesa 12
Ícone de busca
Ícone do pedido
Valor atual da conta
Criar categorias horizontais ou em cards.

Categorias de exemplo:

Entradas
Pratos principais
Hambúrgueres
Massas
Pizzas
Saladas
Sobremesas
Bebidas
Cada produto deve possuir um card.

O card deverá conter:

Imagem
Nome
Descrição curta
Preço
Status
Botão "Adicionar"
Exemplo:

Hambúrguer TabMesa

Pão brioche, carne artesanal, queijo, alface e molho especial.

R$ 32,90

[Adicionar]

7. PRODUTO INDISPONÍVEL
Caso um produto esteja indisponível, o cliente deverá conseguir visualizar o produto, porém não poderá adicioná-lo.

Exibir:

Indisponível

O botão "Adicionar" deverá ficar desabilitado.

Exemplo:

Hambúrguer Especial

Indisponível no momento

O administrador será responsável por controlar essa disponibilidade.

Quando o administrador alterar um produto para indisponível, ele deverá automaticamente ficar indisponível também no tablet do cliente.

8. DETALHES DO PRODUTO
Ao clicar no produto, abrir uma página ou modal detalhado.

Mostrar:

Imagem
Nome
Descrição completa
Ingredientes
Preço
Quantidade
Botão "-"
Quantidade
Botão "+"
Botão "Adicionar ao pedido"
Exemplo:

Pizza TabMesa

Pizza artesanal com queijo, tomate, manjericão e molho especial.

R$ 49,90

Quantidade:

[-] 1 [+]

[Adicionar ao pedido]

9. CARRINHO
Criar uma tela chamada:

Meu pedido

Mostrar todos os produtos selecionados.

Cada item deverá possuir:

Nome
Imagem
Quantidade
Preço unitário
Subtotal
Botão +
Botão -
Botão remover
Exemplo:

Hambúrguer TabMesa
2 unidades
R$ 32,90 cada
Subtotal: R$ 65,80

Batata Frita
1 unidade
R$ 18,90

10. CÁLCULO DO TOTAL
O sistema deverá calcular automaticamente:

Subtotal dos produtos

Outros valores, caso existam

=

Total

O valor deverá ser atualizado imediatamente sempre que o cliente:

Adicionar produto
Remover produto
Aumentar quantidade
Diminuir quantidade
11. CONFIRMAÇÃO DO PEDIDO
Antes de enviar o pedido para a cozinha, apresentar uma tela de revisão.

Título:

Confira seu pedido

Mostrar:

Mesa: 12

Todos os produtos.

Quantidade.

Valores.

Total.

Na parte inferior, criar dois botões:

"Adicionar mais itens"

e

"Confirmar pedido"

Se o cliente clicar em "Adicionar mais itens", retornar ao cardápio.

Se clicar em "Confirmar pedido", enviar o pedido.

12. ENVIO DO PEDIDO
Após confirmar:

Mostrar uma tela de sucesso:

"Pedido enviado!"

"Seu pedido foi enviado para a cozinha."

Exibir:

Pedido #1024

Mesa 12

Total:

R$ 87,70

Botão:

"Acompanhar pedido"

13. PEDIDOS VINCULADOS À MESA
Essa é uma regra fundamental do sistema.

Todo pedido deverá possuir:

Número do pedido
Número da mesa
Tablet responsável
Data
Horário
Produtos
Quantidades
Valor
Status
O cliente nunca poderá escolher ou modificar a mesa.

Exemplo:

Pedido #1024

Mesa 12

Tablet TB-012

14. NOVOS PEDIDOS DURANTE A REFEIÇÃO
Depois de enviar um pedido, o cliente poderá continuar utilizando o tablet.

Adicionar um botão:

"+ Adicionar mais itens"

Caso o cliente faça outro pedido:

O novo pedido será associado automaticamente à mesma mesa.

Exemplo:

Pedido #1024
Mesa 12
R$ 87,70

Novo pedido #1025
Mesa 12
R$ 25,00

A conta total deverá automaticamente passar para:

R$ 112,70

Não criar uma nova mesa ou uma nova conta separada.

Todos os pedidos da mesma mesa devem compor a conta daquela mesa.

15. ACOMPANHAMENTO DOS PEDIDOS
Criar uma tela:

Acompanhar pedido

Utilizar uma timeline.

Estados:

Pedido enviado
Recebido pela cozinha
Em preparo
Pronto
Entregue
Exemplo:

✓ Pedido enviado

✓ Recebido pela cozinha

● Em preparo

○ Pronto

○ Entregue

O cliente deverá receber feedback visual quando o status mudar.

16. INTERFACE DA COZINHA
Criar uma interface específica para cozinha.

A interface deve ser simples, objetiva e fácil de visualizar durante o trabalho.

Criar um layout estilo Kanban.

Colunas:

Novos pedidos
Em preparo
Prontos
Entregues
Cada pedido deverá possuir um card.

Exemplo:

Pedido #1024

Mesa 12

21:15

2x Hambúrguer TabMesa

1x Batata Frita

2x Refrigerante

Botão:

"Iniciar preparo"

Depois:

"Marcar como pronto"

Depois:

"Entregue"

17. SINCRONIZAÇÃO COM O CLIENTE
Quando a cozinha alterar o status do pedido, o tablet deverá refletir a alteração.

Exemplo:

Cozinha:

Pedido #1024 → Pronto

Tablet:

"Seu pedido está pronto! ✓"

Isso deverá acontecer automaticamente no protótipo através das conexões entre as telas.

18. MINHA CONTA
Criar uma área:

Minha conta

Mostrar:

Mesa 12

Pedidos realizados:

Pedido #1024
R$ 87,70

Pedido #1025
R$ 25,00

Total:

R$ 112,70

A conta deverá permanecer atualizada durante toda a refeição.

Se o cliente fizer outro pedido:

Total:

R$ 112,70

↓

Novo pedido:

R$ 18,90

↓

Total atualizado: R$ 131,60

19. REGRA IMPORTANTE — FECHAR CONTA NÃO É PAGAR
Essa regra deve ser representada claramente no sistema.

O cliente NÃO fará o pagamento pelo tablet.

O botão:

"Fechar conta"

significa apenas que o cliente terminou a refeição e está solicitando o fechamento da conta.

O pagamento será realizado presencialmente no caixa do restaurante.

Portanto, o fluxo será:

Fechar conta

→

Avisar o caixa

→

Cliente vai até o caixa

→

Caixa confere a conta

→

Cliente realiza o pagamento

→

Caixa confirma o pagamento

→

Mesa é liberada

20. BOTÃO "FECHAR CONTA"
Na tela "Minha conta", criar um botão grande e destacado:

Fechar conta

Ao clicar, abrir um modal de confirmação.

Título:

Fechar conta?

Mensagem:

"Você está encerrando seu consumo nesta mesa."

"Após fechar a conta, não será possível realizar novos pedidos pelo tablet."

"Dirija-se ao caixa para realizar o pagamento."

Botões:

Voltar

Sim, fechar conta

21. CLIENTE FECHA A CONTA
Quando o cliente clicar em:

"Sim, fechar conta"

o sistema deverá:

Encerrar a possibilidade de novos pedidos.
Alterar o status da mesa para "Aguardando pagamento".
Registrar o horário do fechamento.
Registrar o valor final da conta.
Enviar a informação para o sistema do caixa.
Exibir uma confirmação no tablet.
Tela:

Conta fechada com sucesso! ✓

Mesa 12

Conta #1024

Valor:

R$ 131,60

Status:

Aguardando pagamento

Mensagem:

"Agora dirija-se ao caixa para realizar o pagamento."

"Estamos te esperando! 😊"

22. ÁREA DO CAIXA
Criar uma área específica para o caixa.

Essa área deverá mostrar em tempo real as mesas e seus respectivos estados.

Criar quatro estados principais:

Livre
Mesa disponível.

Em refeição
Cliente está utilizando a mesa e possui pedidos ativos.

Aguardando pagamento
Cliente fechou a conta e está indo ao caixa.

Pago
Pagamento concluído.

23. PAINEL DO CAIXA
Criar uma tela chamada:

Caixa

No topo:

Total de mesas
Mesas ocupadas
Aguardando pagamento
Pagamentos realizados
Criar uma lista ou grade das mesas.

Exemplo:

Mesa 01
Livre

Mesa 02
Em refeição

Mesa 03
Aguardando pagamento

Mesa 04
Em refeição

Mesa 05
Pago

Usar cores diferentes para cada estado.

24. NOTIFICAÇÃO PARA O CAIXA
Quando um cliente clicar em:

"Fechar conta"

o caixa deverá receber uma notificação.

Criar uma notificação visual:

🔔

Nova conta aguardando pagamento

Mesa 12

Conta #1024

Total:

R$ 131,60

Horário:

21:45

Botão:

"Abrir conta"

A notificação deverá chamar atenção, mas sem ser exagerada.

25. CONTA NO CAIXA
Quando o operador clicar em "Abrir conta", apresentar todos os detalhes.

Mostrar:

Mesa 12

Conta #1024

Horário de abertura:

19:32

Horário de fechamento:

21:45

Pedidos:

Pedido #1024

2x Hambúrguer TabMesa — R$ 65,80
1x Batata Frita — R$ 18,90
Pedido #1025

2x Refrigerante — R$ 20,00
1x Sobremesa — R$ 26,90
Total:

R$ 131,60

26. PAGAMENTO PRESENCIAL
Criar uma seção:

Pagamento

Valor total:

R$ 131,60

Forma de pagamento:

Dinheiro
Cartão de débito
Cartão de crédito
PIX
Criar um campo para selecionar a forma de pagamento.

Botão:

"Confirmar pagamento"

Importante:

O sistema deve deixar claro que o pagamento está sendo registrado pelo operador do caixa após o cliente realizar o pagamento presencialmente.

27. PAGAMENTO CONCLUÍDO
Após o caixa clicar em:

"Confirmar pagamento"

mostrar uma confirmação:

Pagamento realizado com sucesso! ✓

Conta #1024

Mesa 12

Valor pago:

R$ 131,60

Forma de pagamento:

PIX

O sistema deverá:

Marcar a conta como paga
Registrar o pagamento
Liberar a mesa
Alterar status da mesa para "Livre"
Encerrar o atendimento
Registrar a transação no histórico
28. MESA LIVRE
Depois que o pagamento for concluído:

Mesa 12

Status:

🟢 Livre

O tablet deverá retornar para uma tela de espera ou tela inicial.

Exemplo:

TabMesa

"Esta mesa está disponível."

"Bem-vindo!"

A mesa estará pronta para um novo cliente.

29. DASHBOARD DO ADMINISTRADOR
Criar um dashboard completo.

Título:

Dashboard

Mensagem:

"Visão geral do restaurante"

Cards:

Mesas ocupadas
12

Mesas livres
8

Aguardando pagamento
3

Pedidos em andamento
7

Faturamento do dia
R$ 4.582,90

Produtos indisponíveis
5

Criar gráficos:

Faturamento
Quantidade de pedidos
Produtos mais vendidos
Ocupação das mesas
30. LOGIN DO ADMINISTRADOR
Criar tela de login.

Logo TabMesa.

Título:

Acesso administrativo

Campos:

E-mail ou usuário

Senha

Checkbox:

"Manter conectado"

Botão:

Entrar

Link:

"Esqueci minha senha"

Criar estados de:

Login correto
Senha incorreta
Campo obrigatório
Carregamento
31. MENU ADMINISTRATIVO
Criar sidebar no desktop.

Itens:

Dashboard
Mesas
Pedidos
Cardápio
Usuários
Tablets
Caixa
Relatórios
Configurações
Sair
O menu deverá ser consistente em todas as páginas administrativas.

32. GERENCIAMENTO DE CARDÁPIO
Criar página:

Cardápio

Criar botão:

+ Novo produto

Tabela:

Produto

Categoria

Descrição

Preço

Disponibilidade

Ações

Exemplo:

Hambúrguer TabMesa
Hambúrgueres
R$ 32,90
Disponível

Ações:

Visualizar
Editar
Excluir
33. CADASTRO DE PRODUTO
Criar formulário:

Novo produto

Campos:

Nome

Tipo/Categoria

Descrição

Valor

Também permitir:

Imagem do produto

Disponibilidade

Botões:

Cancelar

Salvar produto

Após salvar:

Produto cadastrado com sucesso! ✓

34. EDITAR PRODUTO
Criar formulário semelhante ao cadastro.

Permitir alterar:

Nome
Categoria
Descrição
Valor
Imagem
Disponibilidade
Botão:

Salvar alterações

35. PRODUTO INDISPONÍVEL PELO ADMINISTRADOR
Na tabela do cardápio, adicionar um Toggle:

Disponível / Indisponível

Exemplo:

Hambúrguer Especial

🟢 Disponível

Ao clicar:

🔴 Indisponível

Mostrar confirmação:

"Deseja deixar este produto indisponível?"

Após confirmar:

"Produto marcado como indisponível."

O produto deverá imediatamente aparecer como indisponível no tablet do cliente.

36. GERENCIAMENTO DE USUÁRIOS
Criar página:

Usuários

Tabela:

Nome

E-mail

Perfil

Status

Data de cadastro

Ações

Perfis:

Administrador
Usuário comum
Cozinha
Ações:

Adicionar
Editar
Visualizar
Excluir
Ativar
Desativar
37. CADASTRO DE USUÁRIO
Campos:

Nome completo

E-mail

Senha

Confirmar senha

Perfil

Status

Botões:

Cancelar

Cadastrar usuário

38. GERENCIAMENTO DE MESAS
Criar página:

Mesas

Mostrar todas as mesas.

Cada card ou linha deverá apresentar:

Número da mesa

Tablet vinculado

Status

Cliente/pedido atual

Valor da conta

Ações

Exemplo:

Mesa 12

Tablet TB-012

Status:

🟡 Aguardando pagamento

Conta:

R$ 131,60

39. CADASTRO DE TABLETS
Criar página:

Tablets

Mostrar:

ID do tablet

Mesalica vinculada

Status

Última conexão

Ações

Exemplo:

TB-012

Mesa 12

Online

Conectado

Permitir:

Cadastrar tablet
Vincular tablet à mesa
Alterar vínculo
Ativar tablet
Desativar tablet
40. REGRA DE VÍNCULO TABLET + MESA
Um tablet deve possuir uma mesa específica.

Exemplo:

TB-001 → Mesa 01

TB-002 → Mesa 02

TB-012 → Mesa 12

O cliente não poderá alterar essa associação.

O pedido deverá herdar automaticamente essa informação.

41. GERENCIAMENTO DE PEDIDOS
Criar página administrativa:

Pedidos

Mostrar:

Número

Mesa

Horário

Valor

Status

Ações

Status:

Novo
Recebido
Em preparo
Pronto
Entregue
Cancelado
Permitir visualizar detalhes do pedido.

42. HISTÓRICO
Criar uma área de histórico para:

Pedidos
Pagamentos
Contas
Mesas
Produtos
Criar filtros por:

Data
Mesa
Status
Forma de pagamento
43. RELATÓRIOS
Criar uma página:

Relatórios

Exibir:

Vendas do dia
Vendas da semana
Vendas do mês
Produtos mais vendidos
Quantidade de pedidos
Formas de pagamento
Faturamento
Utilizar gráficos e tabelas.

44. ESTADOS DAS MESAS
Padronizar os estados.

Livre
Cor verde.

A mesa está disponível.

Em refeição
Cor azul.

Existe um cliente consumindo.

Aguardando pagamento
Cor amarela/laranja.

Cliente fechou a conta e precisa pagar.

Pago
Cor verde/azul.

Pagamento concluído.

Indisponível
Cor vermelha/cinza.

Mesa temporariamente indisponível.

45. FLUXO COMPLETO DO SISTEMA
Criar um protótipo navegável demonstrando exatamente este fluxo:

ETAPA 1 — CLIENTE
Tablet abre.

Sistema identifica:

Mesa 12

Cliente acessa o cardápio.

↓

Escolhe um produto.

↓

Seleciona quantidade.

↓

Adiciona ao pedido.

↓

Continua navegando.

↓

Visualiza o carrinho.

↓

Confirma o pedido.

ETAPA 2 — COZINHA
Pedido aparece automaticamente na cozinha.

Exemplo:

Pedido #1024

Mesa 12

↓

Cozinha recebe.

↓

Cozinha inicia preparo.

↓

Status:

Em preparo

↓

Cozinha finaliza.

↓

Status:

Pronto

↓

Cliente recebe atualização no tablet.

ETAPA 3 — NOVO PEDIDO
Cliente continua na mesa.

Clica:

Adicionar mais itens

↓

Seleciona novo produto.

↓

Confirma novo pedido.

↓

Novo pedido é enviado à cozinha.

↓

Conta da mesa é atualizada automaticamente.

ETAPA 4 — FECHAR CONTA
Cliente acessa:

Minha conta

↓

Confere o valor.

↓

Clica:

Fechar conta

↓

Sistema mostra confirmação.

↓

Cliente confirma.

↓

Mesa muda para:

Aguardando pagamento

↓

Tablet bloqueia novos pedidos.

ETAPA 5 — CAIXA
Caixa recebe:

🔔 Nova conta aguardando pagamento

Mesa 12

Total:

R$ 131,60

↓

Operador abre a conta.

↓

Confere os pedidos.

↓

Cliente chega fisicamente ao caixa.

↓

Cliente realiza o pagamento.

↓

Operador seleciona a forma de pagamento.

↓

Clica:

Confirmar pagamento

ETAPA 6 — FINALIZAÇÃO
Sistema mostra:

Pagamento realizado com sucesso!

↓

Conta:

Paga

↓

Mesa:

Livre

↓

Tablet retorna para tela inicial.

↓

Mesa está disponível para o próximo cliente.

46. REGRAS DE NEGÓCIO IMPORTANTES
Implementar visualmente e através do protótipo as seguintes regras:

O tablet sempre estará vinculado a uma mesa.

O cliente não poderá escolher o número da mesa.

Todo pedido será automaticamente vinculado à mesa.

O cliente poderá realizar vários pedidos durante a refeição.

Todos os pedidos da mesma mesa deverão compor a conta da mesa.

O valor da conta será atualizado automaticamente após novos pedidos.

Produtos indisponíveis não poderão ser adicionados.

O administrador controla a disponibilidade dos produtos.

A cozinha recebe os pedidos realizados pelos clientes.

A cozinha pode atualizar o status dos pedidos.

O cliente poderá acompanhar o status do pedido.

O cliente poderá fechar a conta pelo tablet.

Fechar a conta NÃO significa realizar o pagamento.

Ao fechar a conta, a mesa ficará "Aguardando pagamento".

O caixa receberá automaticamente uma notificação.

O cliente deverá ir fisicamente ao caixa.

O pagamento será registrado pelo operador do caixa.

Somente depois do pagamento confirmado a mesa ficará "Livre".

Depois de fechar a conta, o cliente não poderá realizar novos pedidos.

Depois que a conta for paga, o atendimento será encerrado.

47. RESPONSIVIDADE
Criar duas experiências principais.

Tablet
Utilizado pelo cliente.

Priorizar:

Touchscreen
Botões grandes
Navegação simples
Fotos dos produtos
Poucos elementos por tela
Textos legíveis
Ações rápidas
Desktop
Utilizado por:

Administrador
Caixa
Cozinha
Priorizar:

Sidebar
Tabelas
Cards
Dashboards
Gráficos
Kanban
Informações detalhadas
48. COMPONENTES
Criar componentes reutilizáveis no Figma.

Componentes:

Botões
Inputs
Selects
Dropdowns
Cards
Cards de produtos
Cards de pedidos
Cards de mesas
Tabelas
Modais
Alertas
Toasts
Badges
Toggles
Menus
Sidebar
Header
Tabs
Status
Timeline
Loading
Empty states
Criar estados:

Default
Hover
Pressed
Disabled
Loading
Success
Error
Warning
49. EXPERIÊNCIA VISUAL
O sistema deverá parecer um produto SaaS profissional utilizado por restaurantes reais.

Evitar aparência de projeto escolar simples.

Utilizar:

Espaçamento consistente
Grid
Hierarquia visual
Tipografia moderna
Ícones consistentes
Cards bem organizados
Sombras suaves
Bordas discretas
Microinterações
Feedback visual
Utilizar textos reais de exemplo em português.

Não utilizar Lorem Ipsum.

50. DADOS FICTÍCIOS
Utilizar dados fictícios realistas para demonstrar o sistema.

Exemplos de produtos:

Hambúrguer TabMesa — R$ 32,90
Batata Frita Especial — R$ 18,90
Pizza Margherita — R$ 49,90
Massa Alfredo — R$ 42,90
Refrigerante — R$ 7,00
Suco Natural — R$ 9,90
Brownie com Sorvete — R$ 19,90
Mesas:

01 a 20.

Tablets:

TB-001 a TB-020.

Criar alguns pedidos fictícios para preencher a cozinha e o caixa.

51. NOTIFICAÇÕES E FEEDBACK
Criar feedback visual para ações importantes.

Exemplos:

Produto adicionado
"Produto adicionado ao pedido."

Pedido enviado
"Pedido enviado para a cozinha."

Pedido pronto
"Seu pedido está pronto!"

Produto indisponível
"Este produto está indisponível no momento."

Conta fechada
"Sua conta foi fechada. Dirija-se ao caixa para realizar o pagamento."

Nova conta no caixa
"A Mesa 12 solicitou o fechamento da conta."

Pagamento realizado
"Pagamento realizado com sucesso!"

Mesa liberada
"A Mesa 12 está livre."

52. TELAS FINAIS OBRIGATÓRIAS
Criar todas estas telas:

CLIENTE / TABLET
Tela inicial
Identificação automática da mesa
Cardápio
Categorias
Busca
Detalhes do produto
Carrinho
Confirmação do pedido
Pedido enviado
Acompanhamento do pedido
Novo pedido
Minha conta
Confirmação de fechamento da conta
Conta fechada
Aguardando pagamento
Pagamento concluído
Mesa liberada
COZINHA
Login cozinha
Dashboard cozinha
Novos pedidos
Pedido em preparo
Pedido pronto
Pedidos entregues
Histórico
CAIXA
Dashboard caixa
Mesas
Contas aguardando pagamento
Notificação de nova conta
Detalhes da conta
Seleção de pagamento
Confirmação de pagamento
Pagamento concluído
Histórico de pagamentos
ADMINISTRADOR
Login
Dashboard
Usuários
Cadastro de usuário
Edição de usuário
Cardápio
Cadastro de produto
Edição de produto
Mesas
Cadastro de mesa
Tablets
Cadastro/vinculação de tablet
Pedidos
Detalhes do pedido
Relatórios
Histórico
Configurações
53. PROTÓTIPO INTERATIVO
Conectar todas as telas necessárias para que seja possível apresentar o funcionamento do TabMesa.

O protótipo deve simular:

Cliente

→ acessa Mesa 12

→ abre cardápio

→ adiciona produto

→ confirma pedido

→ pedido vai para cozinha

Cozinha

→ recebe pedido

→ inicia preparo

→ marca como pronto

Cliente

→ recebe atualização

→ adiciona novo pedido

→ conta é atualizada

→ fecha conta

Caixa

→ recebe notificação

→ abre conta

→ cliente chega ao caixa

→ pagamento é realizado

→ caixa confirma

Sistema

→ conta fica paga

→ mesa fica livre

→ tablet retorna ao estado inicial.

54. OBJETIVO FINAL DO PROTÓTIPO
O resultado final deve ser um protótipo de alta fidelidade do TabMesa, demonstrando claramente que o sistema é uma plataforma integrada de gerenciamento de restaurante.

A apresentação deverá permitir que qualquer pessoa entenda facilmente:

Como o cliente faz o pedido.

Como o pedido chega à cozinha.

Como a cozinha atualiza o pedido.

Como o cliente acompanha o pedido.

Como novos pedidos são adicionados.

Como a conta é atualizada.

Como o cliente fecha a conta.

Como o caixa é avisado.

Como o cliente vai até o caixa.

Como o pagamento é registrado.

Como a mesa é liberada.

Priorizar a experiência do usuário, clareza das informações, consistência entre as telas e integração entre os três ambientes: Tablet do Cliente, Cozinha e Caixa, além do painel administrativo.

Não simplificar os fluxos descritos acima. Criar todas as telas, estados e conexões necessárias para representar o funcionamento completo do sistema TabMesa.