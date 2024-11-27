import { FrameLocator, Locator, Page } from "@playwright/test";
import step from "../../../../utilitarios/decorators";
import { faker } from "@faker-js/faker/locale/pt_BR";

export default class WorkspacePage {

    // locators da pagina    
    private readonly gridPrincipal: FrameLocator;

    // locators do financeiro
    private readonly gridFinanceiro: FrameLocator;

    // locators do modal
    private readonly gridModal: FrameLocator;

    constructor(
        private page: Page,
    ) {

        this.page = page;

        // locators da pagina (mainform ou iframe principal da pagina)
        this.gridPrincipal = this.page.locator('iframe[name="mainform"]').contentFrame();
        
        // locators do financeiro
        this.gridFinanceiro = this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame();       

        // locators do modal
        this.gridModal = this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame();
        
    }

    @step('Ver histórico de conversas')
    async verHistoricoConversas() {
        await this.gridPrincipal.locator('button').nth(1).click();
    }
}