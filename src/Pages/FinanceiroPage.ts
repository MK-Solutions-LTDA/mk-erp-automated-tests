// isso aqui é de fato uma das coisas já feitas
// não tente refatorar ou qualquer coisa do tipo
// eu tentei e falhei miseravelmente nessa tarefa
// se você conseguir, por favor, peça um aumento ao tulio

import { faker } from "@faker-js/faker/locale/pt_BR";
import BasePage from "./BasePage";
import { type Page, type Frame, expect } from "@playwright/test";
import path from "path";
import step from "../utils/decorators";
const folderImagens = path.join(process.cwd(), "/src/images");


export class FinanceiroPage extends BasePage {
  
  telaAtual: Frame | null;

  constructor(page: Page) {
    super(page);
    this.telaAtual = null;
  }

  @step('Navegar para a tela de contas a pagar')
  async navegarParaContasAPagarTela() {
    await this.page.waitForLoadState('domcontentloaded');
    const mainsystem = await this.mudarParaIframe('frame[name="mainsystem"]', this.page);
    const mainform = await this.mudarParaIframe('iframe[name="mainform"]', mainsystem);
    const financeiroAba = await this.mudarParaIframe('iframe[componenteaba="Financeiro - PainelCloseAbaPrincipal"]',mainform);
    const mainform2 = await this.mudarParaIframe('iframe[name="mainform"]',financeiroAba);
    const gerenciadorContas = await this.mudarParaIframe('iframe[componenteaba="Gerenciador de Contas a PagarClosePainelAba"]', mainform2);
    const mainform3 = await this.mudarParaIframe('iframe[name="mainform"]', gerenciadorContas);
    this.telaAtual = await this.mudarParaIframe('iframe[src="/mk/mkcore/BillsToPay/?sys=MK0"]', mainform3);
    return this.telaAtual;
  }

  @step('Navegar para a tela de contas a receber')
  async navegarParaContasAReceberTela() {
    await this.page.waitForLoadState('load');
    const mainsystem = await this.mudarParaIframe('frame[name="mainsystem"]', this.page);
    const mainform = await this.mudarParaIframe('iframe[name="mainform"]', mainsystem);
    const financeiroAba = await this.mudarParaIframe('iframe[componenteaba="Financeiro - PainelCloseAbaPrincipal"]',mainform);
    const mainform2 = await this.mudarParaIframe('iframe[name="mainform"]',financeiroAba);
    const gerenciadorContas = await this.mudarParaIframe('iframe[componenteaba="Gerenciador de Contas a ReceberClosePainelAba"]', mainform2);
    await this.page.waitForTimeout(10 * 1000)
    const mainform3 = await this.mudarParaIframe('iframe[name="mainform"]', gerenciadorContas);
    this.telaAtual = await this.mudarParaIframe('iframe[src="/mk/mkcore/BillsToReceive/?sys=MK0"]', mainform3);
    return this.telaAtual;
  }

  @step('Navegar para a tela de DRE Gerenencial')
  async navegarParaDRETela() {
    await this.page.waitForLoadState('load');
    const mainsystem = await this.mudarParaIframe('frame[name="mainsystem"]', this.page);
    const mainform = await this.mudarParaIframe('iframe[name="mainform"]', mainsystem);
    const financeiroAba = await this.mudarParaIframe('iframe[componenteaba="Financeiro - PainelCloseAbaPrincipal"]',mainform);
    const mainform2 = await this.mudarParaIframe('iframe[name="mainform"]',financeiroAba);
    const gerenciadorContas = await this.mudarParaIframe('iframe[componenteaba="DRE GerencialClosePainelAba"]', mainform2);
    await this.page.waitForTimeout(10 * 1000)
    const mainform3 = await this.mudarParaIframe('iframe[name="mainform"]', gerenciadorContas);
    this.telaAtual = await this.mudarParaIframe('iframe[src="/mk/mkcore/DRE/?sys=MK0"]', mainform3);
    return this.telaAtual;
  }

  @step('Criar conta a pagar')
  async criarContaAPagar( credorFatura: string, descricaoFatura: string, dataVencimentoFatura: string, valorFatura: string, opcaoFatura: string, planoConta: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.preencherDetalhes(credorFatura, descricaoFatura, dataVencimentoFatura, valorFatura, opcaoFatura);
    await this.irProximaEtapa(opcaoFatura, planoConta);
  }

  @step('Estornar fatura')
  async estornarFatura( opcaoFatura: string, estornoParcial: boolean, idFatura?: string ) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao('button', 'Pagas')
    await this.telaAtual?.getByRole("row", { name: idFatura }).getByRole("button").nth(2).click();
    await this.telaAtual?.getByRole("button", { name: "Estornar" }).nth(1).click();
    switch (estornoParcial) {
      case true:
        await this.telaAtual?.waitForSelector("h2");
        await this.telaAtual?.getByRole("switch").click();
        await this.preencherDetalheEstorno(opcaoFatura);
        await this.telaAtual?.getByRole("cell", { name: "Registro de liquidação parcial" }).click();
        await this.clicarBotao('button', 'Confirmar')
        break;
      case false:
        await this.telaAtual?.waitForSelector("h2");
        await this.preencherDetalheEstorno(opcaoFatura);
        await this.clicarBotao('button', 'Confirmar')
        break;
      default:
        throw new Error("Método de estorno inválido");
    }
  }

  @step('Suspender fatura')
  async suspenderFatura(credor: string, motivoSuspensao: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao("button","Pendentes")
    await this.telaAtual?.getByRole("row", { name: credor }).getByRole("button").nth(2).click();
    await this.telaAtual?.getByRole("button", { name: "Suspender" }).nth(1).click();
    await this.clicarBotao('combobox')
    await this.telaAtual?.getByLabel(motivoSuspensao).getByText(motivoSuspensao).click();
    await this.clicarBotao('button', 'Confirmar')
  }

  @step('Alterar quantidade de resultados')
  async liquidarFatura(idFatura: string, valor: string, liquidacaoParcial: boolean) { 
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotaoFiltro();
    await this.selecionarFiltroFatura();
    await this.preencherCampoBusca(idFatura);
    await this.aplicarFiltro();
    await this.selecionarFatura(idFatura);
    await this.clicarBotaoLiquidar();
    if (liquidacaoParcial) await this.realizarLiquidacaoParcial(valor);
    await this.selecionarContaBanco();
    await this.preencherMotivoLiquidacao();
    await this.confirmarLiquidacao();
  }

  @step('Preencher detalhe do estorno')
  async preencherDetalheEstorno(opcaoFatura: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao('combobox')
    await this.telaAtual?.getByLabel("Conta banco").click();
    await this.telaAtual?.getByLabel("Estornar fatura").locator("button").filter({ hasText: "Clique para selecionar" }).click();
    await this.telaAtual?.getByLabel(opcaoFatura).click();
    await this.telaAtual?.locator('input[name="justificativa"]').click();
    await this.telaAtual?.locator('input[name="justificativa"]').pressSequentially(faker.lorem.sentences());
  }

  @step('Preencher detalhes da conta')
  async preencherDetalhes(credorFatura: string, descricaoFatura: string, dataVencimentoFatura: string, valorFatura: string, opcaoFatura: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotaoComTexto("Nova");
    await this.selecionarOpcaoNoCombobox(credorFatura);
    await this.preencherCampo("description", descricaoFatura);
    await this.preencherCampo("dueDate", dataVencimentoFatura);
    await this.preencherCampo("value", valorFatura);
    await this.selecionarOpcaoFatura(opcaoFatura);
  }
  
  @step('Remover suspenção da fatura')
  async removerSuspencaoFatura() {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao('button', 'Suspensas')
    await this.telaAtual?.getByRole("row", { name: /(\d{6})/gim }).getByRole("button").nth(2).click();
    await this.telaAtual?.getByRole("button", { name: "Remover suspensão" }).nth(1).click();
    await this.clicarTexto("Confirmar");
  }

  @step('Excluir fatura')
  async excluirFatura() {
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.clicarBotao('button', 'Pendentes')
    await this.telaAtual?.getByRole("row", { name: /(\d{6})/gim }).getByRole("button").nth(2).click();
    await this.clicarBotao('button', 'Excluir')
    await this.telaAtual?.locator("span").filter({ hasText: "Clique para selecionar" }).click();
    await this.telaAtual?.getByLabel("Concorrência").first().click();
    await this.telaAtual?.locator('input[name="descricaoExtra"]').click();
    await this.telaAtual?.locator('input[name="descricaoExtra"]').pressSequentially(faker.lorem.sentences());
    await this.clicarBotao('button', 'Confirmar')
  }

  @step('Alterar informações da fatura')
  async alterarInfosFatura() {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao('button', 'Pendentes')
    await this.telaAtual?.getByRole("row", { name: /(\d{6})/gim }).getByRole("button").nth(2).click();
    await this.telaAtual?.getByRole("button", { name: "Alterar" }).nth(4).click();
    await this.telaAtual?.locator('input[name="descricao"]').click();
    await this.telaAtual?.locator('input[name="descricao"]').press("ControlOrMeta+a");
    await this.telaAtual?.locator('input[name="descricao"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.locator('input[name="valor"]').click();
    await this.telaAtual?.locator('input[name="valor"]').press("ControlOrMeta+a");
    await this.telaAtual?.locator('input[name="valor"]').pressSequentially(faker.number.int({ min: 100, max: 1000 }).toString());
    await this.telaAtual?.locator('textarea[name="observacoes"]').click();
    await this.telaAtual?.locator('textarea[name="observacoes"]').pressSequentially(faker.lorem.sentences());
    await this.clicarBotao('button', 'Confirmar')
    await this.clicarTexto('Ok');
  }

  @step('Adicionar anexos na fatura')
  async anexarArquivosFatura(tipo: Frame | null) {
    if (!this.telaAtual) tipo;
    await this.page.waitForTimeout(2 * 1000);
    await this.clicarBotao('button', 'Pendentes')
    await this.page.waitForTimeout(2 * 1000);
    await this.telaAtual?.getByRole('button', { name: 'Suspensas' }).click();
    await this.telaAtual?.getByRole("row", { name: /(\d{6})/gim }).getByRole("button").nth(2).click();
    await this.telaAtual?.getByRole('button', { name: 'Anexos' }).click();
    await this.anexarArquivos();
    await this.clicarBotao("button", "Salvar anexos")
  }

  @step('Alterar faturas em massa')
  async alteracaoFaturaEmMassa(tipoAlteracao: string, descricao: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    switch (tipoAlteracao) {
      case "Suspender":
      case "Pagar":
        await this.clicarBotao('button',"Pendentes");
        await this.telaAtual?.getByRole("row", { name: "Fatura Credor Descrição" }).getByRole("checkbox").click();
        await this.clicarBotao("button", /Alterar em massa \((\d+)\)/gim)
        break;
      case "Remover suspensão":
        await this.clicarBotao('button', "Suspensas");
        await this.telaAtual?.getByRole("row", { name: "Fatura Credor Descrição" }).getByRole("checkbox").click();
        await this.clicarBotao("button", /Alterar em massa \((\d+)\)/gim)
        break;
      case "Estornar":
        await this.clicarBotao('button', "Pagas");
        await this.telaAtual?.getByRole("row", { name: "Fatura Credor Descrição" }).getByRole("checkbox").click();
        await this.clicarBotao("button", /Alterar em massa \((\d+)\)/gim)
        break;
      default:
        throw new Error("Tipo de alteração inválido");
    }

    switch (tipoAlteracao) {
      case "Suspender":
        await this.telaAtual?.getByRole("button", { name: "Suspender" }).nth(1).click();
        await this.clicarBotao('combobox')
        await this.telaAtual?.getByLabel("Dificuldades financeiras").click();
        await this.telaAtual?.getByPlaceholder("Clique para preencher").pressSequentially(descricao);
        await this.clicarBotao('button', 'Confirmar')
        break;
      case "Remover suspensão":
        await this.telaAtual?.getByRole("button", { name: "Remover suspensão" }).nth(1).click();
        await this.clicarBotao('button', 'Confirmar')
        break;
      case "Estornar":
        await this.telaAtual?.getByRole("button", { name: "Estornar" }).nth(1).click();
        await this.clicarBotao('combobox')
        await this.telaAtual?.getByLabel("Conta banco").click();
        await this.telaAtual?.locator("button").filter({ hasText: /^Selecionar$/ }).click();
        await this.telaAtual?.getByLabel("CARNE PROPRIO").click();
        await this.telaAtual?.getByPlaceholder("Clique para preencher").click();
        await this.telaAtual?.getByPlaceholder("Clique para preencher").pressSequentially(descricao);
        await this.clicarBotao('button', 'Confirmar')
        break;
      case "Pagar":
        await this.telaAtual?.getByRole("button", { name: "Pagar" }).nth(1).click();
        await this.telaAtual?.locator('input[name="documento"]').click();
        await this.telaAtual?.locator('input[name="documento"]').pressSequentially(faker.number.int().toString());
        await this.clicarBotao('combobox')
        await this.telaAtual?.getByLabel("Conta banco").click();
        await this.telaAtual?.locator("button").filter({ hasText: /^Selecionar$/ }).click();
        await this.telaAtual?.getByLabel("CARNE PROPRIO").click();
        await this.telaAtual?.locator('input[name="descricao"]').click();
        await this.telaAtual?.locator('input[name="descricao"]').pressSequentially(descricao);
        await this.clicarBotao('button', 'Confirmar')
        break;
      default:
        throw new Error("Tipo de alteração inválido");
    }
  }

  @step('Criar despesa fixa')
  async criarDespesaFixa(credorFatura: string, opcaoFatura: string, planodeContas: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao("button", 'Despesas Fixas')
    await this.clicarBotao("button", /(Nova|Criar|Próximo|Adicionar)/gim)
    await this.clicarBotao("button", /(Nova|Criar|Próximo|Adicionar)/gim)
    await this.clicarBotao("combobox")
    await this.telaAtual?.getByLabel(credorFatura).click();
    await this.telaAtual?.locator('input[name="description"]').click();
    await this.telaAtual?.locator('input[name="description"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.locator('input[name="dueDate"]').pressSequentially(faker.date.future().toLocaleDateString());
    await this.telaAtual?.locator('input[name="value"]')?.click();
    await this.telaAtual?.locator('input[name="value"]').pressSequentially(faker.number.int({ min: 100, max: 1000 }).toString());
    await this.selecionarOpcaoFatura(opcaoFatura);
    await this.irProximaEtapa(opcaoFatura, planodeContas);
    await this.clicarBotao("button", /(Nova|Criar|Próximo|Adicionar)/gim)
    await this.clicarBotao("button", /(Nova|Criar|Próximo|Adicionar)/gim)
  }

  @step('Criar parcelamento')
  async criarParcelamentos(quantidadeParcelas: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao("button", "Parcelamentos");
    await this.clicarBotao("button", "Novo parcelamento");
    await this.selecionarOpcaoNoCombobox("#");
    await this.preencherCampo("descricao", faker.lorem.words({ min: 3, max: 10 }));
    await this.preencherCampo("valor", faker.number.int({ min: 100, max: 500 }).toString());
    await this.preencherCampo("qtdParcelas", quantidadeParcelas);
    await this.preencherCampo("intervalo", "10");
    await this.preencherCampoPlaceholder("Clique para escrever", faker.lorem.words({ min: 3, max: 10 }));
    await this.clicarBotao("button", "Próximo");
    await this.selecionarOpcaoBotao("Clique para selecionar", "celular novo");
    await this.clicarBotao("button", "Próximo");
    await this.clicarTexto("Gerar contas");
    await this.clicarTexto("Confirmar");
    await this.clicarBotao("button", "Adicionar parcelamento");
  }

  @step('Validar somatorio das faturas vencidas')
  async validarSomatorioFaturasVencidas() {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao("button", "Vencidas");
    await this.telaAtual?.getByRole("cell", { name: "Valor" }).click();
    await this.clicarBotao("button", "Somar");
  }

  @step('Liquidar fatura a receber')
  async liquidarFaturaAReceber(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.clicarBotao('button', 'Pendentes');
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('button').nth(3).click();
    await this.telaAtual?.getByRole('button', { name: 'Liquidar' }).first().click();
    await this.clicarBotao('combobox');
    await this.telaAtual?.getByLabel('Outros (sem integração)').click();
    await this.telaAtual?.locator('input[name="justificativa"]').click();
    await this.telaAtual?.locator('input[name="justificativa"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).first().click();
  }

  @step('Estornar fatura a receber')
  async estornarFaturaAReceber() {
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Pagas' }).click();
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('button').nth(3).click();
    await this.telaAtual?.getByRole('button', { name: 'Estornar' }).first().click();
    await this.clicarBotao('combobox');
    await this.telaAtual?.getByLabel('Conta banco').click();
    await this.telaAtual?.locator('button').filter({ hasText: 'Clique para selecionar' }).click();
    await this.telaAtual?.getByLabel('BB - boleto').click();
    await this.telaAtual?.locator('input[name="justificativa"]').click();
    await this.telaAtual?.locator('input[name="justificativa"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();

  }

  @step('Suspender a fatura a receber')
  async suspenderFaturaAReceber(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.clicarBotao('button', 'Pendentes');
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('button').nth(3).click();
    await this.telaAtual?.getByRole('button', { name: 'Suspender' }).first().click();
    await this.clicarBotao('combobox');
    await this.telaAtual?.getByLabel('Concorrência').first().click();
    await this.telaAtual?.locator('input[name="descricao"]').click();
    await this.telaAtual?.locator('input[name="descricao"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();
  }

  @step('Remover suspensão da fatura a receber')
  async removerSuspensaoFaturaAReceber(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Suspensas' }).click();
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('button').nth(2).click();
    await this.telaAtual?.getByRole('button', { name: 'Remover Suspensão' }).first().click();
    await this.telaAtual?.locator('textarea[name="descricao"]').click();
    await this.telaAtual?.locator('textarea[name="descricao"]').pressSequentially(faker.lorem.sentences())
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();

  }

  @step('Baixar boleto da fatura a receber')
  async baixarBoletoFaturaAReceber(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.telaAtual?.getByRole('button', { name: 'Baixar' }).nth(1).click();
    await this.clicarBotao('button', 'PDF Baixar PDF');
    await this.telaAtual?.getByLabel('Situação').uncheck();
    await this.clicarBotao('button', 'Aplicar');
  }

  @step('Imprimir o boleto da fatura a receber')
  async imprimirBoletoFaturaAReceber() {
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.locator('.flex-1 > div:nth-child(3) > div > button:nth-child(2)').first().click();
    await this.telaAtual?.getByLabel('Situação').uncheck();
    await this.telaAtual?.getByRole('button', { name: 'Aplicar' }).click();
  }

  @step('Gerar pix da fatura a receber')
  async gerarCobrancaPixFaturaAReceber() {

    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.clicarBotao('button', 'Pendentes');
    await this.telaAtual?.getByText('Fatura', { exact: true }).click();
    await this.telaAtual?.getByText('Fatura', { exact: true }).click();
    await this.telaAtual?.waitForTimeout(3 * 1000)
    const dataTable = await this.telaAtual?.getByRole('table').filter({has: this.telaAtual?.locator('tr')}).first().innerText();
    const faturaIds = dataTable?.match(/(\d{6})/gmi);

    faturaIds?.pop();

    console.log("faturas id: ", faturaIds);

    for (let i = 0; i < faturaIds!.length; i++) {
      await this.telaAtual?.getByRole('row', { name: faturaIds![i] }).getByRole('button').nth(3).click();
      await this.telaAtual?.getByRole('button', { name: 'Cobrança por Pix' }).first().click();
      await this.telaAtual?.waitForTimeout(2 * 1000)
      const texto = await this.telaAtual?.getByText('Pague escaneando o QR Code').isVisible();

      switch (texto) {
        case true:
          await this.telaAtual?.getByRole('button').nth(2).click();
          continue;
        case false:
          await this.clicarBotao('button', 'Confirmar');
          await this.clicarBotao('button', 'Confirmar');
          return;
        default:
          continue;
      }
    } 
  }

  @step('Enviar boleto e nota por e-mail')
  async enviarBoletoNotaEmail() {
    if(!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('button').nth(3).click();
    await this.telaAtual?.getByRole('button', { name: 'Enviar e-mail' }).click();
    await this.telaAtual?.locator('input[name="emailDst"]').click();
    await this.telaAtual?.locator('input[name="emailDst"]').press('ControlOrMeta+a');
    await this.telaAtual?.locator('input[name="emailDst"]').pressSequentially('marco.kist@mksolutions.com.br');
    await this.telaAtual?.locator('input[name="titulo"]').click();
    await this.telaAtual?.locator('input[name="titulo"]').pressSequentially(faker.lorem.sentence());
    await this.telaAtual?.locator('.ql-editor').click();
    await this.telaAtual?.locator('.ql-editor').pressSequentially(faker.lorem.sentences(5));
    await this.telaAtual?.locator('div').filter({ hasText: /^Salvar como modelo de e-mail$/ }).locator('div').getByRole('button').click();
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('checkbox').first().click();
    await this.telaAtual?.getByRole('button', { name: 'Documentos Fiscais' }).click();
    await this.telaAtual?.waitForTimeout(2 * 1000)
    const texto = await this.telaAtual?.getByText('Nenhum registro encontrado').isVisible();
    if (texto) {
      await this.telaAtual?.getByRole('button', { name: 'Anexar' }).click();
      await this.telaAtual?.getByRole('button', { name: 'Enviar' }).click();
    } else {
      await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('checkbox').first().click();
      await this.telaAtual?.getByRole('button', { name: 'Anexar' }).click();
      await this.telaAtual?.getByRole('button', { name: 'Enviar' }).click();
    }
  }

  @step('Inscrever no SPC')
  async inscreverSPC() {
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.page.waitForTimeout(2 * 1000);
    await this.telaAtual?.getByRole('button', { name: 'Vencidas' }).click();
    await this.page.waitForTimeout(2 * 1000);
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).nth(3).getByRole('button').nth(3).click();
    await this.telaAtual?.getByRole('button', { name: 'Adicionar ao SPC' }).first().click();
    await this.telaAtual?.getByPlaceholder('Clique para preencher...').click();
    await this.telaAtual?.getByPlaceholder('Clique para preencher...').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();
  
  }

  @step('Alterar informações da fatura a receber')
  async alterarDetalhesFatura() {
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('button').nth(3).click();
    await this.telaAtual?.getByRole('button', { name: 'Alterar', exact: true }).click();
    await this.telaAtual?.locator('input[name="novaDescricao"]').click();
    await this.telaAtual?.locator('input[name="novaDescricao"]').pressSequentially('teste');
    await this.telaAtual?.locator('input[name="justificativa"]').click();
    await this.telaAtual?.locator('input[name="justificativa"]').pressSequentially('teste');
    await this.telaAtual?.getByRole('button', { name: 'Salvar' }).click();
  }

  @step('Imprimir fatura a receber')
  async imprimirFatura() {
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Pagas' }).click();
    await this.telaAtual?.getByRole('row', { name: (/(\d{6})/gmi)  }).getByRole('button').nth(3).click();
    await this.telaAtual?.getByRole('button', { name: 'Imprimir fatura' }).click();
  }

  @step('Imprimir recibo da fatura a receber')
  async imprimirRecibo() {
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Pagas' }).click();
    await this.telaAtual?.getByRole('row', { name: (/(\d{6})/gmi) }).getByRole('button').nth(3).click();
    await this.telaAtual?.getByRole('button', { name: 'Imprimir recibo' }).click();
  }

  @step('Adicionar cobrança no cartão de crédito')
  async cobrancaCartao(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.page.waitForTimeout(2 * 1000);
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.page.waitForTimeout(2 * 1000);
    await this.telaAtual?.getByRole('row', { name: (/(\d{6})/gmi) }).getByRole('button').nth(3).click();
    await this.telaAtual?.getByRole('button', { name: 'Cobrança via cartão' }).click();
    await this.telaAtual?.locator('button').filter({ hasText: 'Clique para selecionar' }).click();
    await this.telaAtual?.getByRole('group').click();
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.telaAtual?.getByRole('cell', { name: 'Fatura', exact: true }).locator('div').first().click();
    await this.telaAtual?.getByRole('cell', { name: 'Fatura', exact: true }).locator('div').first().click();
    await this.telaAtual?.getByRole('row', { name: (/(\d{6})/gmi) }).getByRole('button').nth(3).click();
    await this.telaAtual?.getByRole('button', { name: 'Cobrança via cartão' }).click();
    await this.telaAtual?.locator('button').filter({ hasText: 'Clique para selecionar' }).click();
    await this.telaAtual?.getByLabel('TESTE RECORRENTE1').click();
    await this.telaAtual?.locator('button').filter({ hasText: 'Clique para selecionar' }).click();
    await this.telaAtual?.getByLabel('Débito automático: Não Master').click();
    await this.telaAtual?.getByRole('button', { name: 'Salvar' }).click();
  }

  @step('Baixar fatura a receber')
  async baixarFaturaAReceber(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.locator('div').filter({ hasText: /\b.*\bresultados\b.*[.!?]?/gmi }).first().getByRole('button').nth(1).click();
    await this.telaAtual?.locator('div').filter({ hasText: /^Pesquisar em:Clique para selecionar$/ }).getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Remessa Transmitida').click();
    await this.telaAtual?.getByPlaceholder('Clique para buscar').click();
    await this.telaAtual?.getByPlaceholder('Clique para buscar').pressSequentially('Sim');
    await this.telaAtual?.getByTestId('AddCircleOutlineOutlinedIcon').click();
    await this.telaAtual?.getByRole('button', { name: 'Aplicar' }).click();
    await this.page.waitForTimeout(2 * 1000);
    await this.telaAtual?.getByRole('row', { name: (/(\d{6})/gmi) }).getByRole('button').nth(3).click();
    await this.telaAtual?.getByRole('button', { name: 'Baixar fatura' }).click();
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();
  }

  @step('Liquidar fatura a receber em massa')
  async liquidarFaturasEmMassa(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.page.waitForTimeout(2000);
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.page.waitForTimeout(2000);
    await this.telaAtual?.getByRole('row', { name: 'Fatura Cliente Vencimento' }).getByRole('checkbox').check();
    await this.telaAtual?.getByText('Alterar em massa (50)').click();
    await this.telaAtual?.getByRole('button', { name: 'Liquidar' }).click();
    await this.telaAtual?.getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Outros (sem integração)').click();
    await this.telaAtual?.locator('input[name="dtEfetivacao"]').pressSequentially(faker.date.future().toLocaleDateString());
    await this.telaAtual?.locator('input[name="vrLiquidacao"]').pressSequentially('R$ 10.000,000');
    await this.telaAtual?.locator('input[name="vrLiquidacao"]').click();
    await this.telaAtual?.locator('input[name="justificativa"]').click();
    await this.telaAtual?.locator('input[name="justificativa"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();
  }

  @step('Estornar fatura a receber em massa')
  async estornarFaturasEmMassa(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Pagas' }).click();
    await this.telaAtual?.getByRole('row', { name: 'Fatura Cliente Vencimento' }).getByRole('checkbox').check();
    await this.telaAtual?.getByText('Alterar em massa (50)').click();
    await this.telaAtual?.getByRole('button', { name: 'Estornar' }).click();
    await this.telaAtual?.getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Conta banco').click();
    await this.telaAtual?.locator('button').filter({ hasText: 'Clique para selecionar' }).click();
    await this.telaAtual?.getByLabel('BB - boleto').click();
    await this.telaAtual?.getByRole('textbox', { name: 'Clique para preencher' }).click();
    await this.telaAtual?.getByRole('textbox', { name: 'Clique para preencher' }).pressSequentially(faker.lorem.sentences(4));
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();
  }

  @step('Suspender fatura a receber em massa')
  async suspenderFaturasEmMassa(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.telaAtual?.getByRole('row', { name: 'Fatura Cliente Vencimento' }).getByRole('checkbox').check();
    await this.telaAtual?.getByText('Alterar em massa (50)').click();
    await this.telaAtual?.getByRole('button', { name: 'Suspender' }).click();
    await this.telaAtual?.getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Concorrência').first().click();
    await this.telaAtual?.locator('input[name="descricao"]').click();
    await this.telaAtual?.locator('input[name="descricao"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();
  }

  @step('Remover suspensão fatura a receber em massa')
  async removerSuspensaoFaturasEmMassa(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Suspensas' }).click();
    await this.telaAtual?.getByRole('row', { name: 'Fatura Cliente Vencimento' }).getByRole('checkbox').check();
    await this.telaAtual?.getByText('Alterar em massa (50)').click();
    await this.telaAtual?.getByRole('button', { name: 'Remover suspensão' }).click();
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();
  
  }

  @step('Imprimir faturas a receber em massa')
  async imprimirFaturasEmMassa(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.page.waitForTimeout(5000);
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.telaAtual?.locator('div').filter({ hasText: /\b.*\bresultados\b.*[.!?]?/gmi }).first().getByRole('button').nth(1).click();

    await this.telaAtual?.locator('div').filter({ hasText: /^Pesquisar em:Clique para selecionar$/ }).getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Descrição').click();
    await this.telaAtual?.getByPlaceholder('Clique para buscar').click();
    await this.telaAtual?.getByPlaceholder('Clique para buscar').pressSequentially('Ref.: combo manu - 70.4');
    await this.telaAtual?.getByTestId('AddCircleOutlineOutlinedIcon').locator('path').click();
    await this.telaAtual?.getByRole('button', { name: 'Aplicar' }).click();
    await this.telaAtual?.getByRole('row', { name: 'Fatura Cliente Vencimento' }).getByRole('checkbox').check();
    await this.telaAtual?.getByText('Alterar em massa (6)').click();
    await this.telaAtual?.getByRole('button', { name: 'Imprimir faturas' }).click();
  
  }

  @step('Cobrar via cartão as faturas a receber em massa')
  async cobrancaCartaoEmMassa(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).first().click();
    await this.page.waitForTimeout(4000);
    await this.telaAtual?.locator('div').filter({ hasText: /\b.*\bresultados\b.*[.!?]?/gmi }).first().getByRole('button').nth(1).click();
    await this.telaAtual?.locator('button').filter({ hasText: 'Todas as colunas' }).click();
    await this.telaAtual?.getByLabel('Cliente').click();
    await this.telaAtual?.getByPlaceholder('Clique para buscar').click();
    await this.telaAtual?.getByPlaceholder('Clique para buscar').pressSequentially('Gabriel Estigarribia');
    await this.telaAtual?.getByTestId('AddCircleOutlineOutlinedIcon').click();
    await this.telaAtual?.getByRole('button', { name: 'Aplicar' }).click();
    await this.page.waitForTimeout(2000);
    await this.telaAtual?.getByText('Alterar em massa').click();
    await this.telaAtual?.getByRole('button', { name: 'Cobrança via cartão' }).first().click();
    await this.telaAtual?.getByRole('combobox').first().click();
    await this.telaAtual?.getByLabel('TESTE RECORRENTE1').click();
    await this.telaAtual?.locator('button').filter({ hasText: 'Clique para selecionar' }).click();
    await this.telaAtual?.getByLabel('Débito automático: Não Master').click();
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();
  }

  @step('Remover remessa em massa com sucesso')
  async removerRemessaEmMassa(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.telaAtual?.getByRole('row', { name: 'Fatura Cliente Vencimento' }).getByRole('checkbox').check();
    await this.telaAtual?.getByText('Alterar em massa (50)').click();
    await this.telaAtual?.getByRole('button', { name: 'Remover remessa' }).click();
    await this.telaAtual?.getByPlaceholder('Clique para preencher').click();
    await this.telaAtual?.getByPlaceholder('Clique para preencher').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();
  }

  @step('Nova conta não faturada')
  async novaContaNaoFaturada(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('load');
    await this.telaAtual?.getByRole('button', { name: 'Contas não faturadas' }).first().click();
    await this.telaAtual?.getByText('Nova conta').click();
    await this.telaAtual?.getByRole('combobox').first().click();
    await this.telaAtual?.getByPlaceholder('Pesquisar').pressSequentially('#');
    await this.telaAtual?.getByLabel('1234567890 Çç!@#$%¨&*()_').click();
    await this.telaAtual?.locator('input[name="descricao"]').click();
    await this.telaAtual?.locator('input[name="descricao"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.locator('input[name="valor"]').click();
    await this.telaAtual?.locator('input[name="valor"]').pressSequentially(faker.finance.amount({ min: 100, max: 1000, symbol: '', autoFormat: true }));
    await this.telaAtual?.locator('input[name="dataVencimento"]').pressSequentially(faker.date.future().toLocaleDateString());
    await this.telaAtual?.locator('input[name="parcela"]').click();
    await this.telaAtual?.locator('input[name="parcela"]').pressSequentially(faker.number.int({ min: 1, max: 10 }).toString());
    await this.telaAtual?.getByRole('combobox').nth(1).click();
    await this.telaAtual?.getByLabel('01.00.00.00 Mensalidade').click();
    await this.telaAtual?.getByRole('button', { name: 'Próximo' }).click();
    await this.telaAtual?.locator('div').filter({ hasText: /^Replicar contas$/ }).getByRole('switch').click();
    await this.telaAtual?.locator('input[name="numReplicacoes"]').click();
    await this.telaAtual?.locator('input[name="numReplicacoes"]').pressSequentially(faker.number.int({ min: 1, max: 10 }).toString());
    await this.telaAtual?.locator('input[name="diasIntervalo"]').click();
    await this.telaAtual?.locator('input[name="diasIntervalo"]').pressSequentially(faker.number.int({ min: 1, max: 10 }).toString());
    await this.telaAtual?.locator('div').filter({ hasText: /^Faturar$/ }).getByRole('switch').click();
    await this.telaAtual?.getByRole('combobox').click();
    await this.telaAtual?.getByLabel('ABC').click();
    await this.telaAtual?.getByRole('button', { name: 'Salvar' }).click();
  }

  @step('Filtrar contas não faturadas por status')
  async filtrarContasNaoFaturadasPorStatus(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).first().click();
  }

  @step('Editar conta não faturada')
  async editarContaNaoFaturada(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.telaAtual?.getByRole('button', { name: 'Contas não faturadas' }).click();
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('button').nth(1).click();
    await this.telaAtual?.getByRole('button', { name: 'Editar' }).first().click();
    await this.telaAtual?.locator('input[name="valor"]').click();
    await this.telaAtual?.locator('input[name="valor"]').press('ControlOrMeta+a');
    await this.telaAtual?.locator('input[name="valor"]').pressSequentially(faker.finance.amount({ min: 100, max: 1000, symbol: '', autoFormat: true }));
    await this.telaAtual?.locator('input[name="descricao"]').click();
    await this.telaAtual?.locator('input[name="descricao"]').press('ControlOrMeta+a');
    await this.telaAtual?.locator('input[name="descricao"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.locator('button').filter({ hasText: 'Mensalidade' }).click();
    await this.telaAtual?.getByLabel('01.00.00.00 Mensalidade').click();
    await this.telaAtual?.locator('button').filter({ hasText: 'Clique para selecionar' }).click();
    await this.telaAtual?.getByLabel('composição errada').click();
    await this.telaAtual?.getByRole('button', { name: 'Salvar' }).click();
  
  }

  @step('Faturar conta a receber não faturada')
  async faturarContaAReceberNaoFaturada(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.telaAtual?.getByRole('button', { name: 'Contas não faturadas' }).first().click();
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.telaAtual?.getByRole('cell', { name: 'Cliente', exact: true }).locator('div').click();
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('button').nth(1).click();
    await this.telaAtual?.getByRole('button', { name: 'Faturar' }).click();
    await this.telaAtual?.locator('div').filter({ hasText: /^MétodoClique para selecionarUma fatura por contaTodas as contas em uma fatura$/ }).getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Uma fatura por conta').click();
    await this.telaAtual?.locator('button').filter({ hasText: 'Clique para selecionar' }).click();
    await this.telaAtual?.getByLabel('BB correto').click();
    await this.telaAtual?.getByRole('button', { name: 'Salvar' }).click();
  }
  
  @step('Suspender e remover suspensão conta a receber não faturada')
  async suspenderRemoversuspensaoFaturaAReceber(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Contas não faturadas' }).first().click();
    await this.page.waitForTimeout(3000);
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('button').nth(1).click();
    await this.telaAtual?.getByRole('button', { name: 'Suspender' }).click();
    await this.telaAtual?.getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Concorrência').first().click();
    await this.telaAtual?.locator('div').filter({ hasText: /^Descrição$/ }).nth(2).click();
    await this.telaAtual?.locator('input[name="descricao"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();
    await this.page.waitForTimeout(2000);
    await this.telaAtual?.getByRole('button', { name: 'Suspensas' }).click();
    await this.page.waitForTimeout(2000);
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('button').nth(1).click();
    await this.telaAtual?.getByRole('button', { name: 'Remover suspensão' }).click();
    await this.telaAtual?.locator('input[name="descricao"]').click();
    await this.telaAtual?.locator('input[name="descricao"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Salvar' }).click();
  }

  @step('Remover conta não faturada')
  async removerContaNaoFaturada(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.telaAtual?.getByRole('button', { name: 'Contas não faturadas' }).first().click();
    await this.page.waitForTimeout(2000)
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.page.waitForTimeout(2000)
    await this.telaAtual?.getByRole('row', { name: /(\d{6})/gmi }).getByRole('button').nth(1).click();
    await this.telaAtual?.getByRole('button', { name: 'Remover' }).click();
    await this.telaAtual?.locator('input[name="obersacao"]').click();
    await this.telaAtual?.locator('input[name="obersacao"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Salvar' }).click();  
  }
  
  @step('Suspender contas não faturadas em massa')
  async suspenderContasNaoFaturadasEmMassa(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.telaAtual?.getByRole('button', { name: 'Contas não faturadas' }).first().click();
    await this.telaAtual?.waitForTimeout(2000);
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.telaAtual?.waitForTimeout(2000);
    await this.telaAtual?.getByRole('cell', { name: 'Código' }).getByRole('checkbox').check();
    await this.telaAtual?.getByText('Alterar em massa (50)').click();
    await this.telaAtual?.getByRole('button', { name: 'Suspender' }).click();
    await this.telaAtual?.getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Concorrência').first().click();
    await this.telaAtual?.getByPlaceholder('Clique para preencher').click();
    await this.telaAtual?.getByPlaceholder('Clique para preencher').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Salvar' }).click();  
  }

  @step('Remover suspensão de contas não faturadas em massa')
  async removerSuspensaoContasNaoFaturadasEmMassa(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.telaAtual?.getByRole('button', { name: 'Contas não faturadas' }).first().click();
    await this.telaAtual?.waitForTimeout(2000);
    await this.telaAtual?.getByRole('button', { name: 'Suspensas' }).click();
    await this.telaAtual?.waitForTimeout(2000);
    await this.telaAtual?.getByRole('cell', { name: 'Código' }).getByRole('checkbox').check();
    await this.telaAtual?.getByText('Alterar em massa (50)').click();
    await this.telaAtual?.getByRole('button', { name: 'Remover suspensão' }).click();
    await this.telaAtual?.getByPlaceholder('Clique para preencher').click();
    await this.telaAtual?.getByPlaceholder('Clique para preencher').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Salvar' }).click();
  }

  @step('Faturar contas não faturadas em massa')
  async faturarContaAReceberNaoFaturadaEmMassa(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.telaAtual?.getByRole('button', { name: 'Contas não faturadas' }).first().click();
    await this.telaAtual?.waitForTimeout(2000);
    await this.telaAtual?.getByRole('button', { name: 'Pendentes' }).click();
    await this.telaAtual?.waitForTimeout(2000);
    const dataTable = await this.telaAtual?.getByRole('table').filter({has: this.telaAtual?.locator('tr')}).first().innerText();
    const nomeData = dataTable?.match(/\b[A-ZÁ-Ú][a-zá-ú]+(?: [A-ZÁ-Ú][a-zá-ú]+)+\b/gmi)!.flatMap(item => item)
    const nome = [...new Set(nomeData)];
    await this.telaAtual?.locator('div').filter({ hasText: /^Mostrar50 resultados$/ }).getByRole('button').nth(1).click();
    await this.telaAtual?.locator('button').filter({ hasText: 'Todas as colunas' }).click();
    await this.telaAtual?.getByLabel('Cliente').click();
    await this.telaAtual?.getByPlaceholder('Clique para buscar').click();
    await this.telaAtual?.getByPlaceholder('Clique para buscar').pressSequentially(nome[8].toString());
    await this.telaAtual?.getByTestId('AddCircleOutlineOutlinedIcon').click();
    await this.telaAtual?.getByRole('button', { name: 'Aplicar' }).click();
    await this.page.waitForTimeout(2500);
    const dataTable2 = await this.telaAtual?.getByRole('table').filter({has: this.telaAtual?.locator('tr')}).first().innerText();
    const faturaIds = dataTable2?.match(/(\d{6})/gmi);
    const contas = [...new Set(faturaIds?.pop())];
    for (let i = 0; i < contas.length; i++) {
      await this.telaAtual?.getByRole('cell', { name: contas[i].toString() }).getByRole('checkbox').first().click();
    }
    await this.telaAtual?.getByText('Alterar em massa').first().click();
    await this.telaAtual?.getByRole('button', { name: 'Faturar' }).first().click();
    await this.telaAtual?.locator('div').filter({ hasText: /^MétodoClique para selecionarUma fatura por contaTodas as contas em uma fatura$/ }).getByRole('combobox').first().click();
    await this.telaAtual?.getByLabel('Uma fatura por conta').first().click();
    await this.telaAtual?.locator('button').filter({ hasText: 'Clique para selecionar' }).first().click();
    await this.telaAtual?.getByLabel('BB correto').first().click();
    await this.telaAtual?.getByRole('button', { name: 'Salvar' }).first().click();
  }
  
  @step('Filtrar contas não faturadas por filtros laterais')
  async filtrarContasNaoFaturadasPorFiltrosLaterais(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.telaAtual?.getByRole('button', { name: 'Contas não faturadas' }).first().click();
    await this.telaAtual?.locator('div').filter({ hasText: /^Mostrar50 resultados$/ }).getByRole('button').nth(1).click();
    await this.telaAtual?.locator('button').filter({ hasText: 'Todas as colunas' }).click();
    await this.telaAtual?.getByLabel('Cliente').click();
    await this.telaAtual?.getByPlaceholder('Clique para buscar').click();
    await this.telaAtual?.getByPlaceholder('Clique para buscar').pressSequentially('#');
    await this.telaAtual?.getByRole('button', { name: 'Aplicar' }).click();
    await this.telaAtual?.locator('td:nth-child(2) > .flex').first().click();
  }
  
  @step('Gerar mensal DRE')
  async gerarMensalDRE(){
    if (!this.telaAtual) await this.navegarParaDRETela();
    await this.telaAtual?.getByRole('banner').getByText('DRE Gerencial').waitFor({ state: 'visible' });
    await this.telaAtual?.locator('div').filter({ hasText: /^Tipos de relatórioClique para selecionar$/ }).getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Mensal').click();
    await this.telaAtual?.locator('div').filter({ hasText: /^Ano do exercícioClique para selecionar$/ }).getByRole('combobox').click();
    await this.telaAtual?.getByLabel('2024').click();
    await this.telaAtual?.getByRole('button', { name: 'Clique para selecionar' }).click();
    await this.telaAtual?.getByLabel('Todos').click();
    await this.telaAtual?.getByRole('button', { name: 'Gerar relatório' }).click();
    expect(this.telaAtual?.locator('[id="\\34 "]').getByRole('alert')).toBeTruthy();  
  }

  @step('Imprimir conta não faturada')
  async imprimirContaNaoFaturada(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.telaAtual?.getByRole('button', { name: 'Contas não faturadas' }).first().click();
    await this.page.waitForTimeout(2000);
    await this.telaAtual?.getByRole('cell', { name: /(\d{6})/gmi }).getByRole('checkbox').first().check();
    await this.telaAtual?.locator('.flex-1 > div:nth-child(3) > div > button:nth-child(2)').click();
    await this.telaAtual?.getByLabel('Empresa').uncheck();
    await this.telaAtual?.getByLabel('Vínculo').uncheck();
    await this.telaAtual?.getByLabel('Categoria').uncheck();
    await this.telaAtual?.getByLabel('Situação').uncheck();
    await this.telaAtual?.getByLabel('Descrição').uncheck();
    await this.telaAtual?.getByRole('button', { name: 'Aplicar' }).click();
  }

  @step('Fazer download de uma conta não faturada')
  async fazerDownloadContaNaoFaturada(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.waitForLoadState('domcontentloaded');
    await this.telaAtual?.getByRole('button', { name: 'Contas não faturadas' }).first().click();
    await this.page.waitForTimeout(2000);
    await this.telaAtual?.getByRole('cell', { name: /(\d{6})/gmi }).first().getByRole('checkbox').check();
    await this.telaAtual?.getByRole('button', { name: 'Baixar' }).nth(1).click();
    await this.telaAtual?.getByRole('button', { name: 'PDF Baixar PDF' }).click();
    await this.telaAtual?.getByLabel('Empresa').uncheck();
    await this.telaAtual?.getByLabel('Situação').uncheck();
    await this.telaAtual?.getByLabel('Categoria').uncheck();
    await this.telaAtual?.getByLabel('Vínculo').uncheck();
    await this.telaAtual?.getByLabel('Descrição').uncheck();
    await this.telaAtual?.getByRole('button', { name: 'Aplicar' }).click();
  }

  @step('Gerar anual DRE')
  async gerarAnualDRE(){
    if (!this.telaAtual) await this.navegarParaDRETela();
    await this.telaAtual?.getByRole('banner').getByText('DRE Gerencial').waitFor({ state: 'visible' });
    await this.telaAtual?.locator('div').filter({ hasText: /^Tipos de relatórioClique para selecionar$/ }).getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Anual').click();
    await this.telaAtual?.getByRole('button', { name: 'Gerar relatório' }).click();
    expect(this.telaAtual?.locator('[id="\\34 "]').getByRole('alert')).toBeTruthy();  
  }

  @step('Baixar DRE')
  async baixarDRE(){
    if (!this.telaAtual) await this.navegarParaDRETela();
    await this.telaAtual?.getByRole('button', { name: 'Baixar' }).click();
    await this.telaAtual?.getByRole('button', { name: 'PDF Baixar PDF' }).click();
  }
  
  @step('Imprimir DRE')
  async imprimirDRE(){
    if (!this.telaAtual) await this.navegarParaDRETela();
    await this.telaAtual?.locator('xpath=//body/div/div/div/div/button[1]').first().click();
  }

  @step('Navegar para a próxima página de resultados')
  async navegarPaginaResultados(pagina: string, tipoTela: Frame | null) {
    if (!this.telaAtual) tipoTela;
    if (pagina === "ultima") {
      if (await this.telaAtual?.locator('//button[normalize-space()="7"]').first().isVisible()) { await this.telaAtual?.locator('//button[normalize-space()="7"]').first().click() } 
      else {
        console.log('deu ruim e eu nao faco a menor ideia do pq')
      }
    } else {
      await this.telaAtual?.getByRole("button", { name: pagina, exact: true }).click();
    }
  }

  @step('Preencher campo placeholder')
  async preencherCampoPlaceholder(placeholder: string, valor: string) {
    await this.telaAtual?.getByPlaceholder(placeholder).click();
    await this.telaAtual?.getByPlaceholder(placeholder).pressSequentially(valor);
  }
  
  @step('Preencher campo')
  async selecionarOpcaoBotao(botaoTexto: string, opcaoTexto: string) {
    await this.telaAtual?.locator("button").filter({ hasText: botaoTexto }).first().click();
    await this.telaAtual?.getByLabel(opcaoTexto).click();
  }

  @step('Selecionar opção de fatura')
  async selecionarOpcaoFatura(opcoesFatura: string): Promise<boolean> {
    const options = { "Simples": "Simples", "Rateio": "C/rateio"};
    const optionText = options[opcoesFatura];
    if (!optionText) throw new Error("Opção de fatura inválida");
    await this.telaAtual?.getByText(optionText).click();
    return opcoesFatura === "Rateio";
  }
  
  @step('Ir para a próxima etapa')
  async irProximaEtapa(opcaoFatura: string, planoDeContas: string) {
    await this.clicarBotaoComNome("Próximo");
    if (opcaoFatura === "Simples") {
      await this.preencherDetalhesContaSemRateio();
      await this.finalizarContaSemRateio();
    } else if (opcaoFatura === "Rateio") {
      await this.preencherDetalhesContaComRateio(planoDeContas);
      await this.finalizarContaComRateio();
    } else {
      throw new Error("Opção de fatura inválida");
    }
  }

  @step('Finalizar conta com rateio')
  async finalizarContaComRateio() {
    await this.telaAtual?.getByRole("button", { name: /(Nova|Criar|Próximo|Adicionar)/gim }).first().click();
    await this.telaAtual?.getByRole("button", { name: /(Nova|Criar|Próximo|Adicionar)/gim }).first().click();
  }

  @step('Preencher detalhes da conta com rateio')
  async preencherDetalhesContaComRateio(planoDeContas: string) {
    if (this.telaAtual?.getByRole("cell", { name: "Nenhum registro" })) {
      await this.clicarBotaoComNome("Novo rateio");
      await this.telaAtual?.locator("form > div > div > .flex").first().click();
      await this.telaAtual?.getByLabel(planoDeContas).click();
      await this.clicarBotaoComNome("Adicionar");
      await this.telaAtual?.getByRole("cell", { name: planoDeContas }).waitFor({ state: "attached" });
    }
  }
  
  @step('Preencher detalhes da conta sem rateio')
  async preencherDetalhesContaSemRateio() {
    await this.telaAtual?.getByRole("combobox").first().click();
    await this.telaAtual?.getByRole("option").first().click();
    await this.clicarBotaoComNome("Próximo");
  }

  @step('Selecionar filtro de fatura')
  async selecionarFiltroFatura() {
    await this.telaAtual?.locator("button").filter({ hasText: "Todas as colunas" }).click();
    await this.telaAtual?.getByLabel("Fatura").click();
  }
  
  @step('Preencher campo de busca')
  async preencherCampoBusca(idFatura: string) {
    await this.telaAtual?.getByPlaceholder("Clique para buscar").click();
    await this.telaAtual?.getByPlaceholder("Clique para buscar").pressSequentially(idFatura);
  }

  @step('Realizar liquidação parcial')
  async realizarLiquidacaoParcial(valor: string) {
    await this.telaAtual?.getByRole("switch").first().click();
    await this.telaAtual?.locator('input[name="valorLiquidacao"]').click();
    await this.telaAtual?.locator('input[name="valorLiquidacao"]').press("Control+A");
    await this.telaAtual?.locator('input[name="valorLiquidacao"]').press("Backspace");
    await this.telaAtual?.locator('input[name="valorLiquidacao"]').pressSequentially(valor);
  }
  
  @step('Selecionar conta banco')
  async selecionarContaBanco() {
    await this.clicarBotao('combobox')
    await this.telaAtual?.getByLabel("Conta banco").getByText("Conta banco").click();
    await this.telaAtual?.locator("button").filter({ hasText: /^Selecionar$/ }).click();
    await this.telaAtual?.getByLabel("BB - boleto").first().click();
  }
  
  @step('Preencher motivo de liquidação')
  async preencherMotivoLiquidacao() {
    await this.telaAtual?.locator('input[name="motivoLiquidacao"]').click();
    await this.telaAtual?.locator('input[name="motivoLiquidacao"]').pressSequentially(faker.lorem.sentences());
  }

  @step('Selecionar opção no combobox')
  async selecionarOpcaoNoCombobox(optionText: string) {
    await this.clicarBotao('combobox')
    await this.telaAtual?.getByPlaceholder("Pesquisar").pressSequentially(optionText);
    await this.telaAtual?.getByRole("option").first().click();
  }
  
  @step('Alterar quantidade de resultados')
  async alterarQuantidadeResultados(quantidade: string | number, pagina: string | RegExp) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao('button', pagina)
    await this.clicarBotao('combobox')
    await this.telaAtual?.getByLabel(`${quantidade} resultados`).click();
  }
  
  @step('Anexar arquivos')
  async anexarArquivos(){await this.telaAtual?.locator('input[type="file"]').first().setInputFiles([path.join(`${folderImagens}/cami.jpeg`), path.join(`${folderImagens}/carol.png`), path.join(`${folderImagens}/manu.jpg`),path.join(`${folderImagens}/will.jpg`),]);}

  @step('Clicar no botão com texto')
  async clicarTexto(texto: string) { await this.telaAtual?.getByText(texto).click() }

  @step('Preencher campo')
  async preencherCampo(name: string, value: string) { await this.telaAtual?.locator(`input[name="${name}"]`).first().pressSequentially(value); }
    
  @step('Confirmar liquidação')
  async confirmarLiquidacao() { await this.telaAtual?.getByRole("button", { name: "Confirmar" }).first().click(); }

  @step('Clicar no botão com texto')
  async clicarBotaoComTexto(text: string) { await this.telaAtual?.locator("button", { hasText: new RegExp(text, "gim") }).first().click(); }
  
  @step('Clicar no botão com nome')
  async clicarBotaoComNome(name: string | RegExp) { await this.telaAtual?.getByRole("button", { name: name }).first().click() }
    
  @step('Aplicar filtro')
  async aplicarFiltro() { await this.telaAtual?.getByRole("button", { name: "Aplicar" }).click(); }
  
  @step('Selecionar fatura')
  async selecionarFatura(idFatura: string) { await this.telaAtual?.getByRole("row", { name: idFatura }).getByRole("button").nth(2).click(); }
  
  @step('Clicar no botão de liquidar')
  async clicarBotaoLiquidar() { await this.telaAtual?.getByRole("button", { name: "Pagar" }).nth(1).click(); }
    
  @step('Clicar no botão de filtro')
  async clicarBotaoFiltro() { await this.telaAtual?.locator(".w-\\[32px\\]").first().click() }

  @step('Finalizar conta sem rateio')
  async finalizarContaSemRateio() { await this.telaAtual?.getByRole("button", { name: /(Nova|Criar|Próximo|Adicionar)/gim }).first().click() }

  @step('Alterar informações da fatura')
  async clicarBotao(funcao: any, nome?: string | RegExp) { await this.telaAtual?.getByRole(funcao, { name: nome }).first().click() }
  
}