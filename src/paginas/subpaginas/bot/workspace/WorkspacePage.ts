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
    private readonly gridModal2: FrameLocator;

    constructor(
        private page: Page,
    ) {

        this.page = page;

        // locators da pagina (mainform ou iframe principal da pagina)
        this.gridPrincipal = this.page.locator('iframe[name="mainform"]').contentFrame();
        
        // locators do financeiro
        this.gridFinanceiro = this.gridPrincipal.locator('iframe').nth(1).contentFrame();       

        // locators do modal
        this.gridModal = this.gridPrincipal.locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame();
        this.gridModal2 = this.gridPrincipal.locator('iframe').nth(4).contentFrame().locator('iframe[name="mainform"]').contentFrame();
    }

    // esse cara nao ta funcionando ainda, ta meio pronto pra falar a verdade, depois eu termino de ajustar essa bomba de cenário
    @step('Criar um atendimento com os campos obrigatórios')
    async criarAtendimentoWorkspace() {
        await this.gridPrincipal.getByRole('button', {name: 'Novo atendimento'}).click();
        await this.gridModal.locator('xpath=//textarea[@id="WFRInput831727"]').click();
        await this.gridModal.locator('xpath=//textarea[@id="WFRInput831727"]').pressSequentially(faker.lorem.sentences());
        await this.gridModal.getByRole('button', {name: 'Avançar para ferramentas'}).click();
        await this.gridModal.getByRole('button', {name: 'Encaminhar para outro setor'}).click();
        await this.gridModal.getByRole('button', { name: 'Encerrar ticket'}).click();
        await this.gridModal2.getByRole('checkbox', { name: 'Clique para confirmar seu' }).click();
        await this.gridModal2.getByRole('button').first().click();
    }

    @step('Clicar na primeira fatura na grade')
    async clicarPrimeiraFaturaNaGrade(nomeNaCelula: string) {
        await this.gridFinanceiro.getByRole('gridcell', {name: nomeNaCelula}).first().click();
    }

    @step('Editar um atendimento')
    async editarAtendimento() {
        await this.clicarPrimeiraFaturaNaGrade('Sem resgate');
        await this.gridPrincipal.getByRole('button', {name: 'Editar um Atendimento'}).click();
        await this.gridModal.getByRole('button', {name: 'Voltar'}).click();
        await this.gridModal.getByRole('button', {name: 'Voltar'}).click();
        await this.gridModal.locator('xpath=//textarea[@id="WFRInput831727"]').click();
        await this.gridModal.locator('xpath=//textarea[@id="WFRInput831727"]').pressSequentially(faker.lorem.sentences());
    }
}