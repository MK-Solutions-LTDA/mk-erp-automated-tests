// ainda bem que papai do ceu criou as classes, ele veio demais com isso
import { FrameLocator, Locator, Page } from "@playwright/test";
import step from "../../../../utilitarios/decorators";

export default class FinanceiroBotPage {

    // locators da pagina    
    private readonly gridPrincipal: FrameLocator;
    private readonly gridPrincipalBotaoNovoContrato: Locator;

    // locators do financeiro
    private readonly gridFinanceiro: FrameLocator;

    // locators do modal
    private readonly gridModal: FrameLocator;
    private readonly gridModalBotaoSelecaoFatura: Locator;
    private readonly gridModalBotaoSelecaoFaturaSelecionar: Locator;
    private readonly gridModalBotaoProximo: Locator;
    private readonly gridModalBotaoConcluir: Locator;
    private readonly gridModalBotaoPrimeiraCheckbox: Locator;
    private readonly gridModalBotaoUltimaCheckbox: Locator;
    private readonly gridModalBotaoFecharModal: Locator;

    constructor(
        private page: Page,
    ) {
        this.page = page;

        // locators da pagina (mainform ou iframe principal da pagina)
        this.gridPrincipal = this.page.locator('iframe[name="mainform]').contentFrame();
        this.gridPrincipalBotaoNovoContrato = this.gridPrincipal.getByRole('button', {name: 'Novo contrato'});

        // locators do financeiro
        this.gridFinanceiro = this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe[name="iframe"]').nth(1).contentFrame();       

        // locators do modal
        this.gridModal = this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame();
        this.gridModalBotaoSelecaoFaturaSelecionar = this.gridModal.getByRole('option', {name: 'FRAÇÃO'}).first();
        this.gridModalBotaoProximo = this.gridModal.getByRole('button', {name: 'Próximo'}).first();
        this.gridModalBotaoConcluir = this.gridModal.getByRole('button', {name: 'Concluir'}).first();
        this.gridModalBotaoPrimeiraCheckbox = this.gridModal.getByRole('checkbox').first();
        this.gridModalBotaoUltimaCheckbox = this.gridModal.getByRole('checkbox').last();
        this.gridModalBotaoSelecaoFatura = this.gridModal.locator('div:nth-child(29) > div:nth-child(2) > div > button');
        this.gridModalBotaoFecharModal = this.gridPrincipal.locator('div[class="mk-form-fechar"]').first();
    }
    
    @step('Criar contrato')
    async criarContrato() {
        await this.gridPrincipalBotaoNovoContrato.click();
        await this.gridModalBotaoSelecaoFatura.click();
        await this.gridModalBotaoSelecaoFaturaSelecionar.click();
        await this.gridModalBotaoProximo.click();
        await this.page.waitForTimeout(1000)
        await this.gridModalBotaoProximo.click();
        await this.page.waitForTimeout(1000)
        await this.gridModalBotaoProximo.first().click();
        await this.page.waitForTimeout(1000)
        await this.gridModalBotaoProximo.first().click();
        await this.page.waitForTimeout(1000)
        await this.gridModalBotaoProximo.first().click();
        await this.page.waitForTimeout(1000)
        await this.gridModalBotaoUltimaCheckbox.click();
        await this.gridModalBotaoConcluir.click();
        await this.gridModalBotaoFecharModal.click();
    }

    @step('Clicar na primeira fatura na grade')
    async clicarPrimeiraFaturaNaGrade(nomeNaCelula: string) {
        await this.gridPrincipal.getByRole('gridcell', {name: nomeNaCelula}).first().click();
    }

    @step('Ativar contrato gerando as suas parcelas')
    async ativarContrato() {
        await this.gridPrincipal.getByRole('button', {name: 'Ativar contrato gerando suas parcelas'}).click();
    }

    @step('Aguardando')
    async aguardar(milissegundos: number) {
        await this.page.waitForTimeout(milissegundos);
    } 
}