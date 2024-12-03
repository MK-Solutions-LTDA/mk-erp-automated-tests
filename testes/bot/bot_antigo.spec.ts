import { fakerPT_BR as faker } from "@faker-js/faker";
import { test } from "../../src/utilitarios/fixtures/base";

test.describe('Conversas ativas', () => {
    test.describe('Opções', async () => {
        test('Encerrar um atendimento', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
            await paginaBotAntigo.acessarConversa();
            await paginaBotAntigo.encerrarAtendimento();
        });
        test('Devolver atendimento para fila', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
            await paginaBotAntigo.acessarConversa();
            await paginaBotAntigo.devolverAtendimento();
        });
        test('Sair da conversa', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
            await paginaBotAntigo.acessarConversa();
            await paginaBotAntigo.sairConversa();
        });
        test('Cadastrar e enviar resposta padronizada', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
            await paginaBotAntigo.acessarConversa();
            await paginaBotAntigo.cadastrarRespostaPadronizada();
        });
        test('Cadastrar resposta com emoji', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
            await paginaBotAntigo.acessarConversa();
            await paginaBotAntigo.cadastrarRespostaPadronizadaComEmoji();
        });
        test('Editar resposta padronizada', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
            await paginaBotAntigo.acessarConversa();
            await paginaBotAntigo.editarRespostaPadronizada();
        });
        test('Excluir a resposta padrão', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
            await paginaBotAntigo.acessarConversa();
            await paginaBotAntigo.excluirRespostaPadronizada();
        })
        test('Enviar template com texto, coringa e emoji', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
            await paginaBotAntigo.acessarConversa();
            await paginaBotAntigo.enviarTemplateTextoCoringaEmoji();
        });
        test('Enviar template com imagem e emoji', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
            await paginaBotAntigo.acessarConversa();
            await paginaBotAntigo.enviarTemplateImagemEmoji();
        });
        test('Enviar template com anexo e emoji', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
            await paginaBotAntigo.acessarConversa();
            await paginaBotAntigo.enviarTemplateAnexoEmoji();
        });
    });
    test("Enviar mensagens no chat", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.acessarConversaSetor();
        await paginaBotAntigo.enviarMensagensNoChat(faker.hacker.phrase());
    });
    test("Envio de emojis no chat", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.acessarConversaSetor();
        await paginaBotAntigo.enviarMensagensNoChat('⚰️💔💀🫠😭🥴🤪😖🤣💕👌😊');
    });
    test("Envio de PDF no chat", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.acessarConversaSetor();
        await paginaBotAntigo.enviarPdfChat();
    });
    test("Envio de Imagem no chat", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.acessarConversaSetor();
        await paginaBotAntigo.enviarImagemChat();
    });
    test("Envio de Vídeo no chat", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.enviarVideoChat();
    });
    test("Envio de Docx no chat", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.acessarConversaSetor();
        await paginaBotAntigo.enviarDocxChat();
    });
    test("Gravar e enviar áudio curto", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.gravarAudio(15);
    });
    test("Gravar e enviar áudio longo", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.gravarAudio(30);
    });
    test("Escutar áudios do operador", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.gravarAudio(10);
        await paginaBotAntigo.escutarAudio(10);
    });
    test("Excluir gravação antes de enviar", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.gravarAudio(5);
        await paginaBotAntigo.excluirAudio();
    });
    test("Fazer download do áudio e ouvir ", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.gravarAudio(5);
        await paginaBotAntigo.baixarAudio();
    });
});

test.describe('Salas de setores', async () => {
    test('Enviar mensagens no chat', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.iniciarConversa('Teste Caroline');
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.enviarMensagensNoChat(faker.hacker.phrase());
    });
    test('Envio de emojis no chat', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.iniciarConversa('Teste Caroline');
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.enviarMensagensNoChat('⚰️💔💀🫠😭🥴🤪😖🤣💕👌😊');
    });
    test('Envio de PDF no chat', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.iniciarConversa('Teste Caroline');
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.enviarPdfChat();
    });
    test('Envio de Imagem no chat', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.iniciarConversa('Teste Caroline');
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.enviarImagemChat();
    });
    test('Envio de Vídeo no chat', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.iniciarConversa('Teste Caroline');
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.enviarVideoChat();
    });
    test('Envio de Docx no chat', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.iniciarConversa('Teste Caroline');
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.enviarDocxChat();
    });
    test('Gravar e enviar áudio curto', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.iniciarConversa('Teste Caroline');
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.gravarAudio(15);
    });
    test('Gravar e enviar áudio longo', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.iniciarConversa('Teste Caroline');
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.gravarAudio(30);
    }); 
    test('Escutar áudios do operador', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.iniciarConversa('Teste Caroline');
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.gravarAudio(10);
        await paginaBotAntigo.escutarAudio(10);
    }); 
    test('Excluir gravação antes de enviar', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.iniciarConversa('Teste Caroline');
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.gravarAudio(5);
        await paginaBotAntigo.excluirAudio();
    }); 
    test('Fazer download do áudio e ouvir', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.iniciarConversa('Teste Caroline');
        await paginaBotAntigo.acessarConversa();
        await paginaBotAntigo.gravarAudio(5);
        await paginaBotAntigo.baixarAudio();    
    });    
}); 