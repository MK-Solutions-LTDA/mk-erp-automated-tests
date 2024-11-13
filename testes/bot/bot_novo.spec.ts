import { faker } from "@faker-js/faker/locale/pt_BR";
import { test } from "../../src/utilitarios/fixtures/base";

test.describe('Ações', () => {
    test('Enviar um anexo de segunda via da fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAnexo(2);
    });

    test('Enviar dois anexos de segunda via da fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAnexo(3);
    });

    test('Resposta padrão - Criar', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.criarRespostaPadrao('Resposta padrão teste');
        await paginaBotNovo.botaoFecharModal.click();
    });
    
    test('Resposta padrão - Editar', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.criarRespostaPadrao('Resposta padrão teste');
        await paginaBotNovo.editarRespostaPadrao('Resposta padrão teste');
        await paginaBotNovo.botaoFecharModal.click();
    });

    test('Resposta padrão - Excluir', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.criarRespostaPadrao('Resposta padrão teste');
        await paginaBotNovo.excluirRespostaPadrao('Resposta padrão teste');
        await paginaBotNovo.botaoFecharModal.click();
    });
});

test.describe('Opções', () => {
    test('Redefinir contato identificado', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.redefinirContato();
    });

    test('Transferir a conversa para um outro setor', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.transferirConversaParaSetor('Atendimento ao Cliente', true);
    });

    test('Devolver conversa para a fila', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.devolverConversaParaFila();
    });

    test('Enviar mensagens ao chat', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarMensagemChat(faker.lorem.sentence()); 
    });

    test('Enviar mensagens ao chat com emojis', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarMensagemChat('⚰️💀👌💕🤣😖🫠🤪🥴');  
    });

    test('Enviar mensagem de audio ao chat', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAudioChat();
    });
    
    test('Excluir audio antes de enviar', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {    
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.excluirAudioChat();
    });

    test('Enviar dois áudios e verificar se um começa a tocar à partir do momento que o outro para', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAudioChat();
        await paginaBotNovo.enviarAudioChat();
    });

    test('Fazer download do arquivo de audio', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAudioChat();
        await paginaBotNovo.fazerDownloadAudio();
    });

    test('Copiar link do arquivo de audio', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAudioChat();
        await paginaBotNovo.copiarLinkAudio();
    });

    test('Ouvir audio antes de enviar ele para a conversa', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAudioChat();
        await paginaBotNovo.ouvirAudio();
    })
});