import BasePage from "./BasePage";
import { type Page, type Frame } from "@playwright/test";

export class ConfigPage extends BasePage {
	
  frameGrid: Frame | null;

  constructor(page: Page) {
    super(page);
  }

  
	async entrarNoSubmenuFeriado(url: string) {
		const mainsystem = await this.mudarParaIframe('frame[name="mainsystem"]', this.page);
		const mainform = await this.mudarParaIframe('iframe[name="mainform"]', mainsystem);
		const configAba = await this.mudarParaIframe('iframe[componenteaba="Configurações - PainelCloseAbaPrincipal"]', mainform);
		const mainform2 = await this.mudarParaIframe('iframe[name="mainform"]', configAba);
		await mainform2?.locator('li[id="1459027"]').click();
		await mainform2?.click('a[title="Feriados"]');
		await mainform2?.waitForSelector('iframe[componenteaba="Cadastro de FeriadosClosePainelAba"]');
		await this.page.waitForRequest(`${url}/mk/form-unique.jsp?formID=ALL`);
	}

	async navegarParaAbaFeriados() {
		const mainsystem = await this.mudarParaIframe('frame[name="mainsystem"]', this.page);
		const mainform = await this.mudarParaIframe('iframe[name="mainform"]', mainsystem);
		const configAba = await this.mudarParaIframe('iframe[componenteaba="Configurações - PainelCloseAbaPrincipal"]', mainform);
		const mainform2 = await this.mudarParaIframe('iframe[name="mainform"]', configAba);
		const abaFeriados = await this.mudarParaIframe('iframe[componenteaba="Cadastro de FeriadosClosePainelAba"]', mainform2);
		return await this.mudarParaIframe('iframe[name="mainform"]', abaFeriados);
  	}
	  

	async readFeriado(nomeFeriado: string): Promise<boolean> {
		const mainform3 = await this.navegarParaAbaFeriados();
		const htmlPage = await this.mudarParaIframe('iframe[class="HTMLPage"]', mainform3);
		await mainform3?.locator('xpath=//*[@id="lay"]/div[3]/div[1]/table/tbody/tr/td[3]/div').click();
		await htmlPage?.locator('xpath=//input[@name="q$2"]').click();
		await htmlPage?.locator('xpath=//input[@name="q$2"]').pressSequentially(nomeFeriado);
		await htmlPage?.locator('xpath=//input[@name="q$2"]').press('Enter');
		const queryResult = await this.mudarParaIframe('iframe[name="WFRQueryResults"]', htmlPage);
		const feriado = await queryResult?.getByText(nomeFeriado)?.first().textContent();
		return feriado === nomeFeriado;
	}


	async createFeriado(nomeFeriado: string, diaFeriado: string, mesFeriado: string): Promise<boolean> {

		const mainform3 = await this.navegarParaAbaFeriados();
		await mainform3?.locator('xpath=//*[@id="lay"]/div[3]/div[1]/table/tbody/tr/td[1]/div').click();
		await mainform3?.press('div[class="formViewDiv"]', 'Control+Insert');
		await mainform3?.waitForSelector('input[name="WFRInput138506"]');
		await mainform3?.locator('input[name="WFRInput138506"]').pressSequentially(nomeFeriado);
		await mainform3?.locator('input[name="WFRInput138504"]').pressSequentially(diaFeriado);
		await mainform3?.locator('xpath=//*[@id="lay"]/div[3]/div[2]/div[6]/div[2]/div/button').click();
		await mainform3?.waitForSelector('input[id="lookupSearchQuery"]');
		await mainform3?.locator('input[id="lookupSearchQuery"]').pressSequentially(mesFeriado);
		await mainform3?.press('input[id="lookupSearchQuery"]', 'Enter');
		await mainform3?.waitForSelector('xpath=//*[@id="lookupInput"]/option[2]');
		await mainform3?.locator('xpath=//*[@id="lookupInput"]/option[2]').click();
		await mainform3?.press('div[class="formViewDiv"]', 'Control+G');
		return true;

	}


	async updateFeriado(nomeFeriadoAntigo: string, nomeFeriadoNovo: string, diaFeriado: string, mesFeriado: string): Promise<boolean> {

		if (await this.readFeriado(nomeFeriadoAntigo)) {
			const mainform3 = await this.navegarParaAbaFeriados();
			const htmlPage = await this.mudarParaIframe('iframe[class="HTMLPage"]', mainform3);
			const queryResult = await this.mudarParaIframe('iframe[name="WFRQueryResults"]', htmlPage);
			await queryResult?.getByText(nomeFeriadoAntigo)?.first().dblclick();
			await mainform3?.press('div[class="formViewDiv"]', 'Control+E');
			await mainform3?.locator('input[name="WFRInput138506"]').pressSequentially(nomeFeriadoNovo);
			await mainform3?.locator('input[name="WFRInput138504"]').pressSequentially(diaFeriado);
			await mainform3?.locator('xpath=//*[@id="lay"]/div[3]/div[2]/div[6]/div[2]/div/button').click();
			await mainform3?.waitForSelector('input[id="lookupSearchQuery"]');
			await mainform3?.locator('input[id="lookupSearchQuery"]').pressSequentially(mesFeriado);
			await mainform3?.press('input[id="lookupSearchQuery"]', 'Enter');
			await mainform3?.waitForSelector('xpath=//*[@id="lookupInput"]/option[2]');
			await mainform3?.locator('xpath=//*[@id="lookupInput"]/option[2]').click();
			await mainform3?.press('div[class="formViewDiv"]', 'Control+S');
			return true;
		} else {
			console.error("Feriado não encontrado para atualização.");
			return false;
		}
	}


	async deleteFeriado(nomeFeriado: string): Promise<boolean> {
		const mainform3 = await this.navegarParaAbaFeriados();
		if (await this.readFeriado(nomeFeriado)) {
			const htmlPage = await this.mudarParaIframe('iframe[class="HTMLPage"]', mainform3);
			const queryResult = await this.mudarParaIframe('iframe[name="WFRQueryResults"]', htmlPage);
			await queryResult?.getByText(nomeFeriado)?.first().dblclick();
			await mainform3?.press('div[class="formViewDiv"]', 'Control+Delete');
			await mainform3?.waitForSelector('div[type="custom_msg"]');
			await mainform3?.locator('xpath=//div[@id="intBtnOk"]//button[@type="button"]').click();
			return true;
		} else {
			console.error("Feriado não encontrado para exclusão.");
			return false;
		}
	}
  
}