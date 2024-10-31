import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/paginas/LoginPage";
import { MainPage } from "../../src/paginas/MainPage";
import { TipoPagina } from "../../src/utilitarios/TipoPagina";
import { ConfigPage } from "../../src/paginas/ConfigPage";
import { url } from "../../Setup";

test.describe("CRUD Feriados", () => {
  let paginaLogin: LoginPage;
  let paginaPrincipal: MainPage;
  let paginaConfiguracoes: ConfigPage;

  test.beforeEach(async ({ page }) => {
    paginaLogin = new LoginPage(page);
    console.log(`Running ${test.info().title}`);

    await paginaLogin.entrarPaginaLogin();
    console.log("Realizando login");
    paginaPrincipal = await paginaLogin.realizar_login();
    console.log("Entrando na página de configurações");
    paginaConfiguracoes = await paginaPrincipal.irParaPagina(
      TipoPagina.CONFIGURACOES
    );
    console.log("Entrando no submenu de feriados");
    await paginaConfiguracoes.entrarNoSubmenuFeriado(url);
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(`Did not run as expected, ended up at ${page.url()}`);
    }
  });

  test("Deve criar um feriado com sucesso", async () => {
    console.log("Criando feriado");
    const result = await paginaConfiguracoes.createFeriado("teste de automacao 2", "21", "Março");
    expect(result).toBeTruthy();
  });

  test("Deve ler um feriado com sucesso", async () => {
    console.log("Lendo feriado");
    const result = await paginaConfiguracoes.readFeriado("teste de automacao 2");
    expect(result).toBeTruthy();
  });

  test("Deve apagar um feriado com sucesso", async () => {
    console.log("Apagando feriado");
    const result = await paginaConfiguracoes.deleteFeriado("teste de automacao 2");
    expect(result).toBeTruthy();
  });

  test("Deve editar um feriado com sucesso", async () => {
    console.log("Editando feriado");
    const result = await paginaConfiguracoes.updateFeriado("teste de automacao 2", "teste de automacao editado", "22", "Abril");
    expect(result).toBeTruthy();
  });
});
