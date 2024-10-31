import { Page, Frame } from "@playwright/test";
import step from "../utilitarios/decorators";
import path from "path";

const folderImagens = path.join(process.cwd(), "/src/imagens");

export default class BasePage {
  page: Page;
  telaAtual: Frame | null | undefined;

  constructor(page: Page) {
    this.page = page;
    this.telaAtual = null;
  }

  @step('Navegar para painel')
  async navegarParaPainel(seletorBotaoAba: string, seletorIframe: string) {
    await this.definirFramesPrincipais();
    const framePainelElementos = await this.mudarParaIframe('iframe[name="mainform"]', this.telaAtual);
    await framePainelElementos?.waitForSelector(seletorBotaoAba);
    await framePainelElementos?.click(seletorBotaoAba);
    this.telaAtual = await this.mudarParaIframe(seletorIframe, framePainelElementos);
  }

  @step('Definir frames principais')
  async definirFramesPrincipais() {
    const frameSys = await (await this.page.$('frame[name="mainsystem"]'))?.contentFrame();
    this.telaAtual = await (await frameSys?.$('iframe[name="mainform"]'))?.contentFrame();
  }

    
  @step('Preencher campo de busca')
  async preencherCampoBusca(data: string) {
    await this.telaAtual?.getByPlaceholder("Clique para buscar").click();
    await this.telaAtual?.getByPlaceholder("Clique para buscar").pressSequentially(data);
  }

  @step('Clicar no botão com texto')
  async clicarBotaoComTexto(text: string) { await this.telaAtual?.locator("button", { hasText: new RegExp(text, "gim") }).first().click(); }
  
  @step('Clicar no botão com nome')
  async clicarBotaoComNome(name: string | RegExp) { await this.telaAtual?.getByRole("button", { name: name }).first().click() }

  @step('Clicar no botão com texto')
  async clicarTexto(texto: string) { await this.telaAtual?.getByText(texto).click() }

  @step('Mudar para iframe')
  async mudarParaIframe(seletor: string, parentFrame?: Frame | Page | null) {
    const frame = parentFrame ? await parentFrame.$(seletor) : await this.page.$(seletor);
    return frame ? await frame.contentFrame() : null;
  }

  @step('Aplicar filtro')
  async aplicarFiltro() {
    await this.telaAtual?.getByRole("button", { name: "Aplicar" }).click();
  }

  @step('Clicar no botão')
  async clicarBotao(funcao: any, nome?: string | RegExp) {
    await this.telaAtual?.getByRole(funcao, { name: nome }).first().click();
  }

  @step('Clicar no botão de filtro')
  async clicarBotaoFiltro() {
    await this.telaAtual?.locator(".w-\\[32px\\]").first().click();
  }

  @step('Anexar arquivos')
  async incluirArquivos() {
    await this.telaAtual?.locator('input[type="file"]').first().setInputFiles([
      path.join(`${folderImagens}/cami.jpeg`),
      path.join(`${folderImagens}/carol.png`),
      path.join(`${folderImagens}/manu.jpg`),
      path.join(`${folderImagens}/will.jpg`),
    ]);
  }

  @step("Adicionar anexos na fatura")
  async anexarArquivos() {
    await this.page.waitForTimeout(2000);
    await this.clicarBotao("button", "Pendentes");
    await this.page.waitForTimeout(2000);
    await this.telaAtual?.getByRole("button", { name: "Suspensas" }).click();
    await this.telaAtual?.getByRole("row", { name: /(\d{6})/gim }).getByRole("button").nth(2).click();
    await this.telaAtual?.getByRole("button", { name: "Anexos" }).click();
    await this.incluirArquivos();
    await this.clicarBotao("button", "Salvar anexos");
  }

  @step("Navegar para a tela especificada")
  async navegarParaTela(selectoresDeIframes: string[]): Promise<Frame | null> {
    await this.page.waitForLoadState("domcontentloaded");
    let frameAtual: Frame | null | Page = this.page;

    for (const seletor of selectoresDeIframes) {
      frameAtual = await this.mudarParaIframe(seletor, frameAtual);
      if (!frameAtual) {
        console.error(`Não foi possível encontrar o iframe com o seletor: ${seletor}`);
        return null;
      }
    }

    this.telaAtual = frameAtual as Frame;
    return this.telaAtual;
  }
}