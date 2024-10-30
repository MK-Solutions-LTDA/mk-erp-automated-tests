import { test as base } from "@playwright/test";
import { FinanceiroPage } from "../Pages/FinanceiroPage";
import { LoginPage } from "../Pages/LoginPage";
import { MainPage } from "../Pages/MainPage";
import { TipoDePagina } from "../../src/Utils/TipoDePagina";

export const test = base.extend<{
  paginaLogin: LoginPage;
  paginaPrincipal: MainPage;
  paginaFinanceiro: FinanceiroPage;
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
    const paginaFinanceiro = await paginaPrincipal.irParaPagina(TipoDePagina.FINANCEIRO);
    await use(paginaFinanceiro);
  },
  
});
