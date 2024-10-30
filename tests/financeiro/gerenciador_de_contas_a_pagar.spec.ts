import { expect, test } from "@playwright/test";
import { LoginPage } from "../../src/paginas/LoginPage";
import { TipoPagina } from "../../src/utilitarios/TipoPagina";
import { url } from "../../Setup";
import Servicos from "../../src/utilitarios/servicos";
import { faker } from "@faker-js/faker/locale/pt_BR";
import { GerenciadorContasPagar } from "../../src/paginas/subpaginas/financeiro/GerenciadorContasPagar";
import { MainPage } from "../../src/paginas/MainPage";
import { FinanceiroPage } from "../../src/paginas/FinanceiroPage";
import { ItensMenu } from "../../src/utilitarios/itens_submenu/financeiro/financeiro_submenus";

// test.use({
//   video: { mode: "on", size: { width: 1920, height: 1080 } },
//   screenshot: { mode: "on", fullPage: true },
// });

let paginaGerenciadorContasPagar: GerenciadorContasPagar;
let paginaLogin: LoginPage;
let paginaFinanceiro: FinanceiroPage;
let paginaPrincipal: MainPage;

test.describe('Faturas', () => {

  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);

    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizar_login();
    paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);
    paginaGerenciadorContasPagar = await paginaFinanceiro.irParaPagina(ItensMenu.GERENCIADOR_DE_CONTAS_A_PAGAR);

    await paginaGerenciadorContasPagar.navegarParaPainel('li[id="1171825"]', 'iframe[componenteaba="Gerenciador de Contas a ReceberClosePainelAba"]');
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Terminou ${testInfo.title} com status: ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Não rodou com esperado, finalizou na url:  ${page.url()}`);
    }
    await page.context().close();
    await page.close();
  });

  test("Deve criar uma fatura sem rateio com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {return resolve(response)}})});
    await paginaGerenciadorContasPagar.criarContaAPagar("#",faker.lorem.sentences(),faker.date.future().toDateString(),faker.finance.amount(),"Simples","celular novo");
    console.log("Fatura sem rateio criada com sucesso!");
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve criar uma fatura com rateio com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {resolve(response); }
      });
    });

    await paginaGerenciadorContasPagar.criarContaAPagar("#",faker.lorem.sentences(),faker.date.future().toDateString(),faker.finance.amount(),"Rateio","celular novo"
    );
    
    console.log("Fatura com rateio criada com sucesso!");

    const response = await responsePromise;

    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve liquidar parcialmente a fatura com sucesso", async ({ page }) => {
    await paginaGerenciadorContasPagar.criarContaAPagar("#",faker.lorem.sentences(),faker.date.future().toDateString(),faker.finance.amount(),"Rateio","celular novo"
    );

    const criarFaturaApi = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {resolve(response)}})});

    criarFaturaApi.then(async (response) => {
      const responseFatura = await Servicos.checarRequisicao(response);
      const idFatura = responseFatura.sucesso.match(/Fatura\s+(\d{6})/i)?.[1]!;
      console.log(idFatura);
      if (!idFatura) { throw new Error("Não foi possível encontrar o ID da fatura");
      }
      if (idFatura != null || idFatura != undefined) { await paginaGerenciadorContasPagar.liquidarFatura(idFatura, faker.finance.amount(), true); console.log("Fatura liquidada parcialmente com sucesso!");
      }
    });

    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPLiquidarFatura.rule`)) {resolve(response); }
      });
    });

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve liquidar integralmente a fatura com sucesso", async ({ page }) => {
    await paginaGerenciadorContasPagar.criarContaAPagar("#", faker.lorem.sentences(), faker.date.future().toDateString(), faker.finance.amount(), "Rateio", "celular novo");
    const criarFaturaApi = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {resolve(response); }});
    });

    criarFaturaApi.then(async (response) => {
      const responseFatura = await Servicos.checarRequisicao(response);
      const idFatura = responseFatura.sucesso.match(/Fatura\s+(\d{6})/i)?.[1]!;
      console.log(idFatura);
      if (!idFatura) { throw new Error("Não foi possível encontrar o ID da fatura") }
      if (idFatura != null || idFatura != undefined) { await paginaGerenciadorContasPagar.liquidarFatura(idFatura, faker.finance.amount(), false); console.log("Fatura liquidada integralmente sucesso!");}
    });

    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPLiquidarFatura.rule`)) {resolve(response)}})})

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve liquidar as faturas em massa com sucesso", async ({ page }) => {
    console.log("Liquidando faturas em massa...");
    await paginaGerenciadorContasPagar.alteracaoFaturaEmMassa("Pagar", faker.lorem.sentences());
    console.log("Faturas liquidadas com sucesso!");
    console.log("Chamando a requisição...");
    const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPLiquidarFaturasMassa.rule?`));
    console.log("Requisição concluída!");
    console.log("Checando se a requisição foi bem-sucedida...");
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    console.log("Requisição bem-sucedida!");
  });

  test("Deve estornar a fatura integralmente com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPEstornarFatura.rule`)) {resolve(response) }})})

    await paginaGerenciadorContasPagar.estornarFatura('BB - Boleto', false);
    console.log("Fatura estornada integralmente com sucesso!");
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve estornar a fatura parcialmente com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPEstornarFatura.rule`)) {resolve(response)}})})

    await paginaGerenciadorContasPagar.criarContaAPagar("#", faker.lorem.sentences(), faker.date.future().toDateString(), faker.finance.amount(), "Rateio", "celular novo");
    console.log("Fatura criada com sucesso!");
    const criarFaturaApi = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {resolve(response)}})});

    criarFaturaApi.then(async (response) => {
      const responseFatura = await Servicos.checarRequisicao(response);
      const idFatura = responseFatura.sucesso.match(/Fatura\s+(\d{6})/i)?.[1]!;
      console.log(idFatura);
      if (!idFatura) { throw new Error("Não foi possível encontrar o ID da fatura")}
      if (idFatura != null || idFatura != undefined) { 
        await paginaGerenciadorContasPagar.liquidarFatura(idFatura, faker.finance.amount(), true);
        await paginaGerenciadorContasPagar.estornarFatura("BB - Boleto",true,idFatura ); console.log("Fatura estornada com sucesso!")
      }
    });
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve estornar as faturas em massa com sucesso", async ({ page }) => {
    console.log("Estornando faturas em massa...");
    await paginaGerenciadorContasPagar.alteracaoFaturaEmMassa("Estornar", faker.lorem.sentences());
  });

  test("Deve suspender a fatura com sucesso", async ({ page }) => {
    console.log("Suspendendo fatura...");
    await paginaGerenciadorContasPagar.suspenderFatura("#", "Dificuldades financeiras");
    console.log("Fatura suspensa com sucesso!");
    console.log("Chamando a requisição...");
    const response = await page.waitForResponse((response) =>response.url().includes(`${url}/mk/WSMKCPFaturaSuspensao.rule`));
    console.log("Requisição concluída!");
    console.log("Checando se a requisição foi bem-sucedida...");
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    console.log("Requisição bem-sucedida!");
  });

  test("Deve suspender das faturas em massa com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturaSuspensaoMassa.rule`)) {resolve(response)}})});
    await paginaGerenciadorContasPagar.alteracaoFaturaEmMassa("Suspender", faker.lorem.sentences());
    console.log("Faturas suspensas com sucesso!");
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve remover a suspenção da fatura com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturaRemoverSuspencao.rule`) ) {resolve(response)}})})

    await paginaGerenciadorContasPagar.removerSuspencaoFatura();
    console.log("Suspenção removida da fatura com sucesso!");
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve remover a suspenção de faturas em massa com sucesso", async ({page}) => {
    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturaRemoverSuspensaoMassa.rule`) ) {resolve(response); }})});

    await paginaGerenciadorContasPagar.alteracaoFaturaEmMassa("Remover suspensão",faker.lorem.sentences());

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve excluir a fatura com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturaExclusao.rule?`) ) {resolve(response)}})})

    await paginaGerenciadorContasPagar.excluirContaAPagar();

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve alterar a fatura com sucesso", async ({ page }) => {
    console.log("Alterando fatura...");
    await paginaGerenciadorContasPagar.alterarInfosFatura();
    console.log("Faturas alteradas com sucesso!");
  });

  test("Deve anexar imagens na fatura com sucesso", async ({ page }) => {
    await paginaGerenciadorContasPagar.anexarArquivos();
    const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturaInserirAnexo.rule?`))
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });
});

test.describe("Despesas", () => {
  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);

    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizar_login();
    paginaGerenciadorContasPagar = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);

    await paginaGerenciadorContasPagar.navegarParaPainel( 'li[id="1171825"]', 'iframe[componenteaba="Gerenciador de Contas a ReceberClosePainelAba"]');
  });
  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Did not run as expected, ended up at ${page.url()}`);
    }
  });

  test("Deve criar uma despesa fixa com rateio com sucesso", async ({page}) => {

    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {resolve(response); }})});

    await paginaGerenciadorContasPagar.criarDespesaFixa("#", "Rateio", "celular novo");

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve criar uma despesa fixa sem rateio com sucesso", async ({page}) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => {if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {resolve(response)}})});

    await paginaGerenciadorContasPagar.criarDespesaFixa("#", "Simples", "celular novo");

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });
});

test.describe('Parcelamentos', () => {
  test("Deve criar um parcelamento com sucesso", async ({ page }) => {
      const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovoParcelamento.rule?`) ) {resolve(response)}})});
      await paginaGerenciadorContasPagar.criarParcelamentos("4");
      const response = await responsePromise;
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });
});

test.describe("Paginação de resultados", () => {
  test.beforeEach(async ({ page }) => { 
    await paginaGerenciadorContasPagar.navegarParaPainel('li[id="1878993"]','iframe[componenteaba="Gerenciador de Contas a PagarClosePainelAba"]');
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Terminou ${testInfo.title} com status: ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Não rodou com esperado, finalizou na url:  ${page.url()}`);
    }
    await page.context().close();
    await page.close();
  });

  test.describe("Aba de faturas", () => {
    test("Deve exibir mais resultados na listagem de faturas", async ({page}) => {
      
      const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=100`) ) {resolve(response)}})});
      await paginaGerenciadorContasPagar.alterarQuantidadeResultados("100", "Faturas")
      const response = await responsePromise;
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve alterar a quantidade de resultados exibidos para 150", async ({page}) => {
      const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=150`) ) {resolve(response)}})});
      await paginaGerenciadorContasPagar.alterarQuantidadeResultados("150", "Faturas");
      const response = await responsePromise;
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a segunda página de resultados", async ({page}) => {
      const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=50`) ) {resolve(response)}})})
      await paginaGerenciadorContasPagar.navegarPaginaResultados("2", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await responsePromise;
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a terceira página de resultados", async ({page}) => {
      const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=100`) ) {resolve(response)}})})
      await paginaGerenciadorContasPagar.navegarPaginaResultados("3", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await responsePromise;
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve acessar a última página de resultados", async ({ page }) => {
      const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=`) ) {resolve(response)}})})
      await paginaGerenciadorContasPagar.navegarPaginaResultados("ultima", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await responsePromise;
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });
  });

  test.describe("Aba de despesas fixas", () => {
    
    test.beforeEach(async ({ page }) => {
      await paginaGerenciadorContasPagar.navegarParaPainel( 'li[id="1878993"]', 'iframe[componenteaba="Gerenciador de Contas a PagarClosePainelAba"]');
    });

    test("Deve exibir mais resultados na listagem de despesas", async ({page}) => {
      await paginaGerenciadorContasPagar.alterarQuantidadeResultados("100", 'Despesas Fixas');
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=100`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve alterar a quantidade de resultados exibidos para 150", async ({page}) => {
      await paginaGerenciadorContasPagar.alterarQuantidadeResultados("150", 'Despesas Fixas');
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=150`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a segunda página de resultados", async ({page}) => {
      await paginaGerenciadorContasPagar.navegarPaginaResultados("2", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=50`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a terceira página de resultados", async ({page}) => {
      await paginaGerenciadorContasPagar.navegarPaginaResultados("3", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=100`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve acessar a última página de resultados", async ({ page }) => {
      await paginaGerenciadorContasPagar.navegarPaginaResultados("ultima", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });
  });

  test.describe("Aba de parcelamentos", () => {
    test.beforeEach(async ({ page }) => {
      await paginaGerenciadorContasPagar.navegarParaPainel( 'li[id="1878993"]', 'iframe[componenteaba="Gerenciador de Contas a PagarClosePainelAba"]');
    });

    test("Deve exibir mais resultados na listagem de parcelamentos", async ({page}) => {
      await paginaGerenciadorContasPagar.alterarQuantidadeResultados("100", 'Parcelamentos');
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=100`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve alterar a quantidade de resultados exibidos para 150", async ({page}) => {
      await paginaGerenciadorContasPagar.alterarQuantidadeResultados("150", 'Parcelamentos');
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=150`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a segunda página de resultados", async ({page}) => {
      await paginaGerenciadorContasPagar.navegarPaginaResultados("2", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=50`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a terceira página de resultados", async ({page}) => {
      await paginaGerenciadorContasPagar.navegarPaginaResultados("3", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=100`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve acessar a última página de resultados", async ({ page }) => {
      await paginaGerenciadorContasPagar.navegarPaginaResultados("ultima", await await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });
  });
});

test.describe("Faturas vencidas", () => {

  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);

    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizar_login();
    paginaGerenciadorContasPagar = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);

    await paginaGerenciadorContasPagar.navegarParaPainel( 'li[id="1171825"]', 'iframe[componenteaba="Gerenciador de Contas a ReceberClosePainelAba"]');
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Terminou ${testInfo.title} com status: ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Não rodou com esperado, finalizou na url:  ${page.url()}`);
    }
    await page.context().close();
    await page.close();
  });

  test("Deve validar o somatório da quantidade de faturas vencidas", async ({ page}) => {
    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPCardsInfoFaturas.rule?`) ) {resolve(response) }})})
    await paginaGerenciadorContasPagar.validarSomatorioFaturasVencidas();
    const response = await responsePromise;
    expect(Servicos.checarRequisicao(response)).toBeTruthy();
  });
  
  test("Deve validar o somatório do faker.finance.amount() total de faturas vencidas", async () => {});

  test("Deve validar o somatório de faturas que vencem hoje", async () => {});

  test("Deve validar o somatório de faturas a vencer nos próximos 7 dias", async () => {});

  test("Deve validar o somatório de faturas a vencer nos próximos 30 dias", async () => {});
}); 