import { test } from "../../src/utilitarios/fixtures/base";

test.describe('Ações', () => {
    test('Enviar um anexo de segunda via da fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await page.waitForTimeout(2000);
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAnexo(2);
    });

    test('Enviar dois anexos de segunda via da fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await page.waitForTimeout(2000);
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAnexo(3);
    });
    
    test('Resposta padrão - editar', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await page.waitForTimeout(2000);
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.editarRespostaPadrao();
    });


    test('Criar resposta padrão', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await page.waitForTimeout(2000);
        await paginaBotNovo.acessarConversa();
        await page.waitForTimeout(2000);
        await paginaBotNovo.criarResposta();
    });
});

test.describe('Opções', () => {
    test('Redefinir contato identificado', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await page.waitForTimeout(2000);
        await paginaBotNovo.acessarConversa();
        await page.waitForTimeout(2000);
        await paginaBotNovo.redefinirContato();
    });
});