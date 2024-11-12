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
    abaFilaEspera: Locator;

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
    botaoExcluirRespostaPadrao: Locator;
    campoDePesquisaDePessoaNovaConversa: Locator;
    abaPrimeiraConversaDisponivel: Locator;
    selecionarPrimeiraOpcao: Locator;
    botaoIniciarChat: Locator;
    botaoAcoesDentroConversaRespostasPadrao: Locator;
    botaoAcoesDentroConversaRespostasPadraoCriar: Locator;
    botaosalvarRespostaPadrao: Locator;
    botaoFecharMenuRespostasPadrao: Locator;
    cadastroGrupoRespostaPadrao: Locator;
    cadastroMensagemRespostaPadrao: Locator;
    botaoConversaOpcoesRedefinirCliente: Locator;
    botaoConversaOpcoesRedefinirClienteBuscarCliente: Locator;
    botaoConversaOpcoesRedefinirClienteSalvar: Locator;
    botaoConversaOpcoesConvidarOperador: Locator;
    botaoConversaConfirmarConvite: Locator;
    botaoConversaOpcoesRedefinirClienteSalvarConfirma: Locator;
    campoDePesquisaBuscarPorCodigo: Locator;
    toastDeSucessoContatoRedefinido: Locator;
    toastDeSucessoRespostaPadraoExcluida: Locator;
    toastDeSucessoRespostaPadraoCriada: Locator;
    toastDeSucessoRespostaPadraoEditada: Locator;
    toastDeSucessoConviteOperador: Locator;
    botaoFecharModal: Locator;
    botaoDevolverParaFila: Locator;
    confirmarDevolucaoFila: Locator;
    devolverParaFilaDefinitivamente: Locator;
    toastDeSucessoDevolverParaFila: Locator;
    botaoResgatarDaFila: Locator;
    toastResgateEfetuado: Locator;

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
        this.botaoEnviarSegundaViaFaturas = this.page.getByRole('button', { name: 'Enviar' }).first();
        this.toastDeSucesso = this.page.locator('div').filter({ hasText: /^Sucesso!Segundas vias enviadas com sucesso!$/ }).nth(2);
        this.campoDePesquisaDePessoaNovaConversa = this.page.getByPlaceholder('Clique para buscar por código');
        this.abaPrimeiraConversaDisponivel = this.page.getByRole('tab', { name: 'Whatsapp' }).first();
        this.selecionarPrimeiraOpcao = this.page.locator('td').first();
        this.botaoIniciarChat = this.page.getByRole('button', { name: 'Iniciar chat' }).first();
        this.botaoEnviarSegundaViaFaturas = this.page.getByRole('button', { name: 'Enviar (1)' });
        this.botaoAcoesDentroConversaRespostasPadrao = this.page.getByRole('button', { name: 'Respostas Padrão' });
        this.botaoAcoesDentroConversaRespostasPadraoCriar = this.page.getByRole('button', { name: 'clique aqui' });
        this.botaosalvarRespostaPadrao = this.page.getByRole('button', { name: 'Salvar' });
        this.cadastroGrupoRespostaPadrao = this.page.getByPlaceholder('Clique para preencher');
        this.cadastroMensagemRespostaPadrao = this.page.getByLabel('Mensagem *');
        this.botaoConversaOpcoesRedefinirCliente = this.page.getByText('Redefinir cliente');
        this.botaoConversaOpcoesRedefinirClienteBuscarCliente = this.page.getByPlaceholder('Clique para buscar por código');
        this.botaoConversaOpcoesRedefinirClienteSalvar = this.page.getByRole('button', { name: 'Redefinir cliente' });
        this.botaoConversaOpcoesRedefinirClienteSalvarConfirma = this.page.getByRole('button', { name: 'Confirmar' });
        this.campoDePesquisaBuscarPorCodigo = this.page.getByPlaceholder('Clique para buscar por código').first()
        this.toastDeSucessoContatoRedefinido = this.page.locator('div').filter({ hasText: /^Sucesso!O contato foi redefinido!$/ }).nth(2);
        this.toastDeSucessoRespostaPadraoExcluida = this.page.locator('div').filter({ hasText: /^Sucesso!Mensagem padrão excluída com sucesso!$/ }).nth(2);
        this.botaoExcluirRespostaPadrao = this.page.getByRole('button', { name: 'Excluir' });
        this.toastDeSucessoRespostaPadraoCriada = this.page.locator('div').filter({ hasText: /^Sucesso!Mensagem padrão criada com sucesso!$/ }).nth(2);
        this.botaoFecharModal = this.page.locator('xpath=//button[@class="w-12 h-12 bg-slate-200 rounded-full absolute -top-6 -right-6 dark:!bg-[#F1FFF7] dark:text-[#253339]"]')
        this.botaoConversaOpcoesConvidarOperador = this.page.getByRole('button', { name: 'Convidar p/ o chat' });
        this.botaoConversaConfirmarConvite = page.getByRole('button', { name: 'Convidar' });
        this.toastDeSucessoConviteOperador = this.page.locator('div').filter({ hasText: /^Sucesso!Convite enviado com sucesso!$/ }).nth(2);
        this.botaoDevolverParaFila = this.page.getByRole('button', { name: 'Devolver para a fila' });
        this.confirmarDevolucaoFila = this.page.getByLabel('Estou ciente que esta ação nã');
        this.devolverParaFilaDefinitivamente = this.page.getByRole('button', { name: 'Confirmar' });
        this.toastDeSucessoDevolverParaFila = this.page.locator('div').filter({ hasText: /^Sucesso!Chamado devolvido para a fila com sucesso!$/ }).nth(1)
        this.abaFilaEspera = this.page.getByRole('tab', { name: 'Fila em espera' });
        this.botaoResgatarDaFila = this.page.getByRole('row', { name: /0\s?min/i }).getByRole('button').first();
        this.toastResgateEfetuado = this.page.locator('div').filter({ hasText: /^Sucesso!Chamado resgatado com sucesso\.$/ }).nth(2);

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
        await this.selecionarPrimeiraOpcao.click();
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

    @step('Editar resposta padrão')
    async editarRespostaPadrao(nomeRespostaPadrao: string) {
        await this.botaoAcoesDentroConversaRespostasPadrao.click();
        await this.page.getByRole('button', { name: nomeRespostaPadrao, exact: true }).click();
        await this.page.getByLabel(nomeRespostaPadrao, { exact: true }).getByRole('button').first().click();

        await this.page.getByPlaceholder('Clique para preencher').click();
        await this.page.getByPlaceholder('Clique para preencher').press('ControlOrMeta+a');
        await this.page.getByPlaceholder('Clique para preencher').pressSequentially('teste');

        await this.page.getByLabel('Mensagem *').click();
        await this.page.getByLabel('Mensagem *').press('ControlOrMeta+a');
        await this.page.getByLabel('Mensagem *').pressSequentially('receba pai e o melhor do mundo luva de pedreiro bora bill amostradinho');
        
        await this.page.getByRole('button', { name: 'Salvar' }).click();
    }


    @step('Criar resposta padrão')
    async criarRespostaPadrao(nomeRespostaPadrao: string) {
        await this.botaoAcoesDentroConversa.click();
        await this.botaoAcoesDentroConversaRespostasPadrao.click();
        await this.botaoAcoesDentroConversaRespostasPadraoCriar.click();
        await this.cadastroGrupoRespostaPadrao.click();
        await this.cadastroGrupoRespostaPadrao.pressSequentially(nomeRespostaPadrao);
        await this.cadastroMensagemRespostaPadrao.click();
        await this.cadastroMensagemRespostaPadrao.pressSequentially('Olá #nome! Este é um teste de resposta padrão com acentuação, coringa e emoji 😉😊💚🥰💛😅. Você está recebendo seu protocolo que é: #protocolo.');
        await this.botaosalvarRespostaPadrao.click();
        await expect(this.toastDeSucessoRespostaPadraoCriada).toBeVisible();
        await this.botaoFecharModal.click();
    }

    @step('Excluir resposta padrão')
    async excluirRespostaPadrao(nomeRespostaPadrao: string) {
        await this.procurarRespostaPadrao(nomeRespostaPadrao);
        await this.botaoExcluirRespostaPadrao.click();
        await expect(this.toastDeSucessoRespostaPadraoExcluida).toBeVisible();
    }

    @step('Procurar resposta padrão')
    async procurarRespostaPadrao(nomeRespostaPadrao: string) {
        await this.page.getByRole('button', { name: nomeRespostaPadrao }).click();
        await this.page.getByLabel(nomeRespostaPadrao).getByRole('button').nth(1).click();
    }

    @step('Convidar operador para conversa')
    async convidarOperadorParaConversa(nomeOperador: string) {
        await this.botaoConversaOpcoes.click();
        await this.botaoConversaOpcoesConvidarOperador.click();
        await this.selecionarPrimeiraOpcao.click();
        await this.botaoConversaConfirmarConvite.click();
        await expect(this.toastDeSucessoConviteOperador ).toBeVisible();
    }

    @step('Redefinir contato identificado')
    async redefinirContato() {
        await this.botaoConversaOpcoes.click();
        await this.botaoConversaOpcoesRedefinirCliente.click();
        await this.botaoConversaOpcoesRedefinirClienteBuscarCliente.click();
        await this.campoDePesquisaBuscarPorCodigo.click();
        await this.campoDePesquisaBuscarPorCodigo.pressSequentially('teste banco de dados');
        await this.page.getByText('teste banco dados').first().click();
        await this.botaoConversaOpcoesRedefinirClienteSalvar.click();
        await this.botaoConversaOpcoesRedefinirClienteSalvarConfirma.click();
        await expect(this.toastDeSucessoContatoRedefinido).toBeVisible();
        await this.botaoConversaOpcoes.click();
        await this.botaoConversaOpcoesRedefinirCliente.click();
        await this.botaoConversaOpcoesRedefinirClienteBuscarCliente.click();
        await this.campoDePesquisaBuscarPorCodigo.click();
        await this.campoDePesquisaBuscarPorCodigo.pressSequentially('teste caroline');
        await this.page.getByText('1107 - Teste Caroline').first().click();
        await this.botaoConversaOpcoesRedefinirClienteSalvar.click();
        await this.botaoConversaOpcoesRedefinirClienteSalvarConfirma.click();
        await expect(this.toastDeSucessoContatoRedefinido).toBeVisible();
    }

    @step('Devolver conversa para fila')
    async devolverParaFila() {
        await this.botaoConversaOpcoes.click();
        await this.botaoDevolverParaFila.click();
        await this.confirmarDevolucaoFila.click();
        await this.devolverParaFilaDefinitivamente.click();
        await expect(this.toastDeSucessoDevolverParaFila).toBeVisible();
        await this.abaFilaEspera.click();
        await this.botaoResgatarDaFila.click();
        await expect(this.toastResgateEfetuado).toBeVisible();
    }
}