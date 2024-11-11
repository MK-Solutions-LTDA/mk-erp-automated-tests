import { expect, Page } from "@playwright/test";
import BasePage from "../../BasePage"
import step from "../../../utilitarios/decorators";

export class DreGerencial extends BasePage {

  constructor(page: Page) { super(page); }

    
  @step('Navegar para a tela de DRE Gerenencial')
  async navegarParaDRETela() {
    await this.page.waitForLoadState('load');
    const mainsystem = await this.mudarParaIframe('frame[name="mainsystem"]', this.page);
    const mainform = await this.mudarParaIframe('iframe[name="mainform"]', mainsystem);
    const financeiroAba = await this.mudarParaIframe('iframe[componenteaba="Financeiro - PainelCloseAbaPrincipal"]',mainform);
    const mainform2 = await this.mudarParaIframe('iframe[name="mainform"]',financeiroAba);
    const gerenciadorContas = await this.mudarParaIframe('iframe[componenteaba="DRE GerencialClosePainelAba"]', mainform2);
    await this.page.waitForTimeout(10 * 1000)
    const mainform3 = await this.mudarParaIframe('iframe[name="mainform"]', gerenciadorContas);
    this.telaAtual = await this.mudarParaIframe('iframe[src="/mk/mkcore/DRE/?sys=MK0"]', mainform3);
    return this.telaAtual;
  }

  @step('Gerar mensal DRE')
  async gerarMensalDRE(){
    if (!this.telaAtual) await this.navegarParaDRETela();
    await this.telaAtual?.getByRole('banner').getByText('DRE Gerencial').waitFor({ state: 'visible' });
    await this.telaAtual?.locator('div').filter({ hasText: /^Tipos de relatórioClique para selecionar$/ }).getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Mensal').click();
    await this.telaAtual?.locator('div').filter({ hasText: /^Ano do exercícioClique para selecionar$/ }).getByRole('combobox').click();
    await this.telaAtual?.getByLabel('2024').click();
    await this.telaAtual?.getByRole('button', { name: 'Clique para selecionar' }).click();
    await this.telaAtual?.getByLabel('Todos').click();
    await this.telaAtual?.getByRole('button', { name: 'Gerar relatório' }).click();
    expect(this.telaAtual?.locator('[id="\\34 "]').getByRole('alert')).toBeTruthy();  
  }

  @step('Gerar anual DRE')
  async gerarAnualDRE(){
    if (!this.telaAtual) await this.navegarParaDRETela();
    await this.telaAtual?.getByRole('banner').getByText('DRE Gerencial').waitFor({ state: 'visible' });
    await this.telaAtual?.locator('div').filter({ hasText: /^Tipos de relatórioClique para selecionar$/ }).getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Anual').click();
    await this.telaAtual?.getByRole('button', { name: 'Gerar relatório' }).click();
    expect(this.telaAtual?.locator('[id="\\34 "]').getByRole('alert')).toBeTruthy();  
  }

  @step('Baixar DRE')
  async baixarDRE(){
    if (!this.telaAtual) await this.navegarParaDRETela();
    await this.telaAtual?.getByRole('button', { name: 'Baixar' }).click();
    await this.telaAtual?.getByRole('button', { name: 'PDF Baixar PDF' }).click();
  }
  
  @step('Imprimir DRE')
  async imprimirDRE(){
    if (!this.telaAtual) await this.navegarParaDRETela();
    await this.telaAtual?.locator('xpath=//body/div/div/div/div/button[1]').first().click();
  }

}