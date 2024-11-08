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
    encerrarConversaDefinitivamente: Locator;
    botaoEnviarSegundaViaFaturas: Locator;
    toastDeSucesso: Locator;
    campoDePesquisaDePessoaNovaConversa: Locator;
    abaPrimeiraConversaDisponivel: Locator;
    selecionarPrimeiraOpcaoNovaConversa: Locator;
    botaoIniciarChat: Locator;

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
        this.botaoConversaOpcoesEncerrarAtendimento = this.page.getByText('Encerrar atendimento' );
        this.confirmarEncerramentoConversa = this.page.getByLabel('Estou ciente que esta ação nã')
        this.encerrarConversaDefinitivamente = this.page.getByRole('button', { name: 'Encerrar' });
        this.botaoNovaConversa = this.page.locator('xpath=//div[@id="radix-:r11:-content-clients"]//button[1]').nth(0);
        this.botaoAcoesDentroConversa = this.page.getByRole('button', { name: 'Ações', exact: true });
        this.botaoAcoesDentroConversaEnviarSegundaVia = this.page.getByRole('button', { name: 'Enviar 2ª via de fatura' }).first();
        this.botaoEnviarSegundaViaFaturas = this.page.getByRole('button', { name: 'Enviar' }).first();
        this.toastDeSucesso = this.page.locator('div').filter({ hasText: /^Sucesso!Segundas vias enviadas com sucesso!$/ }).nth(2)
        ;
        this.campoDePesquisaDePessoaNovaConversa = this.page.getByPlaceholder('Clique para buscar por código');
        this.abaPrimeiraConversaDisponivel = this.page.getByRole('tab', { name: 'Whatsapp' }).first();
        this.selecionarPrimeiraOpcaoNovaConversa = this.page.locator('td').first();
        this.botaoIniciarChat = this.page.getByRole('button', { name: 'Iniciar chat' }).first();
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
        await this.campoDePesquisaDePessoaNovaConversa.click();
        await this.campoDePesquisaDePessoaNovaConversa.fill(cliente);
        await this.page.getByText(cliente).first().click();
    }

    @step('Iniciar conversa')
    async iniciarConversa() {
        await this.selecionarPrimeiraOpcaoNovaConversa.click();
        await this.botaoIniciarChat.click();
    }

    @step('Acessar conversa')
    async acessarAbaPrimeiraConversa() {
        this.abaPrimeiraConversaDisponivel.click();
    }

    @step('Enviar anexo')
    async enviarAnexo(numeroDeFaturas: number) {
        await this.botaoAcoesDentroConversa.click();
        await this.botaoAcoesDentroConversaEnviarSegundaVia.click();
        await this.clicarFaturas(numeroDeFaturas);
        await this.botaoEnviarSegundaViaFaturas.click();
        await expect(this.toastDeSucesso).toBeAttached();
    }

    @step('Clicar nas faturas dentro da conversa')
    async clicarFaturas(numeroDeFaturas: number) {
        for (let i = 1; i < numeroDeFaturas; i++) {
            console.log(i);
            await this.page.locator(`tr:nth-child(${i}) > td`).first().click();
        }  
    }

}