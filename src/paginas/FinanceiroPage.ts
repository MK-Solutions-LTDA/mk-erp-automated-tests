import BasePage from "./BasePage";
import { type Page } from "@playwright/test";
import step from "../utilitarios/decorators";
import { ItensMenu } from "../utilitarios/itens_submenu/financeiro/financeiro_submenus";
import { DreGerencial } from "./subpaginas/financeiro/DreGerencial";
import { GerenciadorContasPagar } from "./subpaginas/financeiro/GerenciadorContasPagar";
import { GerenciadorContasReceber } from "./subpaginas/financeiro/GerenciadorContasReceber";

export class FinanceiroPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  @step('Ir para página')
  async irParaPagina(tipoDePagina: ItensMenu): Promise<any> {
    await this.definirFramesPrincipaisFinanceiro();
    await this.clicarNoSubmenu(tipoDePagina);
    return this.navegarParaPagina(tipoDePagina);
  }
  

  @step('Definir frames principais do menu financeiro')
  async definirFramesPrincipaisFinanceiro() {
	await this.page.waitForLoadState('domcontentloaded');
	const mainsystem = await this.mudarParaIframe('frame[name="mainsystem"]', this.page);
	const mainform = await this.mudarParaIframe('iframe[name="mainform"]', mainsystem);
	const financeiroAba = await this.mudarParaIframe('iframe[componenteaba="Financeiro - PainelCloseAbaPrincipal"]',mainform);
	this.telaAtual = await this.mudarParaIframe('iframe[name="mainform"]',financeiroAba);
	return this.telaAtual;
  }

  @step('Clicar no submenu')
  private async clicarNoSubmenu(tipoDePagina: ItensMenu) {
    await this.telaAtual?.click(tipoDePagina.valueOf());
  }

  @step('Navegar para página')
  private async navegarParaPagina(tipoDePagina: ItensMenu): Promise<any> {
    switch (tipoDePagina) {
      case ItensMenu.GERENCIADOR_DE_CONTAS_A_PAGAR:
        return new GerenciadorContasPagar(this.page);
      case ItensMenu.GERENCIADOR_DE_CONTAS_A_RECEBER:
        return new GerenciadorContasReceber(this.page);
      case ItensMenu.DRE_GERENCIAL:
        return new DreGerencial(this.page);
      default:
        throw new Error(`Tipo de página não suportado: ${tipoDePagina}`);
    }
  }
}