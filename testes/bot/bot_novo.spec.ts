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
    
    test('Resposta padrão - editar', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.criarRespostaPadrao('Resposta padrão teste');
        await paginaBotNovo.editarRespostaPadrao('Resposta padrão teste');
        await paginaBotNovo.botaoFecharModal.click();
    });

    test('Resposta padrão - excluir', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
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
    });

    test('Devolver para a fila', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.devolverParaFila();
    });

    test('Sair da conversa (único operador)', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.sairConversaUnicoOperador();
    });

    test('Transferir para setor', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.transferirParaSetor();
    });
});

        //API que dará o retorno 200
test.describe('Tags', () => {
    test('Criar tag', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {     
        const responsePromise = new Promise(async (resolve) => {
        page.on("response", (response) => {
          if (response.url().includes(`${URL}/mk/WSMKBotCriarTag.rule`)) {
            return resolve(response);    }
        });
        });
        await page.waitForLoadState('load')
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.criarTag();
        async ({ page }) => {
        }
        const response = await responsePromise;
 //   expect(await Services.checarRequisicao(response)).toBeTruthy();  
    });

  test('Editar Tag', async ({ paginaLogin, paginaPrincipal, paginaBotNovo, page }) => {
    await page.waitForLoadState('load')
    await paginaBotNovo.abrirNovaConversa();
    await paginaBotNovo.acessarAbaPrimeiraConversa();
    await paginaBotNovo.editarTag();
});
});