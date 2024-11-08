import { type Locator, Page } from "@playwright/test";
import step from "../../../utilitarios/decorators";
import { expect } from "../../../utilitarios/fixtures/base";

export default class BotNovo {

    page: Page;

    statusOperador: Locator;
    indicadoresMenu: Locator;
    chatBotMenu: Locator;
    avaliacoesCriticasMenu: Locator;
    historicoMenu: Locator;
    envioMassaMenu: Locator;
    configuracoesMenu: Locator;
    setorDeAtendimento: Locator;
    canalDeAtendimento: Locator;
    cidadeDeAtendimento: Locator;
    buscarOperadores: Locator;

    exportarCSV: Locator;

    botaoNovaConversa: Locator;
    botaoConversaOpcoes: Locator;
    botaoConversaOpcoesEncerrarAtendimento: Locator;
    botaoAcoesDentroConversa: Locator;
    botaoAcoesDentroConversaEnviarSegundaVia: Locator;
    confirmarEncerramentoConversa: Locator;
    checkboxSelecionarPrimeiraFatura: Locator;
    encerrarConversaDefinitivamente: Locator;
    botaoEnviarSegundaViaFaturas: Locator;
    botaoAcoesDentroConversaRespostasPadrao: Locator;
    botaoAcoesDentroConversaRespostasPadraoCriar: Locator;
    botaosalvarRespostaPadrao: Locator;
    botaoFecharMenuRespostasPadrao: Locator;
    cadastroGrupoRespostaPadrao: Locator;
    cadastroMensagemRespostaPadrao: Locator;
    botaoConversaOpcoesRedefinirCliente: Locator;
    botaoConversaOpcoesRedefinirClienteBuscarCliente: Locator;
    botaoConversaOpcoesRedefinirClienteSalvar: Locator;
    botaoConversaOpcoesRedefinirClienteSalvarConfirma: Locator;

    constructor(page: Page) {

        this.page = page;

        this.statusOperador = this.page.locator('button').filter({ hasText: 'Disponível' });
        this.indicadoresMenu = this.page.getByRole('link', { name: 'Indicadores' });
        this.chatBotMenu = this.page.getByRole('link', { name: 'Chatbot' });
        this.avaliacoesCriticasMenu = this.page.getByRole('link', { name: 'Avaliações e críticas' });
        this.historicoMenu = this.page.getByRole('link', { name: 'Histórico' });
        this.envioMassaMenu = this.page.getByRole('link', { name: 'Envio em massa' });
        this.configuracoesMenu = this.page.getByRole('link', { name: 'Configurações' });

        this.setorDeAtendimento = this.page.getByRole('main').getByRole('combobox').first();
        this.canalDeAtendimento = this.page.getByRole('main').getByRole('combobox').nth(1);
        this.cidadeDeAtendimento = this.page.getByRole('main').getByRole('combobox').nth(2);
        this.buscarOperadores = this.page.getByRole('main').getByRole('combobox').nth(3);

        this.exportarCSV = this.page.getByRole('button', { name: 'Exportar CSV' });

        this.botaoConversaOpcoes = this.page.getByRole('button', { name: 'Opções' });
        this.botaoConversaOpcoesEncerrarAtendimento = this.page.getByText('Encerrar atendimento');
        this.confirmarEncerramentoConversa = this.page.getByLabel('Estou ciente que esta ação nã')
        this.encerrarConversaDefinitivamente = this.page.getByRole('button', { name: 'Encerrar' });
        this.botaoNovaConversa = this.page.locator('xpath=//div[@id="radix-:r11:-content-clients"]//button[1]').nth(0);
        this.botaoAcoesDentroConversa = this.page.getByRole('button', { name: 'Ações', exact: true });
        this.botaoAcoesDentroConversaEnviarSegundaVia = this.page.getByRole('button', { name: 'Enviar 2ª via de fatura' }).first();
        this.checkboxSelecionarPrimeiraFatura = this.page.locator('td').first()
        this.botaoEnviarSegundaViaFaturas = this.page.getByRole('button', { name: 'Enviar (1)' });
        this.botaoAcoesDentroConversaRespostasPadrao = this.page.getByRole('button', { name: 'Respostas Padrão' });
        this.botaoAcoesDentroConversaRespostasPadraoCriar = this.page.getByRole('button', { name: 'clique aqui' });
        this.botaosalvarRespostaPadrao = this.page.getByRole('button', { name: 'Salvar' });
        this.cadastroGrupoRespostaPadrao = this.page.getByPlaceholder('Clique para preencher');
        this.cadastroMensagemRespostaPadrao = this.page.getByLabel('Mensagem *');
        this.botaoFecharMenuRespostasPadrao = this.page.locator('[id="radix-\\:rov\\:"] > .w-12').nth(0);
        this.botaoConversaOpcoesRedefinirCliente = this.page.getByText('Redefinir cliente');
        this.botaoConversaOpcoesRedefinirClienteBuscarCliente = this.page.getByPlaceholder('Clique para buscar por código');
        this.botaoConversaOpcoesRedefinirClienteSalvar = this.page.getByRole('button', { name: 'Redefinir cliente' });
        this.botaoConversaOpcoesRedefinirClienteSalvarConfirma = this.page.getByRole('button', { name: 'Confirmar' });
    };

    @step('Limpar conversa')
    async limparConversa() {
        await this.botaoConversaOpcoes.click();
        await this.botaoConversaOpcoesEncerrarAtendimento.click();
        await this.confirmarEncerramentoConversa.click();
        await this.encerrarConversaDefinitivamente.click();
    }

    @step('Abrir nova conversa')
    async abrirNovaConversa() {
        await this.chatBotMenu.click();
        await this.botaoNovaConversa.click();
        await this.pesquisarPessoaConversa('teste caroline');
        await this.iniciarConversa();
    }

    @step('Pesquisar pessoa conversa')
    async pesquisarPessoaConversa(cliente: string) {
        await this.page.getByPlaceholder('Clique para buscar por código').click();
        await this.page.getByPlaceholder('Clique para buscar por código').fill(cliente);
        await this.page.getByText(cliente).first().click();
    }

    @step('Iniciar conversa')
    async iniciarConversa() {
        await this.page.locator('td').first().click();
        await this.page.getByRole('button', { name: 'Iniciar chat' }).click();
    }

    @step('Acessar conversa')
    async acessarConversa() {
        await this.page.getByRole('tab', { name: 'T Whatsapp Teste Caroline' }).first().click();
    }

    @step('Enviar anexo')
    async enviarAnexo() {
        await this.botaoAcoesDentroConversa.click();
        await this.botaoAcoesDentroConversaEnviarSegundaVia.click();
        await this.checkboxSelecionarPrimeiraFatura.click();
        await this.botaoEnviarSegundaViaFaturas.click();
        await expect(this.page.locator('div').filter({ hasText: /^Sucesso!Segunda via enviada com sucesso!$/ }).nth(2)).toBeVisible();
    }

    @step('Criar resposta padrão')
    async criarResposta() {
        await this.botaoAcoesDentroConversa.click();
        await this.botaoAcoesDentroConversaRespostasPadrao.click();
        await this.botaoAcoesDentroConversaRespostasPadraoCriar.click();
        await this.cadastroGrupoRespostaPadrao.click();
        await this.cadastroGrupoRespostaPadrao.pressSequentially('Teste automação');
        await this.cadastroMensagemRespostaPadrao.click();
        await this.cadastroMensagemRespostaPadrao.pressSequentially('Olá #nome! Este é um teste de resposta padrão com acentuação, coringa e emoji 😉😊💚🥰💛😅. Você está recebendo seu protocolo que é: #protocolo.');
        await this.botaosalvarRespostaPadrao.click();
        await expect(this.page.locator('div').filter({ hasText: /^Sucesso!Mensagem padrão criada com sucesso!$/ }).nth(2)).toBeVisible();
        //await this.botaoFecharMenuRespostasPadrao.click();
    }

    @step('Redefinir contato já identificado')
    async redefinirContato() {
        await this.botaoConversaOpcoes.click();
        await this.botaoConversaOpcoesRedefinirCliente.click();
        await this.botaoConversaOpcoesRedefinirClienteBuscarCliente.click();
        await this.page.getByPlaceholder('Clique para buscar por código').click();
        await this.page.getByPlaceholder('Clique para buscar por código').fill('teste banco de dados');
        await this.page.getByText('teste banco dados').first().click();
        await this.botaoConversaOpcoesRedefinirClienteSalvar.click();
        await this.botaoConversaOpcoesRedefinirClienteSalvarConfirma.click();
        await expect(this.page.locator('div').filter({ hasText: /^Sucesso!O contato foi redefinido!$/ }).nth(2)).toBeVisible();
        await this.botaoConversaOpcoes.click();
        await this.botaoConversaOpcoesRedefinirCliente.click();
        await this.botaoConversaOpcoesRedefinirClienteBuscarCliente.click();
        await this.page.getByPlaceholder('Clique para buscar por código').click();
        await this.page.getByPlaceholder('Clique para buscar por código').fill('teste caroline');
        await this.page.getByText('teste caroline').first().click();
        await this.botaoConversaOpcoesRedefinirClienteSalvar.click();
        await this.botaoConversaOpcoesRedefinirClienteSalvarConfirma.click();
        await expect(this.page.locator('div').filter({ hasText: /^Sucesso!O contato foi redefinido!$/ }).nth(2)).toBeVisible();
    }
}