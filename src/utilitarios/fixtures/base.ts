import { test as base } from "@playwright/test";
import { FinanceiroPage } from "../../paginas/FinanceiroPage";
import { LoginPage } from "../../paginas/LoginPage";
import { MainPage } from "../../paginas/MainPage";
import { TipoPagina } from "../TipoPagina";
import BotNovo from "../../paginas/subpaginas/bot/BotNovo";

export const test = base.extend<{
  paginaLogin: LoginPage;
  paginaPrincipal: MainPage;
  paginaFinanceiro: FinanceiroPage;
  paginaBotNovo: BotNovo;
  // paginafinanceirobot: FinanceiroBotPage;
}>({
  
  paginaLogin: async ({ page }, use) => {
    const paginaLogin = new LoginPage(page);
    await paginaLogin.entrarPaginaLogin();
    await use(paginaLogin);
  },

  paginaPrincipal: async ({ paginaLogin }, use) => {
    const paginaPrincipal = await paginaLogin.realizar_login();
    await use(paginaPrincipal);
  },

  paginaFinanceiro: async ({ paginaPrincipal }, use) => {
    const paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);
    await use(paginaFinanceiro);
  },

  paginaBotNovo: async ({ paginaPrincipal, context }, use) => {
    const pagePromise = context.waitForEvent('page');
    await paginaPrincipal.irParaPagina(TipoPagina.BOT);
    const newPage = await pagePromise;
    const paginaBotNovo = new BotNovo(newPage);
    await use(paginaBotNovo);
    await newPage.waitForLoadState('load');
    await paginaBotNovo.limparConversa();
    await newPage.close();
    await context.close();
  }

  // paginafinanceirobot: async ({ paginaFinanceiro }, use) => {})

});

export const expect = base.expect;