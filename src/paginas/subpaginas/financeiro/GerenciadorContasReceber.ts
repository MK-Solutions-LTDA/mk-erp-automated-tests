import { faker } from "@faker-js/faker/locale/pt_BR";
import step from "../../../utilitarios/decorators";
import BasePage from "../../BasePage";
import { expect } from "@playwright/test";
import Servicos from "../../../utilitarios/servicos";
import { API } from "../../../utilitarios/api/financeiro/gerenciador_contas_receber/apimap";


export class GerenciadorContasReceber extends BasePage {

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
    
    @step('Excluir fatura')
    async excluirContaAReceber() {
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
    await this.page.waitForTimeout(3 * 1000);
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
      await this.telaAtual?.waitForTimeout(3 * 1000)
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
    await this.telaAtual?.getByLabel('Mensalidade').click();
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
    console.log(dataTable2);
    const faturaIds = dataTable2?.match(/(\d{6})/gmi);
    const contas = [...new Set(faturaIds?.pop())];
    console.log(contas);
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

  @step('Gerar lote')
  async gerarLote(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'E-mail' }).click();
    await this.telaAtual?.getByText('Novo lote').click();
    await this.telaAtual?.getByRole('button', { name: 'Imprimir boletos' }).click();
    await this.telaAtual?.getByRole('combobox').first().click();
    await this.telaAtual?.getByLabel('CEF TESTE').click();
    await this.telaAtual?.locator('input[name="dataInicio"]').pressSequentially(faker.date.past().toLocaleDateString());
    await this.telaAtual?.locator('input[name="dataFim"]').pressSequentially(faker.date.future().toLocaleDateString());
    await this.telaAtual?.getByRole('button', { name: 'Confirmar' }).click();
    const responsePromise = new Promise (async (resolve) => {this.page.on("response", (response) => { if (response.url().includes(`${API.NOVO_LOTE_FATURAS}`)) { return resolve(response) }})});
    const response = await responsePromise;
    expect(await Servicos.checarRequisicao(response)).toBeTruthy();
    await this.telaAtual?.getByRole('button').first().click();
    await this.telaAtual?.locator('html').click();
  }

  @step('Enviar Emails')
  async enviarEmails(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.gerarLote();
    await this.telaAtual?.locator('#sendEmailForm div').filter({ hasText: 'DataOperadorConta SMTPClique' }).getByRole('combobox').click();
    await this.telaAtual?.getByLabel('Conta email funcionando').click();
    await this.telaAtual?.getByLabel('Novo envio de e-mail em massa').locator('button').filter({ hasText: 'Clique para selecionar' }).click();
    await this.telaAtual?.getByLabel('Faturas e docs. fiscais', { exact: true }).click();
    await this.telaAtual?.locator('input[name="titulo"]').click();
    await this.telaAtual?.locator('input[name="titulo"]').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.locator('.ql-editor').click();
    await this.telaAtual?.locator('.ql-editor').pressSequentially(faker.lorem.sentences());
    await this.telaAtual?.getByRole('button', { name: 'Enviar' }).click();
  }

  @step('Imprimir emails em massa')
  async imprimirEmailsMassa(){
    await this.page.waitForTimeout(2000);
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.gerarLote();
    await this.telaAtual?.getByRole('row', { name: 'Fatura Valor Vencimento' }).getByRole('checkbox').check();
    await this.telaAtual?.getByRole('button', { name: 'Imprimir' }).nth(1).click();
    await this.telaAtual?.getByLabel('Imprimir').getByText('Confirmar').click();
  }

  @step('Abrir lote de faturas')
  async abrirLoteFaturas(){
    await this.page.waitForTimeout(2000);
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Impressão em massa', exact: true }).click();
    await this.page.waitForTimeout(2000);
    await this.telaAtual?.getByText('Situação').click();
    await this.telaAtual?.getByText('Situação').click();
    await this.telaAtual?.locator('td:nth-child(11)').first().click();
    await this.telaAtual?.getByRole('button', { name: 'Lote de faturas' }).click();
  
  };

  @step('Imprimir lote')
  async imprimirLote(){
    await this.page.waitForTimeout(2000);
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Imprimir' }).nth(1).click();
    await this.telaAtual?.getByText('Confirmar').click();
  };

  @step('Ignorar lote')
  async ignorarLote(){
    await this.page.waitForTimeout(2000);
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.page.waitForTimeout(2000);
    await this.telaAtual?.locator('.\\!rounded-xl > tbody > tr > td').first().click();
    await this.telaAtual?.getByRole('button', { name: 'Ignorar impressão' }).nth(1).click();
    await this.telaAtual?.getByText('Confirmar').click();
  };
  
  @step('Permitir lote')
  async permitirLote(){
    await this.page.waitForTimeout(2000);
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.locator('.\\!rounded-xl > tbody > tr > td').first().click();
    await this.telaAtual?.getByRole('button', { name: 'Permitir impressão' }).nth(1).click();
    await this.telaAtual?.getByText('Confirmar').click();
  };
  
  @step('Encerrar lote')
  async encerrarLote(){
    await this.page.waitForTimeout(2000);
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'Encerrar lote' }).nth(1).click();
    await this.telaAtual?.getByText('Confirmar').click();  
  };
  
  @step('Paginar lote')
  async paginarLote(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'E-mail', exact: true }).first().click();
    await this.telaAtual?.getByRole('button', { name: '2', exact: true }).click();
    await this.telaAtual?.getByRole('button', { name: '3', exact: true }).click();
    await this.telaAtual?.getByRole('button', { name: '4', exact: true }).click();
  };

  @step('Fazer download dos emails na tela')
  async fazerDownloadEmail(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'E-mail', exact: true }).first().click();
    await this.telaAtual?.getByRole('button', { name: 'Baixar' }).nth(1).click();
    await this.telaAtual?.getByRole('button', { name: 'PDF Baixar PDF' }).click();
    await this.telaAtual?.getByLabel('Reimprimir').uncheck();
    await this.telaAtual?.locator('#nomeTipo').uncheck();
    await this.telaAtual?.getByRole('button', { name: 'Aplicar' }).click();
  }

  @step('Imprimir grade de emails')
  async imprimirGradeEmails(){
    if (!this.telaAtual) await this.navegarParaContasAReceberTela();
    await this.telaAtual?.getByRole('button', { name: 'E-Wmail', exact: true }).first().click();
    await this.telaAtual?.locator('.flex-1 > div:nth-child(3) > div > button:nth-child(2)').first().click();
    await this.telaAtual?.getByLabel('Reimprimir').uncheck();
    await this.telaAtual?.locator('#nomeTipo').uncheck();
    await this.telaAtual?.getByRole('button', { name: 'Aplicar' }).click();
  }
}