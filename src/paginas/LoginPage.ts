import { pass, user, url } from '../../Setup';
import { Page } from '@playwright/test';
import { MainPage } from './MainPage';
import step from '../utilitarios/decorators';

export class LoginPage {
	
	page: Page;

	constructor(page: any) {this.page = page}

	@step('Entrar na página de login')
	async entrarPaginaLogin() { await this.page.goto(`${url}/mk/login/?sys=MK0`) }

	@step('Realizando login no sistema')
	async realizar_login() {
		await this.page.waitForLoadState('domcontentloaded');
		await this.page.locator('input[name="user"]').pressSequentially(user);
		await this.page.locator('input[name="password"]').pressSequentially(pass);
		await this.page.locator('#dataConnectionOpt').click();
		await this.page.press('#dataConnectionOpt', 'ArrowDown');
		await this.page.press('#dataConnectionOpt', 'ArrowDown');
		await this.page.press('#dataConnectionOpt', 'Enter');
		await this.page.click('button[name="user"]');
		await this.page.waitForSelector('frame[name="mainsystem"]');
		await this.page.waitForLoadState('load');
		return new MainPage(this.page);
	}
}