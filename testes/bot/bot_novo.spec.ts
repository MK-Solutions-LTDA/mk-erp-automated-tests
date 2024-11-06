import { test, expect } from "../../src/utilitarios/fixtures/base";

test.describe('Ações', () => {
    test('Enviar anexo de segunda via da fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarConversa();
        await paginaBotNovo.enviarAnexo();
    });
});