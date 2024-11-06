import { type Page } from '@playwright/test';
import { TipoPagina } from '../utilitarios/TipoPagina';
import BasePage from './BasePage';
import { FinanceiroPage } from './FinanceiroPage';
import { ConfigPage } from './ConfigPage';
import BotPage from './BotPage';
import step from '../utilitarios/decorators';

export class MainPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  @step('Indo para página')
  async irParaPagina(tipoDePagina: TipoPagina): Promise<any> {
    await this.definirFramesPrincipais();
    await this.clicarNoSubmenu(tipoDePagina);
    return this.navegarParaPagina(tipoDePagina);
  }

  private async clicarNoSubmenu(tipoDePagina: TipoPagina) {
    await this.telaAtual?.click(tipoDePagina.valueOf());
  }

  private async navegarParaPagina(tipoDePagina: TipoPagina): Promise<any> {
    switch (tipoDePagina) {
      case TipoPagina.FINANCEIRO:
        return new FinanceiroPage(this.page);
      case TipoPagina.CONFIGURACOES:
        return new ConfigPage(this.page);
      case TipoPagina.BOT:
        return new BotPage(this.page);
      default:
        throw new Error(`Tipo de página não suportado: ${tipoDePagina}`);
    }
  }
}