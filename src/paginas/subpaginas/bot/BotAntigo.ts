import { BrowserContext, FrameLocator, type Locator, Page } from "@playwright/test";
import step from "../../../utilitarios/decorators";
import { getRandomChampion } from "../../../utilitarios/api/championlist";
import { expect } from "../../../utilitarios/fixtures/base";
import { fakerPT_BR as faker } from "@faker-js/faker";
import path from "path";

export default class BotAntigo {

    page: Page;

    private readonly gridPrincipal: FrameLocator;
    private readonly gridFuncoes: FrameLocator;
    private readonly gridModal: FrameLocator;
    private readonly gridModal2: FrameLocator;
    private readonly folderImagens: any;

    constructor(page: Page, context: BrowserContext) {
        this.page = page;

        this.folderImagens = path.join(process.cwd(), "/src/imagens");

        this.gridPrincipal = this.page.locator('iframe[name="mainform"]').contentFrame();
        this.gridFuncoes = this.gridPrincipal.locator('iframe').nth(1).contentFrame();
        this.gridModal = this.gridPrincipal.locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame();
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
        await this.gridFuncoes.getByRole('button', { name: 'Menu' }).click();
        await this.gridFuncoes.getByRole('button', { name: 'Financeiro' }).click();
    }

    @step('Criar contrato aguardando a ativacao')
    async criarContratoAguardandoAtivacao() {
        await this.gridPrincipal.getByRole('button', { name: 'Menu de opções' }).click();
        await this.gridPrincipal.getByRole('button', { name: 'Criar Contrato' }).click();
        await this.gridModal.getByRole('button', { name: 'Salvar' }).click();
    }

    @step('Ativa contrato gerando as parcelas')
    async ativarContratoGerarParcelas() {

    }

    @step('Suspender contrato')
    async suspenderContrato() {
    }

    @step('Cancelar suspensao do contrato')
    async cancelarSuspensaoContrato() {
    }

    @step('Alterar contrato')
    async alterarContrato() {
    }

    @step('Cancelar contrato')
    async cancelarContrato() {
    }
    
    @step('Enviar fatura no chat')
    async enviarFaturaChat() {
        
    }

    @step('Baixar fatura selecionada')
    async baixarFatura() {
        
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