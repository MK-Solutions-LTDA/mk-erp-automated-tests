import { Page, Frame } from "@playwright/test";

export default class BasePage {
  page: Page;

  frameSys: Frame | null | undefined;
  frameSysElem: Frame | null | undefined;
  framePainelElementos: Frame | null = null;
  frameAba: Frame | null = null;
  frameAbaElementos: Frame | null = null;
  framePainel: Frame | null = null;

  constructor(page: Page) {
    this.page = page;
  }

  async definirFramesPrincipais() {
    this.frameSys = await (
      await this.page.$('frame[name="mainsystem"]')
    )?.contentFrame();
    this.frameSysElem = await (
      await this.frameSys?.$('iframe[name="mainform"]')
    )?.contentFrame();
  }

  async navegarParaPainel(seletorBotaoAba: string, seletorIframe: string) {
    if (!this.frameSysElem) await this.definirFramesPrincipais();

    this.framePainel = await this.definirFramePainelPrincipal();
    this.framePainelElementos = await this.definirFramePainelElementos();

    await this.framePainelElementos?.waitForSelector(seletorBotaoAba);
    await this.framePainelElementos?.click(seletorBotaoAba);

    this.frameAba = await this.definirFrameAba(seletorIframe);
    this.frameAbaElementos = await this.definirFrameAbaElementos();
  }

  async definirFrameJanela(frameSelector: string) {
    await this.frameSys?.waitForSelector(frameSelector);
    const conteudo = await (
      await this.frameSys?.$("div.FormIframe > iframe")
    )?.contentFrame();
    await conteudo?.waitForSelector('iframe[name="mainform"]');
    const elementos = await (
      await conteudo?.$('iframe[name="mainform"]')
    )?.contentFrame();

    return {
      conteudo,
      elementos,
    };
  }

  async mudarParaIframe(seletor: string, parentFrame?: Frame | Page | null) {
    const frame = parentFrame ? await parentFrame.$(seletor) : await this.page.$(seletor);
    return frame ? await frame.contentFrame() : null;
  }

  async definirFramePainelPrincipal() {
    await this.frameSysElem?.waitForSelector(
      'iframe[componenteaba="Financeiro - PainelCloseAbaPrincipal"]'
    );
    return this.mudarParaIframe(
      'iframe[componenteaba="Financeiro - PainelCloseAbaPrincipal"]',
      this.frameSysElem
    );
  }

  async definirFramePainelElementos() {
    return this.mudarParaIframe('iframe[name="mainform"]', this.framePainel);
  }

  async definirFrameAba(seletorIframe: string) {
    await this.framePainelElementos?.waitForSelector(seletorIframe);
    return this.mudarParaIframe(seletorIframe, this.framePainelElementos);
  }

  async definirFrameAbaElementos() {
    return this.mudarParaIframe('iframe[name="mainform"]', this.frameAba);
  }
  
}