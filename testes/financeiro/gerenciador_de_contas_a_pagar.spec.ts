import { GerenciadorContasPagar } from "../../src/paginas/subpaginas/financeiro/GerenciadorContasPagar";
import { FinanceiroPage } from "../../src/paginas/FinanceiroPage";
import { MainPage } from "../../src/paginas/MainPage";
import { LoginPage } from "../../src/paginas/LoginPage";
import { TipoPagina } from "../../src/utilitarios/tipopagina.ts";
import { ItensMenu } from "../../src/utilitarios/itens_submenu/financeiro/financeiro_submenus";
import { API } from "../../src/utilitarios/api/financeiro/gerenciador_contas_pagar/apimap";
import { expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker/locale/pt_BR";
import Servicos from "../../src/utilitarios/servicos";
import { pass, user } from "../../Setup";

test.use({
  video: { mode: "on", size: { width: 1920, height: 1080 } },
  screenshot: { mode: "on", fullPage: true },
});

let paginaGerenciadorContasPagar: GerenciadorContasPagar;
let paginaLogin: LoginPage;
let paginaFinanceiro: FinanceiroPage;
let paginaPrincipal: MainPage;

test.describe('Faturas', () => {

  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);

    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizarLogin(user,pass);
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
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.NOVA_FATURA}`)) {return resolve(response)}})});
    console.log(API.NOVA_FATURA);
    await paginaGerenciadorContasPagar.criarContaAPagar("#", "Simples", "celular novo");
    const response = await responsePromise;
    const result = await Servicos.checarRequisicao(response);
    expect(result.sucesso).toBeTruthy(); 
  });

  test("Deve criar uma fatura com rateio com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${API.NOVA_FATURA}`)) {resolve(response); }
      });
    });

    await paginaGerenciadorContasPagar.criarContaAPagar("#","Rateio","celular novo"
    );
    
    console.log("Fatura com rateio criada com sucesso!");

    const response = await responsePromise;

    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve liquidar parcialmente a fatura com sucesso", async ({ page }) => {
    const criarFaturaApi = new Promise(async (resolve) => {
      page.on("response", async (response) => { if (response.url().includes(`${API.NOVA_FATURA}`)) {
        console.log("Método da Requisição:", await response.allHeaders());
        console.log("URL da Requisição:", await response.url());
        console.log("Headers da Requisição:", await response.headers());
        console.log("Dados da Requisição:", await response.headersArray());
        resolve(response); }
      });
    });

    await paginaGerenciadorContasPagar.criarContaAPagar("#", "Rateio", "celular novo");

    await criarFaturaApi.then(async (response) => {
      const responseFatura = await Servicos.checarRequisicao(response);
      const idFatura = responseFatura?.sucesso?.sucess?.match(/\s+(\d{6})/i)?.[0].trim();
      console.log(await idFatura.trim());
      if (idFatura) { await paginaGerenciadorContasPagar.liquidarFatura(idFatura, faker.finance.amount(), true);
    }});

    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.LIQUIDAR_FATURA}`)) {resolve(response)}})})

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve liquidar integralmente a fatura com sucesso", async ({ page }) => {
    const criarFaturaApi = new Promise(async (resolve) => {
      page.on("response", async (response) => { if (response.url().includes(`${API.NOVA_FATURA}`)) {
        console.log("Método da Requisição:", await response.allHeaders());
        console.log("URL da Requisição:", await response.url());
        console.log("Headers da Requisição:", await response.headers());
        console.log("Dados da Requisição:", await response.headersArray());
        resolve(response); }
      });
    });

    await paginaGerenciadorContasPagar.criarContaAPagar("#", "Rateio", "testeeee");

    await criarFaturaApi.then(async (response) => {
      const responseFatura = await Servicos.checarRequisicao(response);
      const idFatura = responseFatura?.sucesso?.sucess?.match(/\s+(\d{6})/i)?.[0];
      console.log(await idFatura);
      if (idFatura != null || idFatura != undefined) { await paginaGerenciadorContasPagar.liquidarFatura(idFatura, faker.finance.amount(), false);
    }});

    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.LIQUIDAR_FATURA}`)) {resolve(response)}})})

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve liquidar as faturas em massa com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", async (response) => { if (response.url().includes(`${API.LIQUIDAR_FATURA_MASSA}`)) {
        console.log("Método da Requisição:", await response.allHeaders());
        console.log("URL da Requisição:", await response.url());
        console.log("Headers da Requisição:", await response.headers());
        // console.log("Dados da Requisição:", response.request());
        resolve(response); }
      });
    });    
    await paginaGerenciadorContasPagar.alteracaoFaturaEmMassa("Pagar", faker.lorem.sentences());
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve estornar a fatura integralmente com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.ESTORNAR_FATURA}`)) {resolve(response) }})})

    await paginaGerenciadorContasPagar.estornarFatura('BB - Boleto', false);
    console.log("Fatura estornada integralmente com sucesso!");
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve estornar a fatura parcialmente com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.ESTORNAR_FATURA}`)) {resolve(response)}})})

    await paginaGerenciadorContasPagar.criarContaAPagar("#", "Rateio", "celular novo");
    console.log("Fatura criada com sucesso!");
    const criarFaturaApi = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.LIQUIDAR_FATURA}`)) {resolve(response)}})});

    criarFaturaApi.then(async (response) => {
      const responseFatura = await Servicos.checarRequisicao(response);
      const responseReturn = responseFatura.sucesso;
      const idFatura = responseReturn.match(/\s+(\d{6})/i)?.[0]!;
      console.log(idFatura);
      if (idFatura != null || idFatura != undefined) { 
        await paginaGerenciadorContasPagar.liquidarFatura(idFatura, faker.finance.amount(), true);
        await paginaGerenciadorContasPagar.estornarFatura("BB - Boleto",true,idFatura );
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
    await paginaGerenciadorContasPagar.suspenderFatura("#", "Dificuldades financeiras");
    const response = await page.waitForResponse((response) =>response.url().includes(`${API.SUSPENDER_FATURA}`));
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve suspender das faturas em massa com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.SUSPENDER_FATURA_MASSA}`)) {resolve(response)}})});
    await paginaGerenciadorContasPagar.alteracaoFaturaEmMassa("Suspender", faker.lorem.sentences());
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve remover a suspenção da fatura com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.REMOVER_SUSPENSAO_FATURA}`) ) {resolve(response)}})})

    await paginaGerenciadorContasPagar.removerSuspencaoFatura();
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve remover a suspenção de faturas em massa com sucesso", async ({page}) => {
    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.SUSPENDER_FATURA_MASSA}`) ) {resolve(response); }})});
    await page.waitForTimeout(2500);
    await paginaGerenciadorContasPagar.alteracaoFaturaEmMassa("Remover suspensão",faker.lorem.sentences());

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve excluir a fatura com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.EXCLUIR_FATURA}`) ) {resolve(response)}})})

    await paginaGerenciadorContasPagar.excluirContaAPagar();

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve alterar a fatura com sucesso", async ({ page }) => {
    await paginaGerenciadorContasPagar.alterarInfosFatura();
  });

  test("Deve anexar imagens na fatura com sucesso", async ({ page }) => {
    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.INSERIR_ANEXO_FATURA}`)) {resolve(response)}})})
    await paginaGerenciadorContasPagar.anexarArquivos(await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });
});

test.describe("Despesas", () => {
  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);

    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizarLogin(user,pass);
    paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);
    paginaGerenciadorContasPagar = await paginaFinanceiro.irParaPagina(ItensMenu.GERENCIADOR_DE_CONTAS_A_PAGAR);

    await paginaGerenciadorContasPagar.navegarParaPainel('li[id="1171825"]', 'iframe[componenteaba="Gerenciador de Contas a ReceberClosePainelAba"]');
  });
  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Did not run as expected, ended up at ${page.url()}`);
    }
  });

  test("Deve criar uma despesa fixa com rateio com sucesso", async ({page}) => {

    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.NOVA_FATURA}`)) {resolve(response); }})});

    await paginaGerenciadorContasPagar.criarDespesaFixa("#", "Rateio", "celular novo");

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve criar uma despesa fixa sem rateio com sucesso", async ({page}) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => {if (response.url().includes(`${API.NOVA_FATURA}`)) {resolve(response)}})});

    await paginaGerenciadorContasPagar.criarDespesaFixa("#", "Simples", "celular novo");

    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
  });
});

test.describe('Parcelamentos', () => {
  test("Deve criar um parcelamento com sucesso", async ({ page }) => {
      const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => { if (response.url().includes(`${API.NOVO_PARCELAMENTO}`) ) {resolve(response)}})});
      await paginaGerenciadorContasPagar.criarParcelamentos("4");
      const response = await responsePromise;
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });
});

test.describe("Paginação de resultados", () => {
  test.beforeEach(async ({ page }) => { 
    paginaLogin = new LoginPage(page);

    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizarLogin(user,pass);
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

  test.describe("Aba de faturas", () => {
    test("Deve exibir mais resultados na listagem de faturas", async ({page}) => {
      
      const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.FATURAS}?limit=100`) ) {resolve(response)}})});
      await paginaGerenciadorContasPagar.alterarQuantidadeResultados("100", "Faturas")
      const response = await responsePromise;
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve alterar a quantidade de resultados exibidos para 150", async ({page}) => {
      const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.FATURAS}?limit=150`) ) {resolve(response)}})});
      await paginaGerenciadorContasPagar.alterarQuantidadeResultados("150", "Faturas");
      const response = await responsePromise;
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a segunda página de resultados", async ({page}) => {
      const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.FATURAS}?limit=50&offset=50`) ) {resolve(response)}})})
      await paginaGerenciadorContasPagar.navegarPaginaResultados("2", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await responsePromise;
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a terceira página de resultados", async ({page}) => {
      const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.FATURAS}?limit=50&offset=100`) ) {resolve(response)}})})
      await paginaGerenciadorContasPagar.navegarPaginaResultados("3", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await responsePromise;
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve acessar a última página de resultados", async ({ page }) => {
      const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.FATURAS}?limit=50&offset=`) ) {resolve(response)}})})
      await paginaGerenciadorContasPagar.navegarPaginaResultados("ultima", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await responsePromise;
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });
  });

  test.describe("Aba de despesas fixas", () => {
    
    test.beforeEach(async ({ page }) => {
      paginaLogin = new LoginPage(page);

      await paginaLogin.entrarPaginaLogin();
      paginaPrincipal = await paginaLogin.realizarLogin(user,pass);
      paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);
      paginaGerenciadorContasPagar = await paginaFinanceiro.irParaPagina(ItensMenu.GERENCIADOR_DE_CONTAS_A_PAGAR);
  
      await paginaGerenciadorContasPagar.navegarParaPainel('li[id="1171825"]', 'iframe[componenteaba="Gerenciador de Contas a ReceberClosePainelAba"]');
    });

    test("Deve exibir mais resultados na listagem de despesas", async ({page}) => {
      await paginaGerenciadorContasPagar.alterarQuantidadeResultados("100", 'Despesas Fixas');
      const response = await page.waitForResponse((response) => response.url().includes(`${API.FATURAS}?limit=100`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve alterar a quantidade de resultados exibidos para 150", async ({page}) => {
      await paginaGerenciadorContasPagar.alterarQuantidadeResultados("150", 'Despesas Fixas');
      const response = await page.waitForResponse((response) => response.url().includes(`${API.FATURAS}?limit=150`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a segunda página de resultados", async ({page}) => {
      await paginaGerenciadorContasPagar.navegarPaginaResultados("2", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${API.FATURAS}?limit=50&offset=50`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a terceira página de resultados", async ({page}) => {
      await paginaGerenciadorContasPagar.navegarPaginaResultados("3", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${API.FATURAS}?limit=50&offset=100`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve acessar a última página de resultados", async ({ page }) => {
      await paginaGerenciadorContasPagar.navegarPaginaResultados("ultima", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${API.FATURAS}?limit=50&offset=`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });
  });

  test.describe("Aba de parcelamentos", () => {
    test.beforeEach(async ({ page }) => {
      paginaLogin = new LoginPage(page);

      await paginaLogin.entrarPaginaLogin();
      paginaPrincipal = await paginaLogin.realizarLogin(user,pass);
      paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);
      paginaGerenciadorContasPagar = await paginaFinanceiro.irParaPagina(ItensMenu.GERENCIADOR_DE_CONTAS_A_PAGAR);
  
      await paginaGerenciadorContasPagar.navegarParaPainel('li[id="1171825"]', 'iframe[componenteaba="Gerenciador de Contas a ReceberClosePainelAba"]');
    });

    test("Deve exibir mais resultados na listagem de parcelamentos", async ({page}) => {
      await paginaGerenciadorContasPagar.alterarQuantidadeResultados("100", 'Parcelamentos');
      const response = await page.waitForResponse((response) => response.url().includes(`${API.FATURAS}?limit=100`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve alterar a quantidade de resultados exibidos para 150", async ({page}) => {
      await paginaGerenciadorContasPagar.alterarQuantidadeResultados("150", 'Parcelamentos');
      const response = await page.waitForResponse((response) => response.url().includes(`${API.FATURAS}?limit=150`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a segunda página de resultados", async ({page}) => {
      await paginaGerenciadorContasPagar.navegarPaginaResultados("2", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${API.FATURAS}?limit=50&offset=50`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a terceira página de resultados", async ({page}) => {
      await paginaGerenciadorContasPagar.navegarPaginaResultados("3", await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${API.FATURAS}?limit=50&offset=100`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve acessar a última página de resultados", async ({ page }) => {
      await paginaGerenciadorContasPagar.navegarPaginaResultados("ultima", await await paginaGerenciadorContasPagar.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${API.FATURAS}?limit=50&offset=`));
      expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    });
  });
});

test.describe("Faturas vencidas", () => {

  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);

    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizarLogin(user,pass);
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

  test("Deve validar o somatório da quantidade de faturas vencidas", async ({ page}) => {
    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${API.INFO_CARDS}`) ) {resolve(response) }})})
    await paginaGerenciadorContasPagar.validarSomatorioFaturasVencidas();
    const response = await responsePromise;
    expect(Servicos.checarRequisicao(response)).toBeTruthy();
  });
  
  test("Deve validar o somatório do faker.finance.amount() total de faturas vencidas", async () => {});

  test("Deve validar o somatório de faturas que vencem hoje", async () => {});

  test("Deve validar o somatório de faturas a vencer nos próximos 7 dias", async () => {});

  test("Deve validar o somatório de faturas a vencer nos próximos 30 dias", async () => {});
}); 