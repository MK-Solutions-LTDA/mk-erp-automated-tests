// import { test, expect } from "@playwright/test";
// import { LoginPage } from "../../src/paginas/LoginPage";
// import { MainPage } from "../../src/paginas/MainPage";
// import { TipoPagina } from "../../src/utilitarios/tipopagina.ts";
// import { URL } from "../../Setup";
// import { DreGerencial } from "../../src/paginas/subpaginas/financeiro/DreGerencial";

// let paginaLogin: LoginPage;
// let paginaPrincipal: MainPage;
// let PaginaDreGerencial: DreGerencial;

// test.use({
//   video: { mode: "on", size: { width: 1920, height: 1080 } },
//   screenshot: { mode: "on", fullPage: true },
// });


// test.describe("DRE Gerencial", () => {

//   test.beforeEach(async ({ page }) => {
//     paginaLogin = new LoginPage(page);
//     console.log(`Rodando ${test.info().title}`);

//     await paginaLogin.entrarPaginaLogin();
//     paginaPrincipal = await paginaLogin.realizar_login(user, pass);
//     PaginaDreGerencial = await paginaPrincipal.irParaPagina(TipoPagina.FINANCEIRO);
//     await PaginaDreGerencial.navegarParaPainel(
//       'li[id="853772"]',
//       'iframe[componenteaba="DRE GerencialClosePainelAba"]'
//     );
//   });
//   test.afterEach(async ({ page }, testInfo) => {
//     console.log(`Terminou ${testInfo.title} com status: ${testInfo.status}`);
//     if (testInfo.status !== testInfo.expectedStatus) {
//       console.log(`Não rodou com esperado, finalizou na url:  ${page.url()}`);
//     }
//     await page.context().close();
//     await page.close();
//   });
//   test("Deve gerar relatorio mensal com sucesso", async ({ page }) =>{
//     await PaginaDreGerencial.gerarMensalDRE();
//     const responsePromise = await page.waitForResponse(`${url}/mk/WSMKDRERelatorio.rule?sys=MK0`);
//     const response = await responsePromise;
//     expect(response?.ok()).toBeTruthy();
//   });
//   test("Deve gerar relatorio anual com sucesso", async ({ page }) =>{
//     await PaginaDreGerencial.gerarAnualDRE();
//     const responsePromise = await page.waitForResponse(`${url}/mk/WSMKDRERelatorio.rule?sys=MK0`);
//     const response = await responsePromise;
//     expect(response?.ok()).toBeTruthy();
//   });
//   test("Deve baixar relatorio anual com sucesso", async ({ page }) =>{
//     await PaginaDreGerencial.gerarAnualDRE();
//     await page.waitForResponse(`${url}/mk/WSMKDRERelatorio.rule?sys=MK0`);
//     await PaginaDreGerencial.baixarDRE();
//     expect(
//       page.on('download', download => {
//         expect(download.suggestedFilename()).toBe('DRE_ANUAL.pdf');
//       })
//     )
//   });
//   test("Deve imprimir relatorio anual com sucesso", async ({ page }) =>{
//     await PaginaDreGerencial.gerarAnualDRE();
//     await PaginaDreGerencial.imprimirDRE();
//   });
// });