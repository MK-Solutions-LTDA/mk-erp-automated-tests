// ainda bem que papai do ceu criou as classes, ele veio demais com isso
import { FrameLocator, Locator, Page } from "@playwright/test";
import step from "../../../../utilitarios/decorators";
import { faker } from "@faker-js/faker/locale/pt_BR";

export default class FinanceiroBotPage {

    // locators da pagina    
    private readonly gridPrincipal: FrameLocator;
    private readonly gridPrincipalBotaoNovoContrato: Locator;
    private readonly gridPrincipalBotaoSuspenderContrato: Locator;
    private readonly gridPrincipalBotaoCancelarSuspensaoContrato: Locator;

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

    constructor(
        private page: Page,
    ) {

        this.page = page;

        // locators da pagina (mainform ou iframe principal da pagina)
        this.gridPrincipal = this.page.locator('iframe[name="mainform]').contentFrame();
        this.gridPrincipalBotaoNovoContrato = this.gridPrincipal.getByRole('button', {name: 'Novo contrato'});
        this.gridPrincipalBotaoSuspenderContrato = this.gridPrincipal.getByRole('button', {name: 'Suspender contrato'}).first();    

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
        // botao do modal de concluir processo e suas 20 e poucas variacoes
        this.gridModalBotaoConcluir = this.gridModal.getByRole('button', {name: 'Concluir'}).first();
        this.gridModalBotaoCliqueParaFinalizar = this.gridModal.getByRole('button', {name: 'Clique para finalizar'}).last();
        this.gridPrincipalBotaoCancelarSuspensaoContrato = this.gridModal.getByRole('button', {name: 'Cancelar suspensão'}).first();
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
        await this.gridModalBotaoProximo.click();
        await this.page.waitForTimeout(1000)
        await this.gridModalBotaoProximo.click();
        await this.page.waitForTimeout(1000)
        await this.gridModalBotaoProximo.click();
        await this.page.waitForTimeout(1000)
        await this.gridModalBotaoUltimaCheckbox.click();
        await this.gridModalBotaoConcluir.click();
        await this.gridModalBotaoFecharModal.click();
        await this.page.reload();
        await this.page.waitForLoadState('load');
    }

    @step('Suspender contrato')
    async suspenderContrato() {
        await this.gridPrincipalBotaoSuspenderContrato.click();
        await this.gridModal.locator('div[title="Informe por qual motivo o cliente deseja solicitar esta suspensão."]').click();
        await this.gridModal.getByRole('option', {name: 'Dificuldades financeiras'}).first().click();
        await this.gridModal.getByRole('button', {name: 'Próxima etapa'}).first().click();
        await this.gridModal.getByRole('textbox', {name: 'Data de agendamento do bloqueio de conexão.'}).first().click();
        await this.gridModal.getByRole('textbox', {name: 'Data de agendamento do bloqueio de conexão.'}).first().pressSequentially(faker.date.future().toLocaleDateString());
        await this.gridModal.getByRole('button', {name: 'Próxima etapa'}).first().click();
        await this.gridModal.getByRole('checkbox').first().click();
        await this.gridModal.getByRole('button', {name: 'Próxima etapa'}).first().click();
        await this.gridModalBotaoFecharModal.click();
        await this.page.reload();
        await this.page.waitForLoadState('load');
    }
    
    @step('Cancelar suspensão do contrato')
    async cancelarSuspensaoContrato() { 
        await this.gridPrincipalBotaoCancelarSuspensaoContrato.click();
        await this.gridModalBotaoFecharModal.click();
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        });
        await this.page.reload();
        await this.page.waitForLoadState('load');   
    }

    @step('Cancelar contrato')
    async cancelarContrato() { 
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Cancelar contrato'}).first().click();
        await this.page.waitForTimeout(1500);
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('xpath=//div[@title="Selecione um motivo de cancelamento."]//div//button[@type="button"]').click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'Concorrência'}).first().click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próxima etapa'}).first().click();
        await this.page.waitForTimeout(1500);
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próxima etapa'}).first().click();
        await this.page.waitForTimeout(1500);
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próxima etapa'}).first().click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').nth(3).check();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Clique para finalizar'}).first().click();
        await this.page.reload();
        await this.page.waitForLoadState('load');
    }

    @step('Enviar fatura no chat')
    async enviarFaturaNoChat() {
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Faturas a receber deste contato'}).click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('.webix_cell > .webixtype_base').first().click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Enviar fatura ao chat'}).click();
        this.page.on('dialog', async (dialog) => {
            await dialog.accept();
        })
    }

    @step('Dar baixa na fatura')
    async darBaixaFatura() {    
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Faturas a receber deste contato'}).click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('.webix_cell > .webixtype_base').first().click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Baixar fatura selecionada'}).click();
        this.page.on('dialog', async (dialog) => {
            await dialog.accept();
        });
        await this.page.reload();
        await this.page.waitForLoadState('load');
    };

    @step('Remover fatura')
    async removerFatura() {
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Faturas a receber deste contato'}).click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('xpath=//tbody/tr[@role="row"]/td[5]/div[1]/input[1]').first().click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('xpath=//tbody/tr[@role="row"]/td[5]/div[1]/input[1]').first().pressSequentially('Fração');
        await this.page.waitForTimeout(1500);
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('.webix_cell > .webixtype_base').first().click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Remover fatura'}).click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('xpath=//input[@title="Informações adicionais que explicam o motivo dessa liquidação."]').click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('xpath=//input[@title="Informações adicionais que explicam o motivo dessa liquidação."]').pressSequentially(faker.lorem.sentences());
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().check();
        this.page.on('dialog', async (dialog) => {
            await dialog.accept();
        })
        await this.page.reload();
        await this.page.waitForLoadState('load');
    }

    @step('Inserir comentário na fatura')
    async inserirComentarioNaFatura() {
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Faturas a receber deste contato'}).click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('.webix_cell > .webixtype_base').first().click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Inserir comentários na fatura.'}).click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('xpath=//textarea[@id="WFRInput847333"]').click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('xpath=//textarea[@id="WFRInput847333"]').pressSequentially(faker.lorem.sentences());
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').check();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Gravar comentário'}).click();
    }         

    @step('Suspender conta')
    async suspenderConta() {
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Faturas a receber deste contato'}).click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('xpath=//tbody/tr[@role="row"]/td[5]/div[1]/input[1]').first().click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('xpath=//tbody/tr[@role="row"]/td[5]/div[1]/input[1]').first().pressSequentially('Fração');
        await this.page.waitForTimeout(1500);
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('.webix_cell > .webixtype_base').nth(1).click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Suspender fatura'}).first().click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('xpath=//div[@title="Selecione o motivo de suspensão para a geração de índices e categorização."]//div//button[@type="button"]').click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'Dificuldades Financeiras'}).click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().check();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Clique para executar o procedimento.'}).first().click();
        this.page.on('dialog', async (dialog) => {
            await dialog.accept();
        });
        await this.page.reload();
        await this.page.waitForLoadState('load');
    };
    @step('Imprimir fatura')
    async imprimirFatura(){
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Faturas a receber deste contato'}).click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('.webix_cell > .webixtype_base').first().click();
        await this.page.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Imprimir fatura'}).click();
    }

    @step('Clicar na primeira fatura na grade')
    async clicarPrimeiraFaturaNaGrade(nomeNaCelula: string) {
        await this.gridPrincipal.getByRole('gridcell', {name: nomeNaCelula}).first().click();
    }

    @step('Ativar contrato gerando as suas parcelas')
    async ativarContrato() {
        await this.page.waitForTimeout(1500);
        await this.gridModalBotaoPrimeiraCheckbox.click();
        await this.gridModalBotaoCliqueParaFinalizar.click(); 
    }
}