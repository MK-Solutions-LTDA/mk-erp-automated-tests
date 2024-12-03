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

    @step('Excluir audio')
    async excluirAudio() {
        await this.gridFuncoes.getByRole('button', { name: 'Excluir' }).click();
    }
}