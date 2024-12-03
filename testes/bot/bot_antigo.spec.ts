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
test.describe('Formulários', async () => {
    test.describe('Financeiro', async () => {
        test('Criar um contrato aguardando ativação', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Ativar o contrato gerando as suas parcelas', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Suspender contrato', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Cancelar suspensão do contrato', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Alterar contrato', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Cancelar contrato', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Definir a permissão de acesso a esta função', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Enviar fatura no chat', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Baixar fatura selecionada', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Inserir comentário na fatura', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Remover fatura', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Suspender fatura', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Imprimir fatura', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Alterar fatura', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Faturar contas', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Suspender conta', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Cancelar suspensão de contas', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Inserir conta', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Editar conta a receber', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Remover conta', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Editar observações do documento fiscal', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Anular documento fiscal', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Cancelar documento fiscal', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Gerar os documentos fiscais da fatura', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Enviar negativas de débito por e-mail', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
                
        });
        test('Imprimir negativas de débito', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Gerar nova negativas de débito', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        })
    });
    test('Ordens de Serviço', async () => {
        test('Adicionar nova O.S.', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Cancelar agendamento de O.S', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Editar O.S', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Imprimir O.S selecionada', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Enviar mensagem eletrônica ao cliente ou técnico', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Sincronizar O.S ao iClass', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Encerrar O.S selecionada', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
    });

    test.describe('Conexões do cliente', async () => {

        test('Realizar alterações gerais na conexão', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Bloqueio da conexão', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Desbloqueio da conexão', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        }); 
        test('Remover a redução de velocidade da conexão', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Alterar plano de velocidade da conexão', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
    });

    test.describe('Leads de CRM', async () => {
        test('Continuar uma lead já disponível na grade', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });      
        test('Criar uma nova lead', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Adicionar tarefa a uma lead já disponível na grade', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });

        test('Adicionar comentário a uma lead já disponível na grade', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Adicionar anexo a uma lead já disponível na grade', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Atualizar todas as grades do formulário', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
    });
    test.describe('Anexos', async () => {
        test('Visualizar anexos', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Realizar o download do anexo', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
    });
    test.describe('Histórico', async () => {
        test('Alterar campos da tabela', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Conferir filtros', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Ver os detalhes da conversa', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Imprimir atendimento', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Alterar setor do atendimento', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
                
        });
        test('Iniciar uma conversa', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
    });
    test.describe('Avaliações e críticas', async () => {
        test('Ver conversa', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Imprimir conversa', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Gravar informações informações em "análise da conversa"', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {

        });
        test('Conferir se a configuração está salvando', async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
                
        });
    });
});