const socket = io.connect();

// Ao enviar uma mensagem
$("form#chat").submit(function (e) {
    e.preventDefault();

    var mensagem = $(this).find("#texto_mensagem").val();
    var usuario = $("#lista_usuarios").val();

    socket.emit("enviar mensagem", { msg: mensagem, usu: usuario }, function () {
        $("form#chat #texto_mensagem").val("");
    });
});

// Resposta ao envio de mensagens do servidor
socket.on("atualizar mensagens", function (dados) {
    var mensagem_formatada = $("<p />").text(dados.msg).addClass(dados.tipo);
    $("#historico_mensagens").append(mensagem_formatada);
});

socket.on("atualizar usuarios", function (usuarios) {
    $("#lista_usuarios").empty();
    $("#lista_usuarios").append("<option value=''>Todos</option>");
    $.each(usuarios, function (indice) {
        var opcao_usuario = $("<option />").text(usuarios[indice]);
        $("#lista_usuarios").append(opcao_usuario);
    });
});