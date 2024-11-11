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

    test('Convidar um operador com o status dispoível para a conversa', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.convidarOperadorParaConversa('caroline');
    })

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

    test('Acessar duas contas simultaneamente', async ({ 
        paginaLogin, 
        paginaPrincipal, 
        paginaBotNovo, 
        paginaLogin2, 
        paginaPrincipal2, 
        paginaBotNovo2, 
        page 
    }) => {

        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo2.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo2.acessarAbaPrimeiraConversa();
    });

});