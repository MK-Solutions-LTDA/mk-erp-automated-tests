import BasePage from "./BasePage";
import { type Page } from "@playwright/test";
import step from "../utilitarios/decorators";
import { ItensMenu } from "../utilitarios/itens_submenu/financeiro/financeiro_submenus";
import { DreGerencial } from "./subpaginas/financeiro/DreGerencial";
import { GerenciadorContasPagar } from "./subpaginas/financeiro/GerenciadorContasPagar";

export class FinanceiroPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  @step('Indo para página')
  async irParaPagina(tipoDePagina: ItensMenu): Promise<any> {
    await this.definirFramesPrincipais();
    await this.clicarNoSubmenu(tipoDePagina);
    return this.navegarParaPagina(tipoDePagina);
  }

  private async clicarNoSubmenu(tipoDePagina: ItensMenu) {
    await this.telaAtual?.click(tipoDePagina.valueOf());
  }

  private async navegarParaPagina(tipoDePagina: ItensMenu): Promise<any> {
    switch (tipoDePagina) {
      case ItensMenu.GERENCIADOR_DE_CONTAS_A_PAGAR:
        return new GerenciadorContasPagar(this.page);
      // case ItensMenu.GERENCIADOR_DE_CONTAS_A_RECEBER:
      //   return new GerenciadorContasReceber(this.page);
      case ItensMenu.DRE_GERENCIAL:
        return new DreGerencial(this.page);
      default:
        throw new Error(`Tipo de página não suportado: ${tipoDePagina}`);
    }
  }
}