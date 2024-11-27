// é como o sábio Singed disse: "girar, girar, misturar, mexer"
import { FrameLocator, Locator, Page } from "@playwright/test";
import step from "../../../../utilitarios/decorators";
import { faker } from "@faker-js/faker/locale/pt_BR";
import { expect } from "../../../../utilitarios/fixtures/base";

export default class ConexaoClientePage {

    // locators da pagina    
    private readonly gridPrincipal: FrameLocator;
    private readonly gridPrincipalBotaoNovoContrato: Locator;
    private readonly gridPrincipalBotaoSuspenderContrato: Locator;
    private readonly gridPrincipalBotaoCancelarSuspensaoContrato: Locator;
    private readonly gridPrincipalBotaoAlterarFatura: Locator;

    // locators do financeiro
    private readonly gridFinanceiro: FrameLocator;

    // locators do modal
    private readonly gridModal: FrameLocator;
    private readonly gridModalBotaoSelecaoFatura: Locator;
    private readonly gridModalBotaoSelecaoFaturaSelecionar: Locator;
    private readonly gridModalBotaoProximo: Locator;
    private readonly gridModalBotaoPrimeiraCheckbox: Locator;
    private readonly gridModalBotaoUltimaCheckbox: Locator;
    private readonly gridModalBotaoFecharModal: Locator;
    private readonly gridModalBotaoConcluir: Locator;
    private readonly gridModalBotaoCliqueParaFinalizar: Locator;
    private readonly gridModalBotaoSelecionarMotivoSuspensao: Locator;

    constructor(
        private page: Page,
    ) {

        this.page = page;

        // locators da pagina (mainform ou iframe principal da pagina)
        this.gridPrincipal = this.page.locator('iframe[name="mainform]').contentFrame();
        this.gridPrincipalBotaoNovoContrato = this.gridPrincipal.getByRole('button', {name: 'Novo contrato'});
        this.gridPrincipalBotaoSuspenderContrato = this.gridPrincipal.getByRole('button', {name: 'Suspender contrato'}).first();    
        this.gridPrincipalBotaoAlterarFatura = this.gridPrincipal.getByRole('button', {name: 'Alterar fatura'}).first();

        // locators do financeiro
        this.gridFinanceiro = this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe[name="iframe"]').nth(1).contentFrame();       

        // locators do modal
        this.gridModal = this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame();
        this.gridModalBotaoSelecaoFaturaSelecionar = this.gridModal.getByRole('option', {name: 'FRAÇÃO'}).first();
        this.gridModalBotaoProximo = this.gridModal.getByRole('button', {name: 'Próximo'}).first();
        this.gridModalBotaoPrimeiraCheckbox = this.gridModal.getByRole('checkbox').first();
        this.gridModalBotaoUltimaCheckbox = this.gridModal.getByRole('checkbox').last();
        this.gridModalBotaoSelecaoFatura = this.gridModal.locator('div:nth-child(29) > div:nth-child(2) > div > button');
        this.gridModalBotaoFecharModal = this.gridPrincipal.locator('div[class="mk-form-fechar"]').first();
        this.gridModalBotaoSelecionarMotivoSuspensao = this.gridPrincipal.locator('div[title="Informe por qual motivo o cliente deseja solicitar esta suspesão.]').first();
        // botao do modal de concluir processo e suas 20 e poucas variacoes
        this.gridModalBotaoConcluir = this.gridModal.getByRole('button', {name: 'Concluir'}).first();
        this.gridModalBotaoCliqueParaFinalizar = this.gridModal.getByRole('button', {name: 'Clique para finalizar'}).last();
        this.gridPrincipalBotaoCancelarSuspensaoContrato = this.gridModal.getByRole('button', {name: 'Cancelar suspensão'}).first();
    }
     
    @step('Validar veracidade das conexões do cliente')
    async assertConexoesCliente(){
        await expect(this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('div:nth-child(13) > .webix_cell')).toBeVisible();
    }

    @step('Realizar alterações gerais na conexão do cliente')
    async alterarConexaoCliente(){
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('div:nth-child(13) > .webix_cell').click(); 
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: "Alterações gerais"}).click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').press('Control+A');
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').press('Backspace');
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').pressSequentially(faker.lorem.sentences());
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('.next > button').first().click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div:nth-child(41) > button').click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('.finish > button').first().click();
        this.page.on('response', async (response) => {
            if (response.url().includes(`form.do`)) {
                expect(response.ok()).toBeTruthy();
            }
        })
    }

    @step('Bloquear conexão do cliente')
    async bloquearConexaoCliente(){
        await this.page.waitForTimeout(2000);

        const semRegistro = expect(this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().getByText('(NENHUM REGISTRO)', {exact: true})).toBeHidden();

        if (semRegistro != null) {
            await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Conexões de cobrança bloqueadas deste cliente'}).click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('div[class="webix_ss_center"] div:nth-child(3) div:nth-child(1)').click(); 
            await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: "Desbloqueio de conexões"}).click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').pressSequentially(faker.lorem.sentences());
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('.finish > button').first().click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: "Conexões de cobrança ativas deste cliente"}).click();  
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('div:nth-child(13) > .webix_cell').first().click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: "Bloquear a conexão"}).click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div[title="Associe o motivo de bloqueio desejado."] > div > button[type="button"]').first().click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'Cancelado/Inativo'}).first().click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').pressSequentially(faker.lorem.sentences());
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('.finish > button').first().click();
        } 
        
        else {
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('div:nth-child(13) > .webix_cell').click(); 
            await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: "Bloquear a conexão"}).click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div[title="Associe o motivo de bloqueio desejado."] > div > button[type="button"]').first().click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'Cancelado/Inativo'}).click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').pressSequentially(faker.lorem.sentences());
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().click();
            await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('.finish > button').first().click();
        }
    }

    @step('Clicar na primeira fatura na grade')
    async clicarPrimeiraFaturaNaGrade(nomeNaCelula: string) {
        await this.gridPrincipal.getByRole('gridcell', {name: nomeNaCelula}).first().click();
    }

}