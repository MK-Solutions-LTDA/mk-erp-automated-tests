import { Frame, Page } from "@playwright/test";
import step from "../../../utilitarios/decorators";
import { faker } from "@faker-js/faker/locale/pt_BR";
import BasePage from "../../BasePage";


export class GerenciadorContasPagar extends BasePage {
  
  constructor(page: Page) {super(page)}

  async navegarParaContasAPagarTela(): Promise<Frame | null> {
    const selectoresDeIframes = [
      'frame[name="mainsystem"]',
      'iframe[name="mainform"]',
      'iframe[componenteaba="Financeiro - PainelCloseAbaPrincipal"]',
      'iframe[name="mainform"]',
      'iframe[componenteaba="Gerenciador de Contas a PagarClosePainelAba"]',
      'iframe[name="mainform"]',
      'iframe[src="/mk/mkcore/BillsToPay/?sys=MK0"]'
    ];
    return this.navegarParaTela(selectoresDeIframes);
  }

  @step("Criar conta a pagar")
  async criarContaAPagar(credorFatura: string, descricaoFatura: string, dataVencimentoFatura: string, valorFatura: string, opcaoFatura: string, planoConta: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.preencherDetalhes(credorFatura, descricaoFatura, dataVencimentoFatura, valorFatura, opcaoFatura);
    await this.irProximaEtapa(opcaoFatura, planoConta);
  }

  @step("Estornar fatura")
   async estornarFatura(opcaoFatura: string, estornoParcial: boolean,idFatura?: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao("button", "Pagas");
    await this.telaAtual?.getByRole("row", { name: idFatura }).getByRole("button").nth(2).click();
    await this.telaAtual?.getByRole("button", { name: "Estornar" }).nth(1).click();
    switch (estornoParcial) {
      case true:
        await this.telaAtual?.waitForSelector("h2");
        await this.telaAtual?.getByRole("switch").click();
        await this.preencherDetalheEstorno(opcaoFatura);
        await this.telaAtual?.getByRole("cell", { name: "Registro de liquidação parcial" }).click();
        await this.clicarBotao("button", "Confirmar");
        break;
      case false:
        await this.telaAtual?.waitForSelector("h2");
        await this.preencherDetalheEstorno(opcaoFatura);
        await this.clicarBotao("button", "Confirmar");
        break;
      default:
        throw new Error("Método de estorno inválido");
    }
  }

  @step("Suspender fatura")
   async suspenderFatura(credor: string, motivoSuspensao: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao("button", "Pendentes");
    await this.telaAtual?.getByRole("row", { name: credor }).getByRole("button").nth(2).click();
    await this.telaAtual?.getByRole("button", { name: "Suspender" }).nth(1).click();
    await this.clicarBotao("combobox");
    await this.telaAtual?.getByLabel(motivoSuspensao).getByText(motivoSuspensao).click();
    await this.clicarBotao("button", "Confirmar");
  }

  @step("Alterar quantidade de resultados")
   async liquidarFatura(idFatura: string, valor: string,liquidacaoParcial: boolean) {
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

  @step("Preencher detalhe do estorno")
  async preencherDetalheEstorno(opcaoFatura: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao("combobox");
    await this.telaAtual?.getByLabel("Conta banco").click();
    await this.telaAtual?.getByLabel("Estornar fatura").locator("button").filter({ hasText: "Clique para selecionar" }).click();
    await this.telaAtual?.getByLabel(opcaoFatura).click();
    await this.telaAtual?.locator('input[name="justificativa"]').click();
    await this.telaAtual?.locator('input[name="justificativa"]').pressSequentially(faker.lorem.sentences());
  }

  @step("Preencher detalhes da conta")
  async preencherDetalhes(credorFatura: string, descricaoFatura: string, dataVencimentoFatura: string, valorFatura: string, opcaoFatura: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotaoComTexto("Nova");
    await this.selecionarOpcaoNoCombobox(credorFatura);
    await this.preencherCampo("description", descricaoFatura);
    await this.preencherCampo("dueDate", dataVencimentoFatura);
    await this.preencherCampo("value", valorFatura);
    await this.selecionarOpcaoFatura(opcaoFatura);
  }

  @step("Remover suspenção da fatura")
  async removerSuspencaoFatura() {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao("button", "Suspensas");
    await this.telaAtual?.getByRole("row", { name: /(\d{6})/gim }).getByRole("button").nth(2).click();
    await this.telaAtual?.getByRole("button", { name: "Remover suspensão" }).nth(1).click();
    await this.clicarTexto("Confirmar");
  }

  @step("Alterar informações da fatura")
  async alterarInfosFatura() {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao("button", "Pendentes");
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
    await this.clicarBotao("button", "Confirmar");
    await this.clicarTexto("Ok");
  }


  @step("Alterar faturas em massa")
  async alteracaoFaturaEmMassa(tipoAlteracao: string, descricao: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    switch (tipoAlteracao) {
      case "Suspender":
      case "Pagar":
        await this.clicarBotao("button", "Pendentes");
        await this.telaAtual?.getByRole("row", { name: "Fatura Credor Descrição" }).getByRole("checkbox").click();
        await this.clicarBotao("button", /Alterar em massa \((\d+)\)/gim);
        break;
      case "Remover suspensão":
        await this.clicarBotao("button", "Suspensas");
        await this.telaAtual?.getByRole("row", { name: "Fatura Credor Descrição" }).getByRole("checkbox").click();
        await this.clicarBotao("button", /Alterar em massa \((\d+)\)/gim);
        break;
      case "Estornar":
        await this.clicarBotao("button", "Pagas");
        await this.telaAtual?.getByRole("row", { name: "Fatura Credor Descrição" }).getByRole("checkbox").click();
        await this.clicarBotao("button", /Alterar em massa \((\d+)\)/gim);
        break;
      default:
        throw new Error("Tipo de alteração inválido");
    }

    switch (tipoAlteracao) {
      case "Suspender":
        await this.telaAtual?.getByRole("button", { name: "Suspender" }).nth(1).click();
        await this.clicarBotao("combobox");
        await this.telaAtual?.getByLabel("Dificuldades financeiras").click();
        await this.telaAtual?.getByPlaceholder("Clique para preencher").pressSequentially(descricao);
        await this.clicarBotao("button", "Confirmar");
        break;
      case "Remover suspensão":
        await this.telaAtual?.getByRole("button", { name: "Remover suspensão" }).nth(1).click();
        await this.clicarBotao("button", "Confirmar");
        break;
      case "Estornar":
        await this.telaAtual?.getByRole("button", { name: "Estornar" }).nth(1).click();
        await this.clicarBotao("combobox");
        await this.telaAtual?.getByLabel("Conta banco").click();
        await this.telaAtual?.locator("button").filter({ hasText: /^Selecionar$/ }).click();
        await this.telaAtual?.getByLabel("CARNE PROPRIO").click();
        await this.telaAtual?.getByPlaceholder("Clique para preencher").click();
        await this.telaAtual?.getByPlaceholder("Clique para preencher").pressSequentially(descricao);
        await this.clicarBotao("button", "Confirmar");
        break;
      case "Pagar":
        await this.telaAtual?.getByRole("button", { name: "Pagar" }).nth(1).click();
        await this.telaAtual?.locator('input[name="documento"]').click();
        await this.telaAtual?.locator('input[name="documento"]').pressSequentially(faker.number.int().toString());
        await this.clicarBotao("combobox");
        await this.telaAtual?.getByLabel("Conta banco").click();
        await this.telaAtual?.locator("button").filter({ hasText: /^Selecionar$/ }).click();
        await this.telaAtual?.getByLabel("CARNE PROPRIO").click();
        await this.telaAtual?.locator('input[name="descricao"]').click();
        await this.telaAtual?.locator('input[name="descricao"]').pressSequentially(descricao);
        await this.clicarBotao("button", "Confirmar");
        break;
      default:
        throw new Error("Tipo de alteração inválido");
    }
  }

  @step("Criar despesa fixa")
  async criarDespesaFixa(credorFatura: string, opcaoFatura: string, planodeContas: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao("button", "Despesas Fixas");
    await this.clicarBotao("button", /(Nova|Criar|Próximo|Adicionar)/gim);
    await this.clicarBotao("button", /(Nova|Criar|Próximo|Adicionar)/gim);
    await this.clicarBotao("combobox");
    await this.telaAtual?.getByLabel(credorFatura).click();
    await this.telaAtual?.locator('input[name="description"]').click();
    await this.telaAtual?.locator('input[name="description"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.locator('input[name="dueDate"]').pressSequentially(faker.date.future().toLocaleDateString());
    await this.telaAtual?.locator('input[name="value"]')?.click();
    await this.telaAtual?.locator('input[name="value"]').pressSequentially(faker.number.int({ min: 100, max: 1000 }).toString());
    await this.selecionarOpcaoFatura(opcaoFatura);
    await this.irProximaEtapa(opcaoFatura, planodeContas);
    await this.clicarBotao("button", /(Nova|Criar|Próximo|Adicionar)/gim);
    await this.clicarBotao("button", /(Nova|Criar|Próximo|Adicionar)/gim);
  }

  async excluirContaAPagar() {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao('button', 'Pendentes')
    await this.telaAtual?.getByRole("row", { name: /(\d{6})/gim }).getByRole("button").nth(2).click();
    await this.clicarBotao('button', 'Excluir')
    await this.telaAtual?.locator("span").filter({ hasText: "Clique para selecionar" }).click();
    await this.telaAtual?.getByLabel("Concorrência").first().click();
    await this.telaAtual?.locator('input[name="descricaoExtra"]').click();
    await this.telaAtual?.locator('input[name="descricaoExtra"]').pressSequentially(faker.lorem.sentences());
    await this.clicarBotao('button', 'Confirmar')
  }

  @step("Criar parcelamento")
  async criarParcelamentos(quantidadeParcelas: string) {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao("button", "Parcelamentos");
    await this.clicarBotao("button", "Novo parcelamento");
    await this.selecionarOpcaoNoCombobox("#");
    await this.preencherCampo("descricao",faker.lorem.words({ min: 3, max: 10 }));
    await this.preencherCampo("valor",faker.number.int({ min: 100, max: 500 }).toString());
    await this.preencherCampo("qtdParcelas", quantidadeParcelas);
    await this.preencherCampo("intervalo", "10");
    await this.preencherCampoPlaceholder("Clique para escrever",faker.lorem.words({ min: 3, max: 10 }));
    await this.clicarBotao("button", "Próximo");
    await this.selecionarOpcaoBotao("Clique para selecionar", "celular novo");
    await this.clicarBotao("button", "Próximo");
    await this.clicarTexto("Gerar contas");
    await this.clicarTexto("Confirmar");
    await this.clicarBotao("button", "Adicionar parcelamento");
  }

  @step("Validar somatorio das faturas vencidas")
  async validarSomatorioFaturasVencidas() {
    if (!this.telaAtual) await this.navegarParaContasAPagarTela();
    await this.clicarBotao("button", "Vencidas");
    await this.telaAtual?.getByRole("cell", { name: "Valor" }).click();
    await this.clicarBotao("button", "Somar");
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
    await this.clicarBotao('button', pagina)
    await this.clicarBotao('combobox')
    await this.telaAtual?.getByLabel(`${quantidade} resultados`).click();
  }

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

  @step('Selecionar fatura')
  async selecionarFatura(idFatura: string) { await this.telaAtual?.getByRole("row", { name: idFatura }).getByRole("button").nth(2).click(); }
  
  @step('Clicar no botão de liquidar')
  async clicarBotaoLiquidar() { await this.telaAtual?.getByRole("button", { name: "Pagar" }).nth(1).click(); }
    
  @step('Finalizar conta sem rateio')
  async finalizarContaSemRateio() { await this.telaAtual?.getByRole("button", { name: /(Nova|Criar|Próximo|Adicionar)/gim }).first().click() }

}