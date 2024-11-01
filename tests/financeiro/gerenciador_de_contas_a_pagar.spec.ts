import { expect } from "@playwright/test";
import { test } from "../../src/fixtures/base";
import { LoginPage } from "../../src/Pages/LoginPage";
import { TipoDePagina } from "../../src/Utils/TipoDePagina";
import { url } from "../../Setup";
import Services from "../../src/utils/Services";
import { faker } from "@faker-js/faker/locale/pt_BR";

// test.use({
//   video: { mode: "on", size: { width: 1920, height: 1080 } },
//   screenshot: { mode: "on", fullPage: true },
// });

const descricao = faker.lorem.words(5);
const data = faker.date.future().toLocaleDateString();
const valor = faker.number.int({ min: 100, max: 1000 }).toString();

test.describe('Faturas',() => {

  test.beforeEach(async ({ page, paginaLogin, paginaPrincipal, paginaFinanceiro }) => {
    await paginaFinanceiro.navegarParaPainel(
      'li[id="1878993"]',
      'iframe[componenteaba="Gerenciador de Contas a PagarClosePainelAba"]'
    );
  });

  test.afterEach(async ({ page, paginaFinanceiro }, testInfo) => {
    console.log(`Terminou ${testInfo.title} com status: ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Não rodou com esperado, finalizou na url:  ${page.url()}`);
    }
    await page.context().close();
    await page.close();
  });

  test("Deve criar uma fatura sem rateio com sucesso", async ({ page, paginaFinanceiro }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {return resolve(response); }
      });
    });

    await paginaFinanceiro.criarContaAPagar(
      "#",
      descricao,
      data,
      valor,
      "Simples",
      "celular novo"
    );
    console.log("Fatura sem rateio criada com sucesso!");
    const response = await responsePromise;
    expect(await Services.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve criar uma fatura com rateio com sucesso", async ({ page, paginaFinanceiro }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {resolve(response); }
      });
    });

    await paginaFinanceiro.criarContaAPagar(
      "#",
      descricao,
      data,
      valor,
      "Rateio",
      "celular novo"
    );
    
    console.log("Fatura com rateio criada com sucesso!");

    const response = await responsePromise;

    expect(await Services.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve liquidar parcialmente a fatura com sucesso", async ({ page, paginaFinanceiro }) => {
    await paginaFinanceiro.criarContaAPagar(
      "#",
      descricao,
      data,
      valor,
      "Rateio",
      "celular novo"
    );

    const criarFaturaApi = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {resolve(response); }
      });
    });

    criarFaturaApi.then(async (response) => {
      const responseFatura = await Services.checarRequisicao(response);
      const idFatura = responseFatura.sucesso.match(/Fatura\s+(\d{6})/i)?.[1]!;
      console.log(idFatura);
      if (!idFatura) { throw new Error("Não foi possível encontrar o ID da fatura");
      }
      if (idFatura != null || idFatura != undefined) { await paginaFinanceiro.liquidarFatura(idFatura, valor, true); console.log("Fatura liquidada parcialmente com sucesso!");
      }
    });

    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPLiquidarFatura.rule`)) {resolve(response); }
      });
    });

    const response = await responsePromise;
    expect(await Services.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve liquidar integralmente a fatura com sucesso", async ({ page, paginaFinanceiro }) => {
    await paginaFinanceiro.criarContaAPagar(
      "#",
      descricao,
      data,
      valor,
      "Rateio",
      "celular novo"
    );

    const criarFaturaApi = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {resolve(response); }
      });
    });

    criarFaturaApi.then(async (response) => {
      const responseFatura = await Services.checarRequisicao(response);
      const idFatura = responseFatura.sucesso.match(/Fatura\s+(\d{6})/i)?.[1]!;
      console.log(idFatura);
      if (!idFatura) { throw new Error("Não foi possível encontrar o ID da fatura");
      }
      if (idFatura != null || idFatura != undefined) { await paginaFinanceiro.liquidarFatura(idFatura, valor, false); console.log("Fatura liquidada integralmente com sucesso!");
      }
    });

    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPLiquidarFatura.rule`)) {resolve(response); }
      });
    });

    const response = await responsePromise;
    expect(await Services.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve liquidar as faturas em massa com sucesso", async ({ page, paginaFinanceiro }) => {
    console.log("Liquidando faturas em massa...");
    await paginaFinanceiro.alteracaoFaturaEmMassa("Pagar", descricao);
    console.log("Faturas liquidadas com sucesso!");
    console.log("Chamando a requisição...");
    const response = await page.waitForResponse((response) =>
      response
      .url()
      .includes(`${url}/mk/WSMKCPLiquidarFaturasMassa.rule?`)
    );
    console.log("Requisição concluída!");
    console.log("Checando se a requisição foi bem-sucedida...");
    expect(await Services.checarRequisicao(response)).toBeTruthy();
    console.log("Requisição bem-sucedida!");
  });

  test("Deve estornar a fatura integralmente com sucesso", async ({ page, paginaFinanceiro }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPEstornarFatura.rule`)) {resolve(response); }
      });
    });

    await paginaFinanceiro.estornarFatura(
      'BB - Boleto',
      false
    );
    console.log("Fatura estornada integralmente com sucesso!");
    const response = await responsePromise;
    expect(await Services.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve estornar a fatura parcialmente com sucesso", async ({ page, paginaFinanceiro }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPEstornarFatura.rule`)) {resolve(response); }
      });
    });

    await paginaFinanceiro.criarContaAPagar(
      "#",
      descricao,
      data,
      valor,
      "Rateio",
      "celular novo"
    );
    console.log("Fatura criada com sucesso!");
    const criarFaturaApi = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {resolve(response); }
      });
    });

    criarFaturaApi.then(async (response) => {
      const responseFatura = await Services.checarRequisicao(response);
      const idFatura = responseFatura.sucesso.match(/Fatura\s+(\d{6})/i)?.[1]!;
      console.log(idFatura);
      if (!idFatura) { throw new Error("Não foi possível encontrar o ID da fatura");
      }
      if (idFatura != null || idFatura != undefined) { await paginaFinanceiro.liquidarFatura(idFatura, valor, true); await paginaFinanceiro.estornarFatura("BB - Boleto",true,idFatura ); console.log("Fatura estornada com sucesso!");
      }
    });
    const response = await responsePromise;
    expect(await Services.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve estornar as faturas em massa com sucesso", async ({ page, paginaFinanceiro }) => {
    console.log("Estornando faturas em massa...");
    await paginaFinanceiro.alteracaoFaturaEmMassa("Estornar", descricao);
  });

  test("Deve suspender a fatura com sucesso", async ({ page, paginaFinanceiro }) => {
    console.log("Suspendendo fatura...");
    await paginaFinanceiro.suspenderFatura("#", "Dificuldades financeiras");
    console.log("Fatura suspensa com sucesso!");
    console.log("Chamando a requisição...");
    const response = await page.waitForResponse((response) =>
      response
      .url()
      .includes(`${url}/mk/WSMKCPFaturaSuspensao.rule`)
    );
    console.log("Requisição concluída!");
    console.log("Checando se a requisição foi bem-sucedida...");
    expect(await Services.checarRequisicao(response)).toBeTruthy();
    console.log("Requisição bem-sucedida!");
  });

  test("Deve suspender das faturas em massa com sucesso", async ({ page, paginaFinanceiro }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturaSuspensaoMassa.rule`)) {resolve(response); }
      });
    });

    await paginaFinanceiro.alteracaoFaturaEmMassa("Suspender", descricao);
    console.log("Faturas suspensas com sucesso!");
    const response = await responsePromise;
    expect(await Services.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve remover a suspenção da fatura com sucesso", async ({ page, paginaFinanceiro }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturaRemoverSuspencao.rule`) ) {resolve(response); }
      });
    });

    await paginaFinanceiro.removerSuspencaoFatura();
    console.log("Suspenção removida da fatura com sucesso!");
    const response = await responsePromise;
    expect(await Services.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve remover a suspenção de faturas em massa com sucesso", async ({page, paginaFinanceiro}) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturaRemoverSuspensaoMassa.rule`) ) {resolve(response); }
      });
    });

    await paginaFinanceiro.alteracaoFaturaEmMassa(
      "Remover suspensão",
      descricao
    );

    const response = await responsePromise;
    expect(await Services.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve excluir a fatura com sucesso", async ({ page, paginaFinanceiro }) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturaExclusao.rule?`) ) {resolve(response); }
      });
    });

    await paginaFinanceiro.excluirFatura();

    const response = await responsePromise;
    expect(await Services.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve alterar a fatura com sucesso", async ({paginaFinanceiro}) => {
    console.log("Alterando fatura...");
    await paginaFinanceiro.alterarInfosFatura();
    console.log("Faturas alteradas com sucesso!");
  });

  test("Deve anexar imagens na fatura com sucesso", async ({ page, paginaFinanceiro }) => {
    console.log("Anexando imagens na fatura...");
    await paginaFinanceiro.anexarArquivosFatura();
    console.log("Imagens adicionadas com sucesso!");
    console.log("Chamando a requisição...");
    const response = await page.waitForResponse((response) =>
      response.url().includes(`${url}/mk/WSMKCPFaturaInserirAnexo.rule?`)
    );
    console.log("Requisição concluída!");
    console.log("Checando se a requisição foi bem-sucedida...");
    expect(await Services.checarRequisicao(response)).toBeTruthy();
    console.log("Requisição bem-sucedida!");
  });
});

test.describe("Despesas", () => {
  test.beforeEach(async ({ page, paginaFinanceiro, paginaLogin, paginaPrincipal }) => {
    paginaLogin = new LoginPage(page);
    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizar_login();
    paginaFinanceiro = await paginaPrincipal.irParaPagina(
      TipoDePagina.FINANCEIRO
    );

    await paginaFinanceiro.navegarParaPainel(
      'li[id="1878993"]',
      'iframe[componenteaba="Gerenciador de Contas a PagarClosePainelAba"]'
    );
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Did not run as expected, ended up at ${page.url()}`);
    }
  });

  test("Deve criar uma despesa fixa com rateio com sucesso", async ({page, paginaFinanceiro}) => {
    const responsePromise = new Promise(async (resolve) => {
      page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {resolve(response); }
      });
    });

    await paginaFinanceiro.criarDespesaFixa("#", "Rateio", "celular novo");

    const response = await responsePromise;
    expect(await Services.checarRequisicao(response)).toBeTruthy();
  });

  test("Deve criar uma despesa fixa sem rateio com sucesso", async ({page, paginaFinanceiro}) => {
    const responsePromise = new Promise(async (resolve) => {page.on("response", (response) => {if (response.url().includes(`${url}/mk/WSMKCPNovaFatura.rule`)) {resolve(response)}})});

    await paginaFinanceiro.criarDespesaFixa("#", "Simples", "celular novo");

    const response = await responsePromise;
    expect(await Services.checarRequisicao(response)).toBeTruthy();
  });
});

test.describe('Parcelamentos', () => {
  test("Deve criar um parcelamento com sucesso", async ({ page, paginaFinanceiro }) => {
      const responsePromise = new Promise(async (resolve) => {
        page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPNovoParcelamento.rule?`) ) {resolve(response); }});
      });
      await paginaFinanceiro.criarParcelamentos("4");
      const response = await responsePromise;
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });
  });

test.describe("Paginação de resultados", () => {
  test.beforeEach(async ({ page, paginaLogin, paginaPrincipal, paginaFinanceiro }) => { 
    await paginaFinanceiro.navegarParaPainel(
      'li[id="1878993"]',
      'iframe[componenteaba="Gerenciador de Contas a PagarClosePainelAba"]'
    );
  });

  test.afterEach(async ({ page, paginaFinanceiro }, testInfo) => {
    console.log(`Terminou ${testInfo.title} com status: ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Não rodou com esperado, finalizou na url:  ${page.url()}`);
    }
    await page.context().close();
    await page.close();
  });

  test.describe("Aba de faturas", () => {
    test("Deve exibir mais resultados na listagem de faturas", async ({page, paginaFinanceiro}) => {
      
      const responsePromise = new Promise(async (resolve) => {
        page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=100`) ) {resolve(response); }});
      });
      await paginaFinanceiro.alterarQuantidadeResultados("100", "Faturas")
      const response = await responsePromise;
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve alterar a quantidade de resultados exibidos para 150", async ({page, paginaFinanceiro}) => {
      const responsePromise = new Promise(async (resolve) => {
        page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=150`) ) {resolve(response); }
        });
      });
      await paginaFinanceiro.alterarQuantidadeResultados("150", "Faturas");
      const response = await responsePromise;
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a segunda página de resultados", async ({page, paginaFinanceiro}) => {
      const responsePromise = new Promise(async (resolve) => {
        page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=50`) ) {resolve(response); }
        });
      });
      await paginaFinanceiro.navegarPaginaResultados("2", await paginaFinanceiro.navegarParaContasAPagarTela());
      const response = await responsePromise;
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a terceira página de resultados", async ({page, paginaFinanceiro}) => {
      const responsePromise = new Promise(async (resolve) => {
        page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=100`) ) {resolve(response); }
        });
      });
      await paginaFinanceiro.navegarPaginaResultados("3", await paginaFinanceiro.navegarParaContasAPagarTela());
      const response = await responsePromise;
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve acessar a última página de resultados", async ({ page, paginaFinanceiro }) => {
      const responsePromise = new Promise(async (resolve) => {
        page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=`) ) {resolve(response); }
        });
      });
      await paginaFinanceiro.navegarPaginaResultados("ultima", await paginaFinanceiro.navegarParaContasAPagarTela());
      const response = await responsePromise;
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });
  });

  test.describe("Aba de despesas fixas", () => {
    
    test.beforeEach(async ({ page, paginaFinanceiro, paginaLogin, paginaPrincipal }) => {
      await paginaFinanceiro.navegarParaPainel(
        'li[id="1878993"]',
        'iframe[componenteaba="Gerenciador de Contas a PagarClosePainelAba"]'
      );
    });

    test("Deve exibir mais resultados na listagem de despesas", async ({page, paginaFinanceiro}) => {
      await paginaFinanceiro.alterarQuantidadeResultados("100", 'Despesas Fixas');
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=100`));
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve alterar a quantidade de resultados exibidos para 150", async ({page, paginaFinanceiro}) => {
      await paginaFinanceiro.alterarQuantidadeResultados("150", 'Despesas Fixas');
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=150`));
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a segunda página de resultados", async ({page, paginaFinanceiro}) => {
      await paginaFinanceiro.navegarPaginaResultados("2", await paginaFinanceiro.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=50`));
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a terceira página de resultados", async ({page, paginaFinanceiro}) => {
      await paginaFinanceiro.navegarPaginaResultados("3", await paginaFinanceiro.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=100`));
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve acessar a última página de resultados", async ({ page, paginaFinanceiro }) => {
      await paginaFinanceiro.navegarPaginaResultados("ultima", await paginaFinanceiro.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=`));
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });
  });

  test.describe("Aba de parcelamentos", () => {
    test.beforeEach(async ({ page, paginaFinanceiro, paginaLogin, paginaPrincipal }) => {
      await paginaFinanceiro.navegarParaPainel( 'li[id="1878993"]', 'iframe[componenteaba="Gerenciador de Contas a PagarClosePainelAba"]');
    });
    test("Deve exibir mais resultados na listagem de parcelamentos", async ({page, paginaFinanceiro}) => {
      await paginaFinanceiro.alterarQuantidadeResultados("100", 'Parcelamentos');
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=100`));
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve alterar a quantidade de resultados exibidos para 150", async ({page, paginaFinanceiro}) => {
      await paginaFinanceiro.alterarQuantidadeResultados("150", 'Parcelamentos');
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=150`));
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a segunda página de resultados", async ({page, paginaFinanceiro}) => {
      await paginaFinanceiro.navegarPaginaResultados("2", await paginaFinanceiro.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=50`));
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve navegar para a terceira página de resultados", async ({page, paginaFinanceiro}) => {
      await paginaFinanceiro.navegarPaginaResultados("3", await paginaFinanceiro.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=100`));
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });

    test("Deve acessar a última página de resultados", async ({ page, paginaFinanceiro }) => {
      await paginaFinanceiro.navegarPaginaResultados("ultima", await await paginaFinanceiro.navegarParaContasAPagarTela());
      const response = await page.waitForResponse((response) => response.url().includes(`${url}/mk/WSMKCPFaturas.rule?limit=50&offset=`));
      expect(await Services.checarRequisicao(response)).toBeTruthy();
    });
  });
});

test.describe("Faturas vencidas", () => {

  test.beforeEach(async ({ page, paginaFinanceiro, paginaLogin, paginaPrincipal }) => {
    paginaLogin = new LoginPage(page);
    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizar_login();
    paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoDePagina.FINANCEIRO);
    await paginaFinanceiro.navegarParaPainel('li[id="1878993"]', 'iframe[componenteaba="Gerenciador de Contas a PagarClosePainelAba"]');
    const contasAPagarTela = await await paginaFinanceiro.navegarParaContasAPagarTela();
    await contasAPagarTela?.getByText("Faturas Vencidas").click();
  });

  test.afterEach(async ({ page, paginaFinanceiro }, testInfo) => {
    console.log(`Terminou ${testInfo.title} com status: ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Não rodou com esperado, finalizou na url:  ${page.url()}`);
    }
    await page.context().close();
    await page.close();
  });

  test("Deve validar o somatório da quantidade de faturas vencidas", async ({ page, paginaFinanceiro}) => {
    const responsePromise = new Promise(async (resolve) => { page.on("response", (response) => { if (response.url().includes(`${url}/mk/WSMKCPCardsInfoFaturas.rule?`) ) {resolve(response) }})})
    await paginaFinanceiro.validarSomatorioFaturasVencidas();
    const response = await responsePromise;
    expect(Services.checarRequisicao(response)).toBeTruthy();
  });
  
  test("Deve validar o somatório do valor total de faturas vencidas", async () => {});

  test("Deve validar o somatório de faturas que vencem hoje", async () => {});

  test("Deve validar o somatório de faturas a vencer nos próximos 7 dias", async () => {});

  test("Deve validar o somatório de faturas a vencer nos próximos 30 dias", async () => {});
}); 