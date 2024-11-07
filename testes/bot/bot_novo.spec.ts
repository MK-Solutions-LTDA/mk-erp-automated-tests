import { test, expect } from "../../src/utilitarios/fixtures/base";

test.describe('Ações', () => {
    test('Enviar anexo de segunda via da fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await page.waitForTimeout(2000);
        await paginaBotNovo.acessarConversa();
        await page.waitForTimeout(2000);
        await paginaBotNovo.enviarAnexo();
    });
    
});

test.describe('api', () => {

    test('testar api de envio', async ({ page }) => {});

})