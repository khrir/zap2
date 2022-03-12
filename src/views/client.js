const socket = io.connect('127.0.0.1:3001');

$("form#login").submit(function (e) {
    e.preventDefault();

    // Evento enviado quando o usuário insere um apelido
    socket.emit("entrar", $(this).find("#apelido").val(), function (valido) {
        if (valido) {
            // Caso não exista nenhum usuário com o mesmo nome, o painel principal é exibido
            $("#acesso_usuario").hide();
            $("#sala_chat").show();
        } else {
            // Do contrário o campo de mensagens é limpo e é apresentado um alert
            $("#acesso_usuario").val("");
            alert("Nome já utilizado nesta sala");
        }
    });
});

// Ao enviar uma mensagem
$("form#chat").submit(function (e) {
    e.preventDefault();

    var mensagem = $(this).find("#texto_mensagem").val();
    var usuario = $("#lista_usuarios").val(); // Usuário selecionado na lista lateral direita

    // Evento acionado no servidor para o envio da mensagem
    // junto com o nome do usuário selecionado da lista
    socket.emit("enviar mensagem", { msg: mensagem, usu: usuario }, function () {
        $("form#chat #texto_mensagem").val("");
    });
});

// Resposta ao envio de mensagens do servidor
socket.on("atualizar mensagens", function (dados) {
    var mensagem_formatada = $("<p />").text(dados.msg).addClass(dados.tipo);
    $("#historico_mensagens").append(mensagem_formatada);
});



// Quando servidor enviar uma nova lista de usuários
// o select é limpo e reinserida a opção Todos
// junto de toda a lista de usuários.
socket.on("atualizar usuarios", function (usuarios) {
    $("#lista_usuarios").empty();
    $("#lista_usuarios").append("<option value=''>Todos</option>");
    $.each(usuarios, function (indice) {
        var opcao_usuario = $("<option />").text(usuarios[indice]);
        $("#lista_usuarios").append(opcao_usuario);
    });
});