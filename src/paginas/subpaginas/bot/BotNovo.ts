/**
o verdadeiro campeão é aquele que acredita na vitória, mesmo quando ela parece impossível.

no caso, a gente só perdeu aqui 🫠😭

mas a verdadeira vitória são os amigos que fizemos pelo caminho
*/

import { BrowserContext, type Locator, Page, WebSocket } from "@playwright/test";
import step from "../../../utilitarios/decorators";
import { getRandomChampion } from "../../../utilitarios/api/championlist";
import { expect } from "../../../utilitarios/fixtures/base";
import { faker } from "@faker-js/faker/locale/pt_BR";
import FinanceiroBotPage from "./financeiro/FinanceiroBotPage";
import ConexoesClientePage from "./conexoes/ConexoesClientePage";

export default class BotNovo {

    page: Page;
    navegador: BrowserContext;
    websocket: string[] = [];

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
    botaoAcoesConexoesCliente: Locator;
    exportarCSV: Locator;

    botaoConversaEnviarAudio: Locator;
    botaoConversaExcluirAudio: Locator;
    botaoNovaConversa: Locator;
    botaoConversaOpcoes: Locator;
    botaoConversaOpcoesEncerrarAtendimento: Locator;
    botaoAcoesDentroConversa: Locator;
    botaoAcoesDentroConversaEnviarSegundaVia: Locator;
    confirmarModalConversa: Locator;
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
    botaoConversaOpcoesTransferirAtendimentoSetor: Locator;
    botaoConversaConfirmarConvite: Locator;
    botaoConversaOpcoesRedefinirClienteSalvarConfirma: Locator;
    campoDePesquisaBuscarPorCodigo: Locator;
    toastDeSucessoContatoRedefinido: Locator;
    toastDeSucessoRespostaPadraoExcluida: Locator;
    toastDeSucessoRespostaPadraoCriada: Locator;
    toastDeSucessoRespostaPadraoEditada: Locator;
    toastDeSucessoConviteOperador: Locator;
    toastDeSucessoTransferenciaSetor: Locator;
    toastDeSucessoDevolverConversaParaFila: Locator;
    toastDeSucessoCopiarLink: Locator;
    botaoFecharModal: Locator;
    botaoDevolverParaFila: Locator;
    confirmarDevolucaoFila: Locator;
    devolverParaFilaDefinitivamente: Locator;
    toastDeSucessoDevolverParaFila: Locator;
    botaoResgatarDaFila: Locator;
    toastResgateEfetuado: Locator;
    botaoSairConversa: Locator;
    confirmarSaidaConversa: Locator;
    sairConversaDefinitivamente: Locator;
    toastDeErroSaidaOperador: Locator;
    botaoTransferirParaSetor: Locator;
    buscarSetor: Locator;
    confirmarTransferenciaSetor: Locator;
    botaoGerenciarTagsDentroDaConversa: Locator;
    botaoGerenciarTagsDentroDaConversaCriarTag: Locator;
    botaoGerenciarTagsDentroDaConversaDescricao: Locator;
    botaoGerenciarTagsDentroDaConversaCorDaTagHexadecimal: Locator;
    botaoGerenciarTagsDentroDaConversaCorDoTextoHexadecimal: Locator;
    botaoGerenciarTagsDentroDaConversaCorDaTag: Locator;
    botaoGerenciarTagsDentroDaConversaCorDoTexto: Locator;
    botaoGerenciarTagsDentroDaConversaSalvar: Locator;
    botaoCorDaTagConfirma: Locator;
    botaoGerenciarTagsDentroDaConversaBuscarTag: Locator;
    botaoGerenciarTagsDentroDaConversaEditarTag: Locator;
    botaoGerenciarTagsDentroDaConversaVincularEDesvincularTag: Locator;

    botaoConfirmar: Locator;
    botaoConversaOpcoesDevolverParaFila: Locator;
    primeiraMensagemDaConversa: Locator;
    botaoConversaFazerDownloadCopiarLink: Locator; 
    botaoConversaGravarAudio: Locator;
    botaoConversaPararGravacaoAudio: Locator;
    botaoConversaFazerDownloadAudio: Locator;
    botaoConversaCopiarLink: Locator;
    botaoConversaDarPlayAudio: Locator;
    botaoConversaPausarAudio: Locator;
    botaoAcoesCadastroCliente: Locator;
    botaoAcoes: Locator;
    botaoAcoesEnviarEmail: Locator;
    botaoAcoesFinanceiro: Locator;

    constructor(page: Page, navegador: BrowserContext) {

        this.page = page;
        this.navegador = navegador;

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
        this.confirmarModalConversa = this.page.getByLabel('Estou ciente que esta ação nã')
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
        this.botaoEnviarSegundaViaFaturas = this.page.getByRole('button', { name: 'Enviar' }).first();
        this.botaoAcoesDentroConversaRespostasPadrao = this.page.getByRole('button', { name: 'Respostas Padrão' });
        this.botaoAcoesDentroConversaRespostasPadraoCriar = this.page.getByRole('button', { name: 'clique aqui' });
        this.botaoConversaEnviarAudio = this.page.locator('slot > div > button:nth-child(3) > .flex')
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
        this.botaoResgatarDaFila = this.page.getByRole('row', { name: /\b(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}\b/ }).getByRole('button').last();
        this.toastResgateEfetuado = this.page.locator('div').filter({ hasText: /^Sucesso!Chamado resgatado com sucesso\.$/ }).nth(2);
        this.botaoSairConversa = this.page.getByRole('button', { name: 'Sair da conversa' });
        this.confirmarSaidaConversa = this.page.getByLabel('Estou ciente que esta ação nã');
        this.sairConversaDefinitivamente = this.page.getByRole('button', { name: 'Sair' });
        this.toastDeErroSaidaOperador = this.page.locator('div').filter({ hasText: /^Atenção!Não é possível sair da conversa sendo o único operador!$/ }).nth(2);
        this.botaoTransferirParaSetor = this.page.getByText('Transferir p/ setor');
        this.buscarSetor = this.page.getByPlaceholder('Buscar setor');
        this.confirmarTransferenciaSetor = this.page.getByRole('button', { name: 'Transferir atendimento' });
        this.toastDeSucessoTransferenciaSetor = this.page.locator('div').filter({ hasText: /^Sucesso!Chamado transferido para o setor com sucesso!$/ }).nth(2);
        this.botaoGerenciarTagsDentroDaConversa = this.page.locator('button').filter({ hasText: 'Gerenciar tags' }).nth(1);
        this.botaoGerenciarTagsDentroDaConversaCriarTag = this.page.getByRole('button', { name: 'Criar nova tag' }).nth(1);
        this.botaoGerenciarTagsDentroDaConversaDescricao = this.page.locator('input[name="nome"]');
        this.botaoGerenciarTagsDentroDaConversaCorDaTag = this.page.getByRole('button').nth(1);
        this.botaoGerenciarTagsDentroDaConversaCorDaTagHexadecimal = this.page.locator('input[name="corTag"]');
        this.botaoGerenciarTagsDentroDaConversaCorDoTextoHexadecimal = this.page.locator('input[name="corTexto"]');
        this.botaoGerenciarTagsDentroDaConversaCorDoTexto = this.page.getByRole('button').nth(2);
        this.botaoCorDaTagConfirma = this.page.getByRole('button', { name: 'Aplicar' });
        this.botaoGerenciarTagsDentroDaConversaSalvar = this.page.getByRole('button', { name: 'Salvar' });
        this.botaoGerenciarTagsDentroDaConversaBuscarTag = this.page.getByPlaceholder('Clique para buscar');
        this.botaoGerenciarTagsDentroDaConversaEditarTag = this.page.getByRole('button').nth(2);
        this.botaoGerenciarTagsDentroDaConversaVincularEDesvincularTag = this.page.locator('div:nth-child(44) > div > #confirmation').last();
        this.botaoAcoesCadastroCliente =  this.page.locator('div').filter({ hasText: /^Cadastro do cliente$/ }).first();
        this.botaoAcoes = this.page.locator('.ml-4').first();
        this.botaoAcoesConexoesCliente = this.page.locator('div').filter({ hasText: /^Conexões do cliente$/ }).first();
        this.botaoAcoesEnviarEmail = this.page.locator('div').filter({ hasText: /^Enviar e-mail$/ }).first();
        this.botaoAcoesFinanceiro = this.page.locator('div').filter({ hasText: /^Financeiro$/ }).first();
    };

    @step('Adicionar mensagens vindas do WebSocket')
    async registrarMensagensWebsocket(mensagem: string) {
        this.websocket.push(mensagem);
    }

    @step('Acessar cadastro de pessoas')
    async acessarCadastroCliente() {
        const cadastroDePessoasPagePromise = this.navegador.waitForEvent('page');
        this.botaoAcoes.click();
        this.botaoAcoesCadastroCliente.click();
        const cadastroDePessoasPage = await cadastroDePessoasPagePromise;
        return cadastroDePessoasPage;        
    }

    @step('Acessar conexões do cliente')
    async acessarConexoesCliente() {
        const conexoesClientePagePromise = this.navegador.waitForEvent('page');
        this.botaoAcoes.click();
        this.botaoAcoesConexoesCliente.click();
        const conexoesClientePage = await conexoesClientePagePromise;
        return new ConexoesClientePage(conexoesClientePage);
    };        

    @step('Limpar conversa')
    async limparConversa() {
        await this.botaoConversaOpcoes.click();
        await this.botaoConversaOpcoesEncerrarAtendimento.click();
        await this.confirmarModalConversa.click();
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
        await expect(this.toastDeSucesso).toBeVisible();
    }

    @step('Clicar nas faturas dentro da conversa')
    async clicarFaturas(numeroDeFaturas: number) {
        for (let i = 1; i < numeroDeFaturas; i++) {
            await this.page.locator(`tr:nth-child(${i}) > td`).first().click();
        }  
    }

    @step('Editar resposta padrão')
    async editarRespostaPadrao(nomeRespostaPadrao: string) {
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
        // await expect(this.toastDeSucessoDevolverParaFila).toBeVisible();
        await this.abaFilaEspera.click();
        await this.page.waitForTimeout(2000);
        await this.botaoResgatarDaFila.click();
        // await expect(this.toastResgateEfetuado).toBeVisible();
    }

    @step('Sair da conversa com apenas um operador')
    async sairConversaUnicoOperador() {
        await this.botaoConversaOpcoes.click();
        await this.botaoSairConversa.click();
        await this.confirmarSaidaConversa.click();
        await this.sairConversaDefinitivamente.click();
        await expect(this.toastDeErroSaidaOperador).toBeVisible();
    }

    @step('Transferir para setor')
    async transferirParaSetor() {
        await this.botaoConversaOpcoes.click();
        await this.botaoTransferirParaSetor.click();
        await this.buscarSetor.click();
        await this.buscarSetor.pressSequentially('financeiro');
        await this.page.getByRole('row', { name: 'Financeiro-TESTE' }).locator('label').click();
        await this.page.getByRole('row', { name: 'Financeiro-TESTE' }).locator('label').click();
        await this.confirmarTransferenciaSetor.click();
        await expect (this.toastDeSucessoTransferenciaSetor).toBeVisible();
        await this.abaFilaEspera.click();
        await this.page.waitForTimeout(2000);
        await this.botaoResgatarDaFila.click();
    }

    @step('Criar tag')
    async criarTag() {
        //Cor e API que dará o retorno 200. Vincular e desvincular a tag recém criada. Tem verificação?
        await this.botaoGerenciarTagsDentroDaConversa.click();
        await this.botaoGerenciarTagsDentroDaConversaCriarTag.click();
        await this.botaoGerenciarTagsDentroDaConversaDescricao.click();
        await this.botaoGerenciarTagsDentroDaConversaDescricao.pressSequentially(faker.animal.cat());
        await this.page.getByText('Selecione uma cor').click({ position: { x: 0, y: 0 } });
        await this.botaoCorDaTagConfirma.click();
        await this.botaoGerenciarTagsDentroDaConversaSalvar.click();
        await this.botaoGerenciarTagsDentroDaConversaVincularEDesvincularTag.click();
        await this.page.waitForTimeout(3000);
        await this.botaoGerenciarTagsDentroDaConversaVincularEDesvincularTag.click();

    }

    @step('Editar tag')
    async editarTag() {
        //tem que ajustar a criação da tag e depois adicionar aqui a criação de uma tag com o nome Teste Edição pra ela ser editada sempre
        await this.botaoGerenciarTagsDentroDaConversa.click();
        await this.botaoGerenciarTagsDentroDaConversaBuscarTag.click();
        await this.botaoGerenciarTagsDentroDaConversaBuscarTag.pressSequentially('Teste Edição');
        await this.botaoGerenciarTagsDentroDaConversaEditarTag.click();
        await this.botaoGerenciarTagsDentroDaConversaDescricao.click();
        await this.botaoGerenciarTagsDentroDaConversaDescricao.press('Control+A');
        await this.botaoGerenciarTagsDentroDaConversaDescricao.press('Backspace');
        await this.botaoGerenciarTagsDentroDaConversaDescricao.pressSequentially(faker.food.vegetable());
        await this.botaoGerenciarTagsDentroDaConversaCorDaTagHexadecimal.click();
        await this.botaoGerenciarTagsDentroDaConversaCorDaTagHexadecimal.press('Control+A');
        await this.botaoGerenciarTagsDentroDaConversaCorDaTagHexadecimal.press('Backspace');
        await this.botaoGerenciarTagsDentroDaConversaCorDaTagHexadecimal.pressSequentially(faker.color.rgb({ format: 'hex', casing: 'lower' }));
        await this.botaoGerenciarTagsDentroDaConversaCorDoTextoHexadecimal.click();
        await this.botaoGerenciarTagsDentroDaConversaCorDoTextoHexadecimal.press('Control+A');
        await this.botaoGerenciarTagsDentroDaConversaCorDoTextoHexadecimal.press('Backspace');
        await this.botaoGerenciarTagsDentroDaConversaCorDoTextoHexadecimal.pressSequentially(faker.color.rgb({ format: 'hex', casing: 'lower' }));
        await this.botaoGerenciarTagsDentroDaConversaSalvar.click();
        await this.botaoGerenciarTagsDentroDaConversaBuscarTag.click();
        await this.botaoGerenciarTagsDentroDaConversaBuscarTag.press('Control+A');
        await this.botaoGerenciarTagsDentroDaConversaBuscarTag.press('Backspace');
        await this.botaoGerenciarTagsDentroDaConversaVincularEDesvincularTag.click();
        await this.page.waitForTimeout(3000);
        await this.botaoGerenciarTagsDentroDaConversaVincularEDesvincularTag.click();
        
    }
    
    @step('Transferir para setor')
    async transferirConversaParaSetor(setor: string, temOperador: boolean) {
        await this.botaoConversaOpcoes.click();
        await this.botaoConversaOpcoesTransferirAtendimentoSetor.click();
        if (temOperador) {
            await this.page.getByRole('row', { name: setor }).getByRole('cell').first().click();
        } else {
            await this.page.getByRole('row', { name: setor }).getByRole('cell').first().click();
        }
        await this.page.getByRole('button', { name: 'Transferir atendimento' }).click();
        await expect(this.toastDeSucessoTransferenciaSetor).toBeVisible();
    }

    @step('Devolver conversa para a fila')
    async devolverConversaParaFila() {
        await this.botaoConversaOpcoes.click();
        await this.botaoConversaOpcoesDevolverParaFila.click();
        await this.confirmarModalConversa.click();
        await this.botaoConfirmar.click();
        await expect(this.toastDeSucessoDevolverConversaParaFila).toBeVisible();  
    }

    @step('Criar novo contato dentro do cliente')
    async criarNovoContato() {
        await this.chatBotMenu.click();
        await this.botaoNovaConversa.click();
        await this.pesquisarPessoaConversa('teste caroline');
        await this.page.getByRole('button', { name: 'Novo contato' }).click();
        await this.page.getByRole('combobox').click();
        await this.page.getByLabel('Gupshup 4229').click();
        await this.page.getByLabel('Telefone com DDD *').click();
        await this.page.getByLabel('Telefone com DDD *').fill('(51) 9802-65275');
        await this.page.getByRole('button', { name: 'Salvar' }).click();
    }

    @step('Abrir aba de email')
    async enviarEmail() {
        const enviarEmailPagePromise = this.navegador.waitForEvent('page');
        this.botaoAcoes.click();
        this.botaoAcoesEnviarEmail.click();
        const enviarEmailPage = await enviarEmailPagePromise
        return enviarEmailPage;
    };

    @step('Remover contato')
    async acessarMenuCadastroPessoas() {
        await this.page.locator('.ml-4').click();
        const page1Promise = this.navegador.waitForEvent('page');
        await this.page.locator('div').filter({ hasText: /^Cadastro do cliente$/ }).first().click();
        const page1 = await page1Promise;
        return page1;
    }

    @step('Enviar mensagem chat')
    async enviarMensagemChat(mensagem: string) {
        await this.page.getByPlaceholder('Escreva uma mensagem').click();
        await this.page.getByPlaceholder('Escreva uma mensagem').pressSequentially(mensagem);
        await this.page.locator('slot').filter({ hasText: mensagem }).getByRole('button').nth(3).click();
        expect(this.websocket[0]).toBe(mensagem);
    }

    @step('Enviar mensagem de audio ao chat')
    async enviarAudioChat() {   
        await this.gravarAudio(10);
        await this.botaoConversaEnviarAudio.click(); 
        await expect(this.botaoConversaFazerDownloadCopiarLink).toBeVisible();
    }

    @step('Gravar mensagem de audio')
    async gravarAudio(tempoDeAudio: number) {
        await this.botaoConversaGravarAudio.click();
        await this.page.waitForTimeout(tempoDeAudio * 1000); // tempo de gravaçao do audio
        await this.botaoConversaPararGravacaoAudio.click();
    }    

    @step('Excluir audio antes de enviar')
    async excluirAudioChat() {
        await this.gravarAudio(10);
        await this.botaoConversaPararGravacaoAudio.click();
        await this.botaoConversaExcluirAudio.click();
        await this.page.getByRole('row', { name: 'Financeiro-TESTE' }).first().click(); 
        await expect(this.botaoConversaExcluirAudio).toBeHidden();
    }

    @step('Fazer download do arquivo de audio')
    async fazerDownloadAudio() {
        await this.gravarAudio(10);
        await this.botaoConversaFazerDownloadCopiarLink.click();
        await this.botaoConversaFazerDownloadAudio.click();
        this.page.on('download', (download) => {
            expect(download).toBeTruthy();
        });
    }

    @step('Copiar link do audio na conversa')
    async copiarLinkAudio() {    
        await this.botaoConversaFazerDownloadCopiarLink.click();
        await this.botaoConversaCopiarLink.click();
        await expect(this.toastDeSucessoCopiarLink).toBeVisible();
    }
    
    @step('Acessar página do financeiro dentro do bot')
    async acessarFinanceiro(){
        const financeiroPagePromise = this.navegador.waitForEvent('page');
        this.botaoAcoes.click();
        this.botaoAcoesFinanceiro.click();
        const financeiroPage = await financeiroPagePromise;
        return new FinanceiroBotPage(financeiroPage);        
    } 

    @step('Ouvir o audio antes de enviar ele para a conversa')
    async ouvirAudio() {
        await this.gravarAudio(10);
        await this.botaoConversaDarPlayAudio.click();
        await this.page.waitForTimeout(10 * 1000); // tempo de escuta do audio
        await this.botaoConversaPausarAudio.click();
    }
}