import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/Pages/LoginPage";
import { MainPage } from "../../src/Pages/MainPage";
import { TipoDePagina } from "../../src/Utils/TipoDePagina";
import { FinanceiroPage } from "../../src/Pages/FinanceiroPage";
import { url } from "../../Setup";

let paginaLogin: LoginPage;
let paginaPrincipal: MainPage;
let paginaFinanceiro: FinanceiroPage;

test.use({
  video: { mode: "on", size: { width: 1920, height: 1080 } },
  screenshot: { mode: "on", fullPage: true },
});


test.describe("DRE Gerencial", () => {

  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);
    console.log(`Rodando ${test.info().title}`);

    await paginaLogin.entrarPaginaLogin();
    paginaPrincipal = await paginaLogin.realizar_login();
    paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoDePagina.FINANCEIRO);
    await paginaFinanceiro.navegarParaPainel(
      'li[id="853772"]',
      'iframe[componenteaba="DRE GerencialClosePainelAba"]'
    );
  });
  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Terminou ${testInfo.title} com status: ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Não rodou com esperado, finalizou na url:  ${page.url()}`);
    }
    await page.context().close();
    await page.close();
  });
  test("Deve gerar relatorio mensal com sucesso", async ({ page }) =>{
    await paginaFinanceiro.gerarMensalDRE();
    const responsePromise = await page.waitForResponse(`${url}/mk/WSMKDRERelatorio.rule?sys=MK0`);
    const response = await responsePromise;
    expect(response?.ok()).toBeTruthy();
  });
  test("Deve gerar relatorio anual com sucesso", async ({ page }) =>{
    await paginaFinanceiro.gerarAnualDRE();
    const responsePromise = await page.waitForResponse(`${url}/mk/WSMKDRERelatorio.rule?sys=MK0`);
    const response = await responsePromise;
    expect(response?.ok()).toBeTruthy();
  });
  test("Deve baixar relatorio anual com sucesso", async ({ page }) =>{
    await paginaFinanceiro.gerarAnualDRE();
    await page.waitForResponse(`${url}/mk/WSMKDRERelatorio.rule?sys=MK0`);
    await paginaFinanceiro.baixarDRE();
    expect(
      page.on('download', download => {
        expect(download.suggestedFilename()).toBe('DRE_ANUAL.pdf');
      })
    )
  });
  test("Deve imprimir relatorio anual com sucesso", async ({ page }) =>{
    await paginaFinanceiro.gerarAnualDRE();
    await paginaFinanceiro.imprimirDRE();
  });
});