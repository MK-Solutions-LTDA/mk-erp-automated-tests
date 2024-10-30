import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/paginas/LoginPage";
import { MainPage } from "../../src/paginas/MainPage";
import { TipoPagina } from "../../src/utilitarios/TipoPagina";
import { FinanceiroPage } from "../../src/paginas/FinanceiroPage";
import { url } from "../../Setup";
import Servicos from "../../src/utilitarios/servicos";

let paginaLogin: LoginPage;
let paginaPrincipal: MainPage;
let GerenciadorContasReceber: GerenciadorContasReceber;

// test.use({
//   video: { mode: "on", size: { width: 1920, height: 1080 } },
//   screenshot: { mode: "on", fullPage: true },
// });

test.describe("Faturas", () => {
  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);

    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizar_login();
    paginaFinanceiro = await paginaPrincipal.irParaPagina(
      TipoPagina.FINANCEIRO
    );

    await paginaFinanceiro.navegarParaPainel(
      'li[id="1171825"]',
      'iframe[componenteaba="Gerenciador de Contas a ReceberClosePainelAba"]'
    );
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Terminou ${testInfo.title} com status: ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Não rodou com esperado, finalizou na url:  ${page.url()}`);
    }
    await page.context().close();
  });

  test("Deve liquidar uma fatura a receber com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => {
        if (response.url().includes(`${url}/mk/WSMKCRLiquidarFaturas.rule`)) {
          return resolve(response);
        }
      });
    });

    await paginaFinanceiro.liquidarFaturaAReceber();

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();

    console.log("Fatura liquidada com sucesso");
  });

  test('Deve estornar uma fatura a receber com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => {
        if (response.url().includes(`${url}/mk/WSMKEstornarFaturas.rule`)) {
          return resolve(response);
        }
      });
    });

    await paginaFinanceiro.estornarFaturaAReceber();

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();   
  });

  test('Deve suspender uma fatura a receber com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => {
        if (response.url().includes(`${url}/mk/WSMKCRSuspenderFatura.rule`)) {
          return resolve(response);
        }
      });
    });

    await paginaFinanceiro.suspenderFaturaAReceber();

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();   
  });

  test('Deve remover a suspensão de uma fatura a receber com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => {
        if (response.url().includes(`${url}/mk/WSMKCRRemoverSuspensaoFatura.rule`)) {
          return resolve(response);
        }
      });
    });

    await paginaFinanceiro.removerSuspensaoFaturaAReceber();

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();   
  });

  test('Deve baixar o boleto de uma fatura a receber com sucesso', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await paginaFinanceiro.baixarBoletoFaturaAReceber();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("faturas.pdf");
  });

  test('Deve imprimir o boleto de uma fatura a receber com sucesso', async ({ page }) => {
    await paginaFinanceiro.imprimirBoletoFaturaAReceber();
    expect(page.on('dialog', async (dialog) => { await dialog.accept() })).toBeTruthy();
  });

  test("Deve gerar cobrança pix na fatura a receber com sucesso", async ({ page }) => {

    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => {
        if (response.url().includes(`${url}/mk/WSMKCRGerarCobrancaPixPost.rule?`)) {
          return resolve(response);
        }
      });
    });
  
    await paginaFinanceiro.gerarCobrancaPixFaturaAReceber();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();   
  });

  test('Deve enviar o boleto e a nota por e-mail com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRNovoEmail.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.enviarBoletoNotaEmail();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();   
  });

  test('Deve inserir anexo no boleto com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturaInserirAnexo.rule`)) { return resolve(response) }});
    });
    await paginaFinanceiro.anexarArquivosFatura(await paginaFinanceiro.navegarParaContasAReceberTela());
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve adicionar ao SPC com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRInscreverSPC.rule`)) { return resolve(response) }});
    });
    await paginaFinanceiro.inscreverSPC();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve alterar os detalhes com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCREditarFatura.rule`)) { return resolve(response) }});
    });
    await paginaFinanceiro.alterarDetalhesFatura();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve imprimir o recibo com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRFaturaRecibo.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.imprimirRecibo();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve imprimir a fatura com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRImpressaoMassa.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.imprimirFatura();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve fazer a cobrança com o cartão com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRInclCobrAdc.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.cobrancaCartao();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve dar baixa em uma fatura a receber com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRBaixarFatura.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.baixarFaturaAReceber();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve excluir uma fatura a receber com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRFaturaExcluir.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.excluirFatura()
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve liquidar faturas a receber em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRLiquidarFaturas.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.liquidarFaturasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve estornar a receber em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKEstornarFaturas.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.estornarFaturasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve suspendar a receber em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRSuspenderFatura.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.suspenderFaturasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve remover suspenão em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRRemoverSuspensaoFatura.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.removerSuspensaoFaturasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve imprimir em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRImpressaoMassa.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.imprimirFaturasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve cobrar via cartão em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRInclCobrAdc.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.cobrancaCartaoEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve remover remessa em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRIncluirRemoverMarcacaoRemessa.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.removerRemessaEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve paginar grade e alterar quantidade de resultados', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRFaturasReceber.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.navegarPaginaResultados("3", await paginaFinanceiro.navegarParaContasAReceberTela());
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });
});

test.describe("Contas não faturadas", () => {

  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);
    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizar_login();
    paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);

    await paginaFinanceiro.navegarParaPainel('li[id="1171825"]','iframe[componenteaba="Gerenciador de Contas a ReceberClosePainelAba"]');
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Terminou ${testInfo.title} com status: ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Não rodou com esperado, finalizou na url:  ${page.url()}`);
    }
    await page.context().close();
  });

  test('Nova conta (Replicar contas e Faturar contas)', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRNovaConta.rule?`)) { return resolve(response) }})});
    await paginaFinanceiro.novaContaNaoFaturada();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Filtro por status', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRFaturasReceber.rule?limit=50&offset=0&sys=MK0`)) { return resolve(response) }})});
    await paginaFinanceiro.filtrarContasNaoFaturadasPorStatus();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Filtros laterais (TODAS AS COLUNAS / E alguns de datas)', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRFaturasReceber.rule?limit=50&offset=0&sys=MK0`)) { return resolve(response) }})});
    await paginaFinanceiro.filtrarContasNaoFaturadasPorFiltrosLaterais();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Editar conta', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCREditarConta.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.editarContaNaoFaturada();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Faturar conta', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRFaturarContas.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.faturarContaAReceberNaoFaturada();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Suspender / Remover suspensão', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRSuspenderConta.rule`)) { return resolve(response) }})});
    const responsePromise2 = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRRemoverSuspensaoConta.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.suspenderRemoversuspensaoFaturaAReceber();
    const response = await responsePromise;
    const response2 = await responsePromise2;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    expect(await Servicos.checarRequisicao(response2)).toBeTruthy();
  });

  test('Remover conta', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRContaRemocao.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.removerContaNaoFaturada();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Suspender em massa', async ({ page }) => {
    const responsePromise = new Promise (async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRSuspenderConta.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.suspenderContasNaoFaturadasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Remover suspensão em massa', async ({ page }) => {
    const responsePromise = new Promise (async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRRemoverSuspensaoConta.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.removerSuspensaoContasNaoFaturadasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Faturar em massa', async ({ page }) => {
    const responsePromise = new Promise (async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRFaturarContas.rule`)) { return resolve(response) }})});
    await paginaFinanceiro.faturarContaAReceberNaoFaturadaEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Paginar grade', async ({ page }) => {
    const responsePromise = new Promise (async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCRFaturasReceber.rule?limit=50&offset=50&sys=MK0`)) { return resolve(response) }})});
    await paginaFinanceiro.navegarPaginaResultados("2", await paginaFinanceiro.navegarParaContasAReceberTela());
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Fazer download da conta não faturada', async ({ page }) => {
    await paginaFinanceiro.fazerDownloadContaNaoFaturada();
    expect(page.on('download', download => {expect(download.suggestedFilename()).toBe('contas-nao-faturadas.pdf');}))
  });
  test('Imprimir conta não faturada', async ({ page }) => {
    await paginaFinanceiro.imprimirContaNaoFaturada();
  });
});
test.describe("Email", () => {
  
  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);
    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizar_login();
    paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);

    await paginaFinanceiro.navegarParaPainel('li[id="1171825"]','iframe[componenteaba="Gerenciador de Contas a ReceberClosePainelAba"]');
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Terminou ${testInfo.title} com status: ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Não rodou com esperado, finalizou na url:  ${page.url()}`);
    }
    await page.context().close();
  });

  test('Novo lote - Enviar E-mails (validar recebimento no mailtrap de fatura e doc fiscal)', async ({ page }) => {});
  test('Novo lote - Imprimir boletos', async ({ page }) => {});
  test('Lote de faturas - Imprimir / Ignorar / Permitir / Encerrar lote / Paginar', async ({ page }) => {});
  test('Paginar grade de emails', async ({ page }) => {});
  test('Fazer download do email', async ({ page }) => {});
  test('Fazer impressão do email', async ({ page }) => {});
});