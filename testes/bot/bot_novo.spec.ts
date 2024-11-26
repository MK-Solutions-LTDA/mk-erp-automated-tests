// so quero deixar claro que esses testes sao o puro caos, nao tem nada de organizado e nem de bonito, mas funciona

import { faker } from "@faker-js/faker/locale/pt_BR";
import Servicos from "../../src/utilitarios/servicos";
import { expect, test } from "../../src/utilitarios/fixtures/base";
import { getRandomChampion } from "../../src/utilitarios/api/championlist";

test.describe('Ações', () => {
    test('Enviar um anexo de segunda via da fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAnexo(2);
    });

    test('Enviar dois anexos de segunda via da fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAnexo(3);
    });

    test('Resposta padrão - Criar', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.criarRespostaPadrao('Resposta padrão teste');
        await paginaBotNovo.botaoFecharModal.click();
    });
    
    test('Resposta padrão - Editar', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.criarRespostaPadrao('Resposta padrão teste');
        await paginaBotNovo.editarRespostaPadrao('Resposta padrão teste');
        await paginaBotNovo.botaoFecharModal.click();
    });

    test('Resposta padrão - Excluir', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.criarRespostaPadrao('Resposta padrão teste');
        await paginaBotNovo.excluirRespostaPadrao('Resposta padrão teste');
        await paginaBotNovo.botaoFecharModal.click();
    });

    test('Acessar cadastro do cliente', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.acessarCadastroCliente().then(async (cadastroDePessoasPage) => {        
            await cadastroDePessoasPage.locator('iframe[name="mainform"]').contentFrame().locator('input[name="WFRInput1026516"]').click();
            await cadastroDePessoasPage.locator('iframe[name="mainform"]').contentFrame().locator('input[name="WFRInput1026516"]').press('Control+A')
            await cadastroDePessoasPage.locator('iframe[name="maainform"]').contentFrame().locator('input[name="WFRInput1026516"]').pressSequentially(getRandomChampion());
            await cadastroDePessoasPage.locator('iframe[name="mainform"]').contentFrame().getByRole('link').first().click();
            cadastroDePessoasPage.on('response', async (response) => {
                if (response.url().includes(`mknext_atualizar_dados_pessoa`)) {
                    expect(response.ok()).toBeTruthy();
                }
            });
        }); 
    });
    

    test('Navegar pelas abas do cadastro do cliente', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.acessarCadastroCliente().then(async (cadastroDePessoasPage) => {
            await cadastroDePessoasPage.locator('iframe[name="mainform"]').contentFrame().getByText('Informações Extras', {exact: true}).first().click();
            await cadastroDePessoasPage.locator('iframe[name="mainform"]').contentFrame().getByText('Endereços Adicionais', {exact: true}).first().click();
            await cadastroDePessoasPage.locator('iframe[name="mainform"]').contentFrame().getByText('IDs de chatbot', {exact: true}).first().click();
            await cadastroDePessoasPage.locator('iframe[name="mainform"]').contentFrame().getByText('Mensagens Enviadas', {exact: true}).first().click();
            await cadastroDePessoasPage.locator('iframe[name="mainform"]').contentFrame().getByText('Identificação', {exact: true}).first().click();
        })
    });

    test.describe('Conexões do cliente', () => {
        test('Validar se conexões ativas estão sendo exibidas corretamente', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarConexoesCliente().then(async (conexoesClientePage) => {
                await expect(conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('div:nth-child(13) > .webix_cell')).toBeVisible();
            });
        })

        test('Realizar alterações gerais na conexão', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarConexoesCliente().then(async (conexoesClientePage) => {
                await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('div:nth-child(13) > .webix_cell').click(); 
                await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: "Alterações gerais"}).click();
                await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').click();
                await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').press('Control+A');
                await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').press('Backspace');
                await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').pressSequentially(faker.lorem.sentences());
                await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('.next > button').first().click();
                await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div:nth-child(41) > button').click();
                await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('.finish > button').first().click();
                conexoesClientePage.on('response', async (response) => {
                    if (response.url().includes(`form.do`)) {
                        expect(response.ok()).toBeTruthy();
                    }
                })
            })
        });
        
        test('Bloquear conexão', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarConexoesCliente().then(async (conexoesClientePage) => {
 
                await conexoesClientePage.waitForTimeout(2000);

                const semRegistro = expect(conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().getByText('(NENHUM REGISTRO)', {exact: true})).toBeHidden();

                if (semRegistro != null) {
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Conexões de cobrança bloqueadas deste cliente'}).click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('div[class="webix_ss_center"] div:nth-child(3) div:nth-child(1)').click(); 
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: "Desbloqueio de conexões"}).click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').pressSequentially(faker.lorem.sentences());
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('.finish > button').first().click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: "Conexões de cobrança ativas deste cliente"}).click();  
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('div:nth-child(13) > .webix_cell').first().click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: "Bloquear a conexão"}).click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div[title="Associe o motivo de bloqueio desejado."] > div > button[type="button"]').first().click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'Cancelado/Inativo'}).first().click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').pressSequentially(faker.lorem.sentences());
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('.finish > button').first().click();
                } 
                
                else {
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('div:nth-child(13) > .webix_cell').click(); 
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: "Bloquear a conexão"}).click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div[title="Associe o motivo de bloqueio desejado."] > div > button[type="button"]').first().click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'Cancelado/Inativo'}).click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('textarea').pressSequentially(faker.lorem.sentences());
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().click();
                    await conexoesClientePage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('.finish > button').first().click();
                }

            });
        });
        test('Adicionar redução de velocidade', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarConexoesCliente().then(async (conexoesClientePage) => {
                // fazer esse carinha aqui pelo banco de dados
            })
        });

    })
    test.describe('Emails', () => {
        test('Enviar email', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.enviarEmail().then(async (enviarEmailPage) => {
                await enviarEmailPage.waitForLoadState('load')
                await enviarEmailPage.locator('iframe[name="mainform"]').contentFrame().locator('input[title="Título do email."]').click();
                await enviarEmailPage.locator('iframe[name="mainform"]').contentFrame().locator('input[title="Título do email."]').pressSequentially(faker.lorem.sentence());
                await enviarEmailPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe[title="Área de texto formatado\\. Pressione ALT-F9 para exibir o menu\\, ALT-F10 para exibir a barra de ferramentas ou ALT-0 para exibir a ajuda"]').contentFrame().locator('html').click();
                await enviarEmailPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe[title="Área de texto formatado\\. Pressione ALT-F9 para exibir o menu\\, ALT-F10 para exibir a barra de ferramentas ou ALT-0 para exibir a ajuda"]').contentFrame().locator('html').pressSequentially(faker.lorem.paragraph());
                await enviarEmailPage.locator('iframe[name="mainform"]').contentFrame().locator('input[title="Marque para confirmar o interesse em enviar o email agora."]').first().click();
                await enviarEmailPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Clique para enviar o email.'}).first().click();
            });
        });
        
        test('Visualizar coringas', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.enviarEmail().then(async (enviarEmailPage) => {
                await enviarEmailPage.waitForLoadState('load');
                await enviarEmailPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Clique para visualizar os coringas disponíveis.'}).first().click();
                expect(enviarEmailPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(5).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div[class="HTMLMemo"]')).toBeVisible();
            });
        });
    })

    test.describe('Financeiro', () => {
        test('Criar novo contrato dentro do cadastro do cliente', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Novo contrato'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div:nth-child(29) > div:nth-child(2) > div > button').click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'FRAÇÃO'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1000)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1000)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1000)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1000)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1000)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').last().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Concluir'}).last().click();
            });
        });

        test('Ativar contrato gerando as suas parcelas', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Novo contrato'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div:nth-child(29) > div:nth-child(2) > div > button').click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'FRAÇÃO'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').nth(2).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').nth(4).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Concluir'}).last().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('div[class="mk-form-fechar"]').first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().getByRole('gridcell', {name: 'FRAÇÃO'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Ativar contrato gerando suas parcelas'}).click();
                await financeiroPage.waitForTimeout(1500);
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Clique para finalizar'}).last().click();
            })                    
        })
        test('Suspender contrato', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Novo contrato'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div:nth-child(29) > div:nth-child(2) > div > button').click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'FRAÇÃO'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').nth(4).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Concluir'}).last().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('div[class="mk-form-fechar"]').first().click();
                await financeiroPage.reload();
                await financeiroPage.waitForLoadState('load');
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().getByRole('gridcell', {name: 'FRAÇÃO'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Suspender contrato'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div[title="Informe por qual motivo o cliente deseja solicitar esta suspensão."]').click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'Dificuldades financeiras'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próxima etapa'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('textbox', {name: 'Data de agendamento do bloqueio de conexão.'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('textbox', {name: 'Data de agendamento do bloqueio de conexão.'}).first().pressSequentially(faker.date.future().toLocaleDateString());
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próxima etapa'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próxima etapa'}).first().click();
            })
        });
        test('Cancelar suspensão de contrato', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Novo contrato'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div:nth-child(29) > div:nth-child(2) > div > button').click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'FRAÇÃO'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').nth(4).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Concluir'}).last().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('div[class="mk-form-fechar"]').first().click();
                await financeiroPage.waitForTimeout(5000);
                await financeiroPage.reload();
                await financeiroPage.waitForLoadState('load');
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().getByRole('gridcell', {name: 'FRAÇÃO'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Suspender contrato'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div[title="Informe por qual motivo o cliente deseja solicitar esta suspensão."]').click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'Dificuldades financeiras'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próxima etapa'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('textbox', {name: 'Data de agendamento do bloqueio de conexão.'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('textbox', {name: 'Data de agendamento do bloqueio de conexão.'}).first().pressSequentially(faker.date.future().toLocaleDateString());
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próxima etapa'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próxima etapa'}).first().click();
                await financeiroPage.reload();
                await financeiroPage.waitForLoadState('load');
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().getByRole('gridcell', {name: 'FRAÇÃO'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Cancelar suspensão'}).first().click();
                financeiroPage.on('dialog', async (dialog) => {
                    await dialog.accept();
                });
            });

        });
        test('Cancelar contrato', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Novo contrato'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('div:nth-child(29) > div:nth-child(2) > div > button').click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'FRAÇÃO'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próximo'}).first().click();
                await financeiroPage.waitForTimeout(1500)
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').nth(4).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Concluir'}).last().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('div[class="mk-form-fechar"]').first().click();
                await financeiroPage.waitForTimeout(5000);
                await financeiroPage.reload();
                await financeiroPage.waitForLoadState('load');
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().getByRole('gridcell', {name: 'FRAÇÃO'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Cancelar contrato'}).first().click();
                await financeiroPage.waitForTimeout(1500);
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('xpath=//div[@title="Selecione um motivo de cancelamento."]//div//button[@type="button"]').click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'Concorrência'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próxima etapa'}).first().click();
                await financeiroPage.waitForTimeout(1500);
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próxima etapa'}).first().click();
                await financeiroPage.waitForTimeout(1500);
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Próxima etapa'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').nth(3).check();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Clique para finalizar'}).first().click();
                await financeiroPage.reload();
                await financeiroPage.waitForLoadState('load');
            });
        });

        test('Enviar fatura no chat', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Faturas a receber deste contato'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('.webix_cell > .webixtype_base').first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Enviar fatura ao chat'}).click();
                financeiroPage.on('dialog', async (dialog) => {
                    await dialog.accept();
                })
            });
        });

        test('Dar baixa na fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Faturas a receber deste contato'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('.webix_cell > .webixtype_base').first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Baixar fatura selecionada'}).click();
                financeiroPage.on('dialog', async (dialog) => {
                    await dialog.accept();
                });
                await financeiroPage.reload();
                await financeiroPage.waitForLoadState('load');
            });
        })
        test('Inserir comentário na fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Faturas a receber deste contato'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('.webix_cell > .webixtype_base').first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Inserir comentários na fatura.'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('xpath=//textarea[@id="WFRInput847333"]').click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('xpath=//textarea[@id="WFRInput847333"]').pressSequentially(faker.lorem.sentences());
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').check();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Gravar comentário'}).click();
            });
        });
        
        test('Remover fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Faturas a receber deste contato'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('xpath=//tbody/tr[@role="row"]/td[5]/div[1]/input[1]').first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('xpath=//tbody/tr[@role="row"]/td[5]/div[1]/input[1]').first().pressSequentially('Fração');
                await financeiroPage.waitForTimeout(1500);
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('.webix_cell > .webixtype_base').first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Remover fatura'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('xpath=//input[@title="Informações adicionais que explicam o motivo dessa liquidação."]').click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('xpath=//input[@title="Informações adicionais que explicam o motivo dessa liquidação."]').pressSequentially(faker.lorem.sentences());
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().check();
                financeiroPage.on('dialog', async (dialog) => {
                    await dialog.accept();
                })
                await financeiroPage.reload();
                await financeiroPage.waitForLoadState('load');
            });
        });

        test('Suspender fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Faturas a receber deste contato'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('xpath=//tbody/tr[@role="row"]/td[5]/div[1]/input[1]').first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('xpath=//tbody/tr[@role="row"]/td[5]/div[1]/input[1]').first().pressSequentially('Fração');
                await financeiroPage.waitForTimeout(1500);
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(1).contentFrame().locator('.webix_cell > .webixtype_base').nth(1).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Suspender fatura'}).first().click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().locator('xpath=//div[@title="Selecione o motivo de suspensão para a geração de índices e categorização."]//div//button[@type="button"]').click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('option', {name: 'Dificuldades Financeiras'}).click();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('checkbox').first().check();
                await financeiroPage.locator('iframe[name="mainform"]').contentFrame().locator('iframe').nth(2).contentFrame().locator('iframe[name="mainform"]').contentFrame().getByRole('button', {name: 'Clique para executar o procedimento.'}).first().click();
                financeiroPage.on('dialog', async (dialog) => {
                    await dialog.accept();
                });
                await financeiroPage.reload();
                await financeiroPage.waitForLoadState('load');
            });
        });
    });
});

test.describe('Opções', () => {
    test('Redefinir contato identificado', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.redefinirContato();
    });

    test('Transferir a conversa para um outro setor', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.transferirConversaParaSetor('Atendimento ao Cliente', true);
    });

    test('Devolver conversa para a fila', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.devolverConversaParaFila();
    });

    test('Enviar mensagens ao chat', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarMensagemChat(faker.lorem.sentence()); 
    });

    test('Enviar mensagens ao chat com emojis', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.page.routeWebSocket('wss://mk4.mksolutions.com.br/ws-mkbot/', route => {
            const server = route.connectToServer();
            console.log('Conectado ao servidor');
            console.log(server.url());
        });
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarMensagemChat('caixao⚰️ esquelo💀 okey👌 corasoes💕 rindo🤣 oomeudeus😖 marcia🫠 michelly bolos🤪 machonha🥴');  
    });

    test('Enviar mensagem de audio ao chat', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAudioChat();
    });
    
    test('Excluir audio antes de enviar', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {    
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.excluirAudioChat();
    });

    test('Enviar dois áudios e verificar se um começa a tocar à partir do momento que o outro para', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAudioChat();
        await paginaBotNovo.enviarAudioChat();
    });

    test('Fazer download do arquivo de audio', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAudioChat();
        await paginaBotNovo.fazerDownloadAudio();
    });

    test('Copiar link do arquivo de audio', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAudioChat();
        await paginaBotNovo.copiarLinkAudio();
    });

    test('Ouvir audio antes de enviar ele para a conversa', async ({ paginaLogin, paginaPrincipal, paginaBotNovo}) => {
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.enviarAudioChat();
        await paginaBotNovo.ouvirAudio();
    });

    test('Devolver para a fila', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.devolverParaFila();
    });

    test('Sair da conversa (único operador)', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.sairConversaUnicoOperador();
    });

    test('Transferir para setor', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
        
        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.transferirParaSetor();
    });

});

test.describe('Tags', () => {

    test('Criar tag', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {     

        const responsePromise = new Promise(async (resolve) => {
            paginaBotNovo.page.on("response", (response) => {
                if (response.url().includes(`${URL}/mk/WSMKBotCriarTag.rule`)) {
                    return resolve(response);    
                }
            });
        });

        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.criarTag();
        const response = await responsePromise;
        expect(await Servicos.checarRequisicao(response)).toBeTruthy();  

    });

    test('Editar Tag', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {        

        await paginaBotNovo.abrirNovaConversa();
        await paginaBotNovo.acessarAbaPrimeiraConversa();
        await paginaBotNovo.editarTag();

    });

});