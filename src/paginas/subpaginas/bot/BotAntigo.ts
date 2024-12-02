import { BrowserContext, FrameLocator, type Locator, Page } from "@playwright/test";
import step from "../../../utilitarios/decorators";
import { getRandomChampion } from "../../../utilitarios/api/championlist";
import { expect } from "../../../utilitarios/fixtures/base";
import { faker } from "@faker-js/faker/locale/pt_BR";

export default class BotAntigo {

    page: Page;

    private readonly gridPrincipal: FrameLocator;
    private readonly gridFuncoes: FrameLocator;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.gridPrincipal = this.page.locator('iframe[name="mainform"]').contentFrame();
        this.gridFuncoes = this.gridPrincipal.locator('iframe').nth(1).contentFrame();
    }

    @step('Enviar mensagens no chat')    
    async enviarMensagensNoChat(mensagem: string) {
        await this.gridFuncoes.getByPlaceholder('Mensagem').click();
        await this.gridFuncoes.getByPlaceholder('Mensagem').pressSequentially(mensagem);
        await this.gridFuncoes.getByRole('button', { name: '' }).click();
    }
}