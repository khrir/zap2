const socket = io.connect('127.0.0.1:3001');

$("form#login").submit(function (e) {
    e.preventDefault();

    socket.emit("entrar", $(this).find("#nickname").val(), function (valido) {
        if (valido) {
            $("#user").hide();
            $("#room").show();
        } else {
            $("#user").val("");
            alert("Nome já utilizado nesta sala");
        }
    });
});

$("form#chat").submit(function (e) {
    e.preventDefault();

    let mensagem = $(this).find("#mensagem").val();
    let usuario = $("#lista").val(); 

    socket.emit("enviar mensagem", { msg: mensagem, usu: usuario }, function () {
        $("form#chat #mensagem").val("");
    });
});

socket.on("atualizar mensagens", function (dados) {
    let mensagem_formatada = $("<p />").text(dados.msg).addClass(dados.tipo);
    $("#historico").append(mensagem_formatada);
});

socket.on("atualizar usuarios", function (usuarios) {
    $("#lista").empty();
    $("#lista").append("<option value=''>Todos</option>");
    $.each(usuarios, function (indice) {
        let opcao_usuario = $("<option />").text(usuarios[indice]);
        $("#lista").append(opcao_usuario);
    });
});