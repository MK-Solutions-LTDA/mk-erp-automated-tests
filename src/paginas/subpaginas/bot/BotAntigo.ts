import { BrowserContext, expect, FrameLocator, type Locator, Page } from "@playwright/test";
import step from "../../../utilitarios/decorators";
import { fakerPT_BR as faker } from "@faker-js/faker";
import path from "path";

export default class BotAntigo {

    page: Page;

    private readonly gridPrincipal: FrameLocator;
    private readonly gridFuncoes: FrameLocator;
    private readonly gridModal: FrameLocator;
    private readonly gridModal2: FrameLocator;
    private readonly gridModal3: FrameLocator;
    private readonly folderImagens: any;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;

        this.folderImagens = path.join(process.cwd(), "/src/imagens");

        this.gridPrincipal = this.page.locator('iframe[name="mainform"]').contentFrame();
        this.gridFuncoes = this.gridPrincipal.locator('iframe').nth(1).contentFrame();
        this.gridModal = this.gridPrincipal.locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame();
        this.gridModal3 = this.gridPrincipal.locator('iframe').nth(3).contentFrame().locator('iframe[name="mainform"]').contentFrame();
        this.gridModal2 = this.gridPrincipal.locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame();
    }

    @step('Enviar mensagens no chat')    
    async enviarMensagensNoChat(mensagem: string) {
        await this.gridFuncoes.getByPlaceholder('Mensagem').click();
        await this.gridFuncoes.getByPlaceholder('Mensagem').pressSequentially(mensagem);
        await this.gridFuncoes.getByRole('button', { name: '' }).click();
    }

    @step('Enviar imagem no chat')
    async enviarImagemChat() {
        await this.gridFuncoes.getByRole('button', { name: 'Escolha um arquivo para enviar' }).click();
        await this.gridPrincipal.locator('input[id="upload"]').setInputFiles((path.join(this.folderImagens, 'lilah.jpeg')));
        await this.gridPrincipal.locator('input[value="Enviar"]').click();
    };

    @step('Acessar conversa')
    async acessarConversa() {
        await this.gridFuncoes.locator('converse-rooms-list div').nth(4).click();
    }

    @step('Acessar conversa')
    async acessarConversaSetor() {
        await this.gridFuncoes.locator('converse-rooms-list div').nth(3).click();
    }

    @step('Iniciar conversa')
    async iniciarConversa(nomeContato: string) {
        await this.gridPrincipal.getByRole('button', {name: 'Menu de opções'}).click();
        await this.gridPrincipal.getByRole('button', {name: 'Convidar um contato para o chat'}).click();
        await this.gridModal.locator('xpath=//div[@title="Selecione o cliente desejado"]//div//button[@type="button"]').click();
        await this.gridModal.locator('xpath=//input[@id="lookupSearchQuery"]').pressSequentially(nomeContato);
        await this.gridModal.locator('xpath=/html[1]/body[1]/div[3]/div[2]/select[1]/option[2]').click();
        await this.gridModal2.locator('xpath=//div[@role="rowgroup"]//div[1]//div[1]').click();
        await this.gridModal.getByRole('checkbox').first().click();
        await this.gridModal.getByRole('button', { name: 'Clique para enviar o convite' }).click();
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        })
    }

    @step('Enviar PDF no chat')
    async enviarPdfChat() {
        await this.gridFuncoes.getByRole('button', { name: 'Escolha um arquivo para enviar' }).click();
        await this.gridPrincipal.locator('input[id="upload"]').setInputFiles((path.join(this.folderImagens, 'LOL-Rumo-ao-Challenger.pdf')));
        await this.gridPrincipal.locator('input[value="Enviar"]').click();
    }

    @step('Limpar conversa')
    async limparConversa() {
        await this.gridPrincipal.getByRole('button', { name: 'Menu de opções' }).click();
        await this.gridPrincipal.getByRole('button', { name: 'Encerrar Atendimento' }).click();
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        })
    }

    @step('Gravar áudio')
    async gravarAudio(segundos: number) {
        await this.gridFuncoes.getByRole('button', { name: 'Mensagem de voz' }).click();
        await this.page.waitForTimeout(segundos * 1000);
        await this.gridFuncoes.getByRole('button', { name: 'Enviar o áudio' }).click();
    }

    @step('Enviar video no chat')
    async enviarVideoChat() {
        await this.gridFuncoes.getByRole('button', { name: 'Escolha um arquivo para enviar' }).click();
        await this.gridPrincipal.locator('input[id="upload"]').setInputFiles((path.join(this.folderImagens, 'lilah_linda_da_vo.mp4')));
        await this.gridPrincipal.locator('input[value="Enviar"]').click();
    }
    
    @step('Baixar audio')
    async baixarAudio() {
        await this.gridFuncoes.getByRole('button', { name: 'Baixar' }).click();
    }

    @step('Escutar audio')
    async escutarAudio(tempo: number) {
        await this.gridFuncoes.getByRole('button', { name: 'Ouvir' }).click();
        await this.page.waitForTimeout(tempo * 1000);
    }

    @step('Enviar docx no chat')
    async enviarDocxChat() {
        await this.gridFuncoes.getByRole('button', { name: 'Escolha um arquivo para enviar' }).click();
        await this.gridPrincipal.locator('input[id="upload"]').setInputFiles((path.join(this.folderImagens, 'LOL-Rumo-ao-Challenger.docx')));
        await this.gridPrincipal.locator('input[value="Enviar"]').click();
    }

    @step('Cadastrar resposta padronizada')
    async cadastrarRespostaPadronizada() {
        await this.gridPrincipal.getByRole('button', { name: 'Menu de opções' }).click();
        await this.gridPrincipal.getByRole('button', { name: 'Cadastrar Resposta Padronizada' }).click();
        await this.gridModal.locator('textarea').pressSequentially(faker.hacker.phrase());
        await this.gridModal.getByRole('button', { name: 'Salvar' }).click();
    }

    @step('Cadastrar resposta padronizada com emoji')
    async cadastrarRespostaPadronizadaComEmoji() {
        await this.gridPrincipal.getByRole('button', { name: 'Menu de opções' }).click();
        await this.gridPrincipal.getByRole('button', { name: 'Cadastrar Resposta Padronizada' }).click();
        await this.gridModal.locator('textarea').pressSequentially('😍');
        await this.gridModal.getByRole('button', { name: 'Salvar' }).click();
    }

    @step('Excluir audio')
    async excluirAudio() {
        await this.gridFuncoes.getByRole('button', { name: 'Excluir' }).click();
    }

    @step('Editar resposta padronizada')
    async editarRespostaPadronizada() {
        await this.gridPrincipal.getByRole('button', { name: 'Menu de opções' }).click();
        await this.gridPrincipal.getByRole('button', { name: 'Editar Resposta Padronizada' }).click();
        await this.gridModal.locator('textarea').pressSequentially(faker.hacker.phrase());
        await this.gridModal.getByRole('button', { name: 'Salvar' }).click();
    }

    @step('Excluir resposta padronizada')
    async excluirRespostaPadronizada() {
        await this.gridPrincipal.getByRole('button', { name: 'Menu de opções' }).click();
        await this.gridPrincipal.getByRole('button', { name: 'Excluir Resposta Padronizada' }).click();
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        })
    }

    @step('Enviar template texto coringa emoji')
    async enviarTemplateTextoCoringaEmoji() {
        await this.gridFuncoes.getByRole('button', { name: 'Templates' }).click();
        await this.gridFuncoes.getByRole('button', { name: 'Texto com coringa e emoji' }).click();
    }

    @step('Enviar template imagem emoji')
    async enviarTemplateImagemEmoji() {
        await this.gridFuncoes.getByRole('button', { name: 'Templates' }).click();
        await this.gridFuncoes.getByRole('button', { name: 'Imagem com emoji' }).click();
    }

    @step('Enviar template anexo emoji')
    async enviarTemplateAnexoEmoji() {
        await this.gridFuncoes.getByRole('button', { name: 'Templates' }).click();
        await this.gridFuncoes.getByRole('button', { name: 'Anexo com emoji' }).click();
    }

    @step('Encerrar atendimento')
    async encerrarAtendimento() {
        await this.gridPrincipal.getByRole('button', { name: 'Menu de opções' }).click();
        await this.gridPrincipal.getByRole('button', { name: 'Encerrar Atendimento' }).click();
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        })
    }

    @step('Devolver atendimento')
    async devolverAtendimento() {
        await this.gridPrincipal.getByRole('button', { name: 'Menu de opções' }).click();
        await this.gridPrincipal.getByRole('button', { name: 'Devolver Atendimento' }).click();
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        })
    }

    @step('Sair da conversa')
    async sairConversa() {
        await this.gridPrincipal.getByRole('button', { name: 'Menu de opções' }).click();
        await this.gridPrincipal.getByRole('button', { name: 'Sair da conversa' }).click();
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        })
    }

   @step('Acessar financeiro') 
   async acessarFinanceiro() {
        await this.gridPrincipal.getByRole('button', { name: 'Financeiro do cliente' }).click();
    }

    @step('Criar contrato aguardando a ativacao')
    async criarContratoAguardandoAtivacao() {
        await this.gridPrincipal.getByRole('button', { name: 'Novo Contrato' }).click();
        await this.page.waitForTimeout(2000);
        await this.gridModal3.locator('//div[@title="Plano de acesso do novo contrato."]//div').click();
        await this.gridModal3.locator('xpath=//input[@id="lookupSearchQuery"]').click();
        await this.gridModal3.locator('xpath=//input[@id="lookupSearchQuery"]').pressSequentially('teste manu');
        await this.gridModal3.locator('xpath=//input[@id="lookupSearchQuery"]').press('Enter');
        await this.page.waitForTimeout(2000);
        await this.gridModal3.getByRole('option').nth(1).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal3.getByRole('button', { name: 'Próximo' }).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal3.getByRole('button', { name: 'Próximo' }).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal3.getByRole('button', { name: 'Próximo' }).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal3.getByRole('checkbox').nth(3).click();
        await this.gridModal3.getByRole('checkbox').nth(4).click();
        await this.gridModal3.getByRole('button', { name: 'Concluir' }).click();
        await this.page.waitForTimeout(1000);
        await this.page.locator('xpath=//div[@class="mk-form-fechar"]').click();
    }

    @step('Ativa contrato gerando as parcelas')
    async ativarContratoGerarParcelas() {
        await this.gridPrincipal.getByRole('button', { name: 'Novo Contrato' }).click();
        await this.page.waitForTimeout(2000);
        await this.gridModal3.locator('//div[@title="Plano de acesso do novo contrato."]//div').click();
        await this.gridModal3.locator('xpath=//input[@id="lookupSearchQuery"]').click();
        await this.gridModal3.locator('xpath=//input[@id="lookupSearchQuery"]').pressSequentially('teste manu');
        await this.gridModal3.locator('xpath=//input[@id="lookupSearchQuery"]').press('Enter');
        await this.page.waitForTimeout(2000);
        await this.gridModal3.getByRole('option').nth(1).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal3.getByRole('button', { name: 'Próximo' }).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal3.getByRole('button', { name: 'Próximo' }).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal3.getByRole('button', { name: 'Próximo' }).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal3.getByRole('checkbox').nth(4).click();
        await this.gridModal3.getByRole('button', { name: 'Concluir' }).click();
        await this.page.waitForTimeout(1000);
        await this.page.locator('xpath=//div[@class="mk-form-fechar"]').click();
    }

    @step('Suspender contrato')
    async suspenderContrato() {
        await this.gridPrincipal.getByRole('button', { name: 'Novo Contrato' }).click();
        await this.page.waitForTimeout(2000);
        await this.gridModal3.locator('//div[@title="Plano de acesso do novo contrato."]//div').click();
        await this.gridModal3.locator('xpath=//input[@id="lookupSearchQuery"]').click();
        await this.gridModal3.locator('xpath=//input[@id="lookupSearchQuery"]').pressSequentially('teste manu');
        await this.gridModal3.locator('xpath=//input[@id="lookupSearchQuery"]').press('Enter');
        await this.page.waitForTimeout(2000);
        await this.gridModal3.getByRole('option').nth(1).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal3.getByRole('button', { name: 'Próximo' }).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal3.getByRole('button', { name: 'Próximo' }).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal3.getByRole('button', { name: 'Próximo' }).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal3.getByRole('checkbox').nth(4).click();
        await this.gridModal3.getByRole('button', { name: 'Concluir' }).click();
        await this.page.waitForTimeout(1000);
        await this.page.locator('xpath=//div[@class="mk-form-fechar"]').click();
        await this.page.reload();
        await this.gridFuncoes.locator('xpath=//div[@class="webix_cell webix_row_select"]"').click();
        await this.gridPrincipal.getByRole('button', { name: 'Suspender contrato' }).click();
        await this.gridModal.locator('xpath=//div[@title="Informe por qual motivo o cliente deseja solicitar esta suspensão."]//div//button[@type="button"]').click();
        await this.gridModal.locator('xpath=//option[@value="6"]').click();
        await this.gridModal.getByRole('button', { name: 'Próxima etapa' }).click();
        await this.gridModal.locator('xpath=//input[@title="Data de agendamento do bloqueio de conexão."]').click();
        await this.gridModal.locator('xpath=//input[@title="Data de agendamento do bloqueio de conexão."]').pressSequentially('22122222');
        await this.gridModal.getByRole('button', { name: 'Próxima etapa' }).click();
        await this.gridModal.getByRole('checkbox').first().click();
        await this.gridModal.getByRole('button', { name: 'Próxima etapa' }).click();
    }

    @step('Can,celar suspensao do contrato')
    async cancelarSuspensaoContrato() {
        await this.suspenderContrato();
        await this.page.reload();
        await this.acessarFinanceiro();
        await this.gridFuncoes.locator('xpath=//tbody/tr[@role="row"]/td[7]/div[1]/select[1]').click();
        await this.gridFuncoes.locator('xpath=//tbody/tr[@role="row"]/td[7]/div[1]/select[1]').selectOption('Suspenso');
        await this.gridFuncoes.locator('xpath=//div[normalize-space()="Suspenso"]').first().click();
        await this.gridPrincipal.getByRole('button', { name: 'Cancelar suspensão' }).click();
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        });
    }

    @step('Alterar contrato')
    async alterarContrato() {
        await this.gridFuncoes.locator('xpath=//div[@class="webix_cell webix_row_select"][normalize-space()="Não informado"]').first().click();
        await this.gridPrincipal.getByRole('button', { name: 'Alterar contrato' }).click();
        await this.gridModal.getByRole('button', {name: 'Alterações gerais'}).click();
        await this.gridModal.locator('xpath=//span[normalize-space()="Observações"]').first().click();
        await this.gridModal.locator('textarea', {hasText:'WFRInput842082'}).pressSequentially(faker.lorem.sentence());
        await this.gridModal.getByRole('checkbox').first().click();
        await this.gridModal.getByRole('button', {name: 'Clique para finalizar'}).click();
    }

    @step('Cancelar contrato')
    async cancelarContrato() {
        await this.gridFuncoes.locator('xpath=//div[@class="webix_cell webix_row_select"][normalize-space()="Não informado"]').first().click();
        await this.gridPrincipal.getByRole('button', { name: 'Cancelar contrato' }).click();
        await this.gridModal.locator('xpath=//div[@title="Selecione um motivo de cancelamento."]//div//button[@type="button"]').first().click();
        await this.gridModal.locator('xpath=//option[@value="2"]').click();
        await this.gridModal.getByRole('button', {name: 'Próxima etapa'}).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal.getByRole('button', {name: 'Próxima etapa'}).click();
        await this.page.waitForTimeout(1000);
        await this.gridModal.getByRole('button', {name: 'Próxima etapa'}).click();
        await this.gridModal.getByRole('checkbox').nth(3).click();
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        });
    }
    
    @step('Enviar fatura no chat')
    async enviarFaturaChat() {
        await this.gridPrincipal.getByRole('button', { name: 'Faturas a receber deste contrato' }).click();
        await this.gridFuncoes.locator('xpath=//div[8]//div[1]').click();
        await this.gridPrincipal.getByRole('button', { name: 'Enviar fatura ao chat' }).click();
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        });
        expect(await this.gridFuncoes.locator('xpath=//div[contains(@class,"chat-msg__content chat-msg__content--me")]').textContent()).toContain('Anexo');
    }

    @step('Baixar fatura selecionada')
    async baixarFatura() {
        // fazer pelo banco ooo mai god 
    }

    @step('Inserir comentário na fatura')
    async inserirComentarioFatura() {
        
    }

    @step('Remover fatura')
    async removerFatura() {

    }

    @step('Suspender fatura')
    async suspenderFatura() {
    }

    @step('Imprimir fatura')
    async imprimirFatura() {

    }

    @step('Alterar fatura')
    async alterarFatura() {

    }

    @step('Faturar contas')
    async faturarContas() {

    }

    @step('Suspender conta')
    async suspenderConta() {

    }

    @step('Cancelar suspensao da conta')
    async cancelarSuspensaoConta() {

    }

    @step('Inserir conta')
    async inserirConta() {
    
    }

    @step('Editar conta')
    async editarContaReceber() {

    }

    @step('Remover conta')
    async removerConta(){

    }

    @step('Editar observacoes do documento fiscal')
    async editarObservacoesDocumentoFiscal() {
    
    }

    @step('Anular documento fiscal')
    async anularDocumentoFiscal() {
    
    }

    @step('Cancelar documento fiscal')
    async cancelarDocumentoFiscal() {
    
    }

    @step('Gerar documento fiscal')
    async gerarDocumentoFiscal() {
    
    }

    @step('Enviar negativas de debito')
    async enviarNegativasDeDebito() {

    }

    @step('Enviar negativas de debito por email')
    async enviarNegativasDeDebitoEmail() {

    }

    @step('Imprimir negativas de debito')
    async imprimirNegativasDeDebito() {

    }

    @step('Gerar nova negativa de débito')
    async gerarNovaNegativaDeDebito() {

    }
}