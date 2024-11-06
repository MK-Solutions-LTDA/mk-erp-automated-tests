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

  paginaBotNovo: async ({ paginaPrincipal }, use) => {
    const paginaBot = await paginaPrincipal.irParaPagina(TipoPagina.BOT);
    await use(paginaBot);
    await paginaBot.limparConversa();
  }

});

export const expect = base.expect;