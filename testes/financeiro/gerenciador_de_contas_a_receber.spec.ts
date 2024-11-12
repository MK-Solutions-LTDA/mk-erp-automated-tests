import { FinanceiroPage } from "../../src/paginas/FinanceiroPage";
import { MainPage } from "../../src/paginas/MainPage";
import { LoginPage } from "../../src/paginas/LoginPage";
import { TipoPagina } from "../../src/utilitarios/TipoPagina";
import { ItensMenu } from "../../src/utilitarios/itens_submenu/financeiro/financeiro_submenus";
import { API } from "../../src/utilitarios/api/financeiro/gerenciador_contas_receber/apimap";
import { expect, test } from "@playwright/test";
import Servicos from "../../src/utilitarios/servicos";
import { user, pass } from "../../Setup";
import { GerenciadorContasReceber } from "../../src/paginas/subpaginas/financeiro/GerenciadorContasReceber";

let paginaGerenciadorContasReceber: GerenciadorContasReceber;
let paginaLogin: LoginPage;
let paginaFinanceiro: FinanceiroPage;
let paginaPrincipal: MainPage;

// test.use({
//   video: { mode: "on", size: { width: 1920, height: 1080 } },
//   screenshot: { mode: "on", fullPage: true },
// });

test.describe("Faturas", () => {
  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);

    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizarLogin(user, pass);
    paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);
    paginaGerenciadorContasReceber = await paginaFinanceiro.irParaPagina(ItensMenu.GERENCIADOR_DE_CONTAS_A_RECEBER);

    await paginaGerenciadorContasReceber.navegarParaPainel(
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
        if (response.url().includes(`${API.LIQUIDAR_FATURA}`)) {
          return resolve(response);
        }
      });
    });

    await paginaGerenciadorContasReceber.liquidarFaturaAReceber();

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve estornar uma fatura a receber com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => {
        if (response.url().includes(`${API.ESTORNAR_FATURA}`)) {
          return resolve(response);
        }
      });
    });

    await paginaGerenciadorContasReceber.estornarFaturaAReceber();

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();   
  });

  test('Deve suspender uma fatura a receber com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => {
        if (response.url().includes(`${API.SUSPENDER_FATURA}`)) {
          return resolve(response);
        }
      });
    });

    await paginaGerenciadorContasReceber.suspenderFaturaAReceber();

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();   
  });

  test('Deve remover a suspensão de uma fatura a receber com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => {
        if (response.url().includes(`${API.REMOVER_SUSPENSAO_FATURA}`)) {
          return resolve(response);
        }
      });
    });

    await paginaGerenciadorContasReceber.removerSuspensaoFaturaAReceber();

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();   
  });

  test('Deve baixar o boleto de uma fatura a receber com sucesso', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await paginaGerenciadorContasReceber.baixarBoletoFaturaAReceber();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("faturas.pdf");
  });

  test('Deve imprimir o boleto de uma fatura a receber com sucesso', async ({ page }) => {
    await paginaGerenciadorContasReceber.imprimirBoletoFaturaAReceber();
    expect(page.on('dialog', async (dialog) => { await dialog.accept() })).toBeTruthy();
  });

  test("Deve gerar cobrança pix na fatura a receber com sucesso", async ({ page }) => {

    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => {
        if (response.url().includes(`${API.GERAR_COBRANCA_PIX}`)) {
          return resolve(response);
        }
      });
    });
  
    await paginaGerenciadorContasReceber.gerarCobrancaPixFaturaAReceber();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();   
  });

  test('Deve enviar o boleto e a nota por e-mail com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.GERAR_NOVO_EMAIL}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.enviarBoletoNotaEmail();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();   
  });

  test('Deve inserir anexo no boleto com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${API.INSERIR_ANEXO}`)) { return resolve(response) }});
    });
    await paginaGerenciadorContasReceber.anexarArquivos(await paginaGerenciadorContasReceber.navegarParaContasAReceberTela());
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve adicionar ao SPC com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${API.ADICIONAR_SPC}`)) { return resolve(response) }});
    });
    await paginaGerenciadorContasReceber.inscreverSPC();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve alterar os detalhes com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${API.ALTERAR_DETALHES_FATURA}`)) { return resolve(response) }});
    });
    await paginaGerenciadorContasReceber.alterarDetalhesFatura();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve imprimir o recibo com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.IMPRIMIR_RECIBO}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.imprimirRecibo();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve imprimir a fatura com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.IMPRIMIR_FATURA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.imprimirFatura();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve fazer a cobrança com o cartão com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.ADICIONAR_COBRANCA_CARTAO}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.cobrancaCartao();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve dar baixa em uma fatura a receber com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.DAR_BAIXA_FATURA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.baixarFaturaAReceber();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve excluir uma fatura a receber com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.EXCLUIR_FATURA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.excluirContaAReceber()
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve liquidar faturas a receber em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.LIQUIDAR_FATURAS_MASSA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.liquidarFaturasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve estornar a receber em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.ESTORNAR_FATURAS_MASSA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.estornarFaturasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve suspendar a receber em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.SUSPENDER_FATURAS_MASSA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.suspenderFaturasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve remover suspenão em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.REMOVER_SUSPENSAO_FATURAS_MASSA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.removerSuspensaoFaturasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve imprimir em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.IMPRESSAO_MASSA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.imprimirFaturasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve cobrar via cartão em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.ADICIONAR_COBRANCA_CARTAO}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.cobrancaCartaoEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve remover remessa em massa com sucesso', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.INCLUIR_REMOVER_MARCACAO_REMESSA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.removerRemessaEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Deve paginar grade e alterar quantidade de resultados', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.FATURAS_GRADE}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.navegarPaginaResultados("3", await paginaGerenciadorContasReceber.navegarParaContasAReceberTela());
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });
});

test.describe("Contas não faturadas", () => {

  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);

    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizarLogin(user, pass);
    paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);
    paginaGerenciadorContasReceber = await paginaFinanceiro.irParaPagina(ItensMenu.GERENCIADOR_DE_CONTAS_A_RECEBER);

    await paginaGerenciadorContasReceber.navegarParaPainel(
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

  test('Nova conta (Replicar contas e Faturar contas)', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(``)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.novaContaNaoFaturada();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Filtro por status', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.FATURAS_GRADE}?limit=50&offset=0&sys=MK0`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.filtrarContasNaoFaturadasPorStatus();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Filtros laterais (TODAS AS COLUNAS / E alguns de datas)', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.FATURAS_GRADE}?limit=50&offset=0&sys=MK0`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.filtrarContasNaoFaturadasPorFiltrosLaterais();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Editar conta', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.EDITAR_CONTA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.editarContaNaoFaturada();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Faturar conta', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.FATURAR_CONTA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.faturarContaAReceberNaoFaturada();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Suspender / Remover suspensão', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.SUSPENDER_CONTA}`)) { return resolve(response) }})});
    const responsePromise2 = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.REMOVER_SUSPENSAO_CONTA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.suspenderRemoversuspensaoFaturaAReceber();
    const response = await responsePromise;
    const response2 = await responsePromise2;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    expect(await Servicos.checarRequisicao(response2)).toBeTruthy();
  });
  test('Remover conta', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.REMOVER_CONTA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.removerContaNaoFaturada();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Suspender em massa', async ({ page }) => {
    const responsePromise = new Promise (async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.SUSPENDER_CONTA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.suspenderContasNaoFaturadasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Remover suspensão em massa', async ({ page }) => {
    const responsePromise = new Promise (async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.REMOVER_SUSPENSAO_CONTA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.removerSuspensaoContasNaoFaturadasEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Faturar em massa', async ({ page }) => {
    const responsePromise = new Promise (async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.FATURAR_CONTA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.faturarContaAReceberNaoFaturadaEmMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Paginar grade', async ({ page }) => {
    const responsePromise = new Promise (async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.FATURAS_GRADE}?limit=50&offset=50&sys=MK0`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.navegarPaginaResultados("2", await paginaGerenciadorContasReceber.navegarParaContasAReceberTela());
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Fazer download da conta não faturada', async ({ page }) => {
    await paginaGerenciadorContasReceber.fazerDownloadContaNaoFaturada();
    expect(page.on('download', download => {expect(download.suggestedFilename()).toBe('contas-nao-faturadas.pdf');}))
  });
  test('Imprimir conta não faturada', async ({ page }) => {
    await paginaGerenciadorContasReceber.imprimirContaNaoFaturada();
  });
});
test.describe("Email", () => {
  
  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);

    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizarLogin(user, pass);
    paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);
    paginaGerenciadorContasReceber = await paginaFinanceiro.irParaPagina(ItensMenu.GERENCIADOR_DE_CONTAS_A_RECEBER);

    await paginaGerenciadorContasReceber.navegarParaPainel('li[id="1171825"]','iframe[componenteaba="Gerenciador de Contas a ReceberClosePainelAba"]');
  });

  test.afterEach(async ({ page }) => {
    await page.context().close();
  });

  test('Novo lote - Enviar E-mails (validar recebimento no mailtrap de fatura e doc fiscal)', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.ENVIAR_EMAILS_MASSA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.enviarEmails();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Novo lote - Imprimir boletos', async ({ page }) => {
    const responsePromise = new Promise (async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.IMPRESSAO_MASSA}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.imprimirEmailsMassa();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test('Lote de faturas - Imprimir / Ignorar / Permitir / Encerrar lote / Paginar', async ({ page }) => {
    const imprimirResponsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.IMPRESSAO_MASSA}`)) {return resolve(response) }})});
    const ignorarResponsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.PERMITIR_IMPRESSAO}`)) {return resolve (response) }})});
    const permitirResponsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.PERMITIR_IMPRESSAO}`)) {return resolve (response) }})});
    const encerrarResponsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.REMOVER_LOTE}`)) { return resolve(response) }})});
    const paginarResponsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.PAGINA_EMAIL}`)) { return resolve(response) }})});
    
    await paginaGerenciadorContasReceber.gerarLote();
    await paginaGerenciadorContasReceber.abrirLoteFaturas();
    
    await paginaGerenciadorContasReceber.ignorarLote();
    const ignorarResponse = await ignorarResponsePromise;
    expect(await Servicos.checarRequisicao(ignorarResponse)).toBeTruthy();
    
    await paginaGerenciadorContasReceber.permitirLote();
    const permitirResponse = await permitirResponsePromise;
    expect(await Servicos.checarRequisicao(permitirResponse)).toBeTruthy();
    
    await paginaGerenciadorContasReceber.paginarLote();
    const paginarResponse3 = await paginarResponsePromise;
    expect(await Servicos.checarRequisicao(paginarResponse3)).toBeTruthy();
    
    await paginaGerenciadorContasReceber.imprimirLote();
    const imprimirResponse = await imprimirResponsePromise;
    expect(await Servicos.checarRequisicao(imprimirResponse)).toBeTruthy();
    
    await paginaGerenciadorContasReceber.encerrarLote();
    const encerrarResponse = await encerrarResponsePromise;
    expect(await Servicos.checarRequisicao(encerrarResponse)).toBeTruthy();
  });

  test('Paginar grade de emails', async ({ page }) => {
    const paginarResponsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.PAGINA_EMAIL2}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.paginarLote();
    const paginarResponse = await paginarResponsePromise;
    expect(await Servicos.checarRequisicao(paginarResponse)).toBeTruthy();
  });
  test('Fazer download do email', async ({ page }) => {
    await paginaGerenciadorContasReceber.fazerDownloadEmail();
    expect(page.on('download', download => {expect(download.suggestedFilename()).toBe('emails.pdf');}))
  });
  test('Fazer impressão do email', async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.IMPRESSAO_GRADE_EMAIL}`)) { return resolve(response) }})});
    await paginaGerenciadorContasReceber.imprimirGradeEmails();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });
});