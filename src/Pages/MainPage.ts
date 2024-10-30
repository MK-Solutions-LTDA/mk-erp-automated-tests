import { type Page } from '@playwright/test';
import { TipoDePagina } from '../Utils/TipoDePagina';
import BasePage from './BasePage';
import { FinanceiroPage } from './FinanceiroPage';
import { ConfigPage } from './ConfigPage';
import step from '../utils/decorators';


export class MainPage extends BasePage {

	constructor(page: Page) {
		super(page);
	}
	
	@step('Indo para página')
	async irParaPagina(tipoDePagina: TipoDePagina): Promise<any> {
		await this.definirFramesPrincipais();
		await this.frameSysElem?.click(tipoDePagina.valueOf());
		switch (tipoDePagina) {
			case TipoDePagina.FINANCEIRO:
				return new FinanceiroPage(this.page);
			case TipoDePagina.CONFIGURACOES:
				return new ConfigPage(this.page);
		}
	}
}
