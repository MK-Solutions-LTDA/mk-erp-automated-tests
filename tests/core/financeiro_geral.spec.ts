import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/Pages/LoginPage";
import { MainPage } from "../../src/Pages/MainPage";
import { TipoDePagina } from "../../src/Utils/TipoDePagina";
import { FinanceiroPage } from "../../src/Pages/FinanceiroPage";
import { url } from "../../Setup";
import Services from "../../src/utils/Services";

let paginaLogin: LoginPage;
let paginaPrincipal: MainPage;
let paginaFinanceiro: FinanceiroPage;

test.describe("Financeiro geral", () => {
    test.beforeEach(async ({ page }) => {
      paginaLogin = new LoginPage(page);
  
      await paginaLogin.entrarPaginaLogin();
      paginaPrincipal = await paginaLogin.realizar_login();
      paginaFinanceiro = await paginaPrincipal.irParaPagina(
        TipoDePagina.FINANCEIRO
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
});