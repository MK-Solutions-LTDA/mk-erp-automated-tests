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
                await conexoesClientePage.assertConexoesCliente();                
            });
        })
        test('Realizar alterações gerais na conexão', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarConexoesCliente().then(async (conexoesClientePage) => {
                await conexoesClientePage.alterarConexaoCliente();
            })
        });
        test('Bloquear conexão', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarConexoesCliente().then(async (conexoesClientePage) => {
                await conexoesClientePage.bloquearConexaoCliente();
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
                await financeiroPage.criarContrato();
            });
        });
        test('Ativar contrato gerando as suas parcelas', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.criarContrato();
                await financeiroPage.clicarPrimeiraFaturaNaGrade('FRAÇÃO');
                await financeiroPage.ativarContrato();
           })                    
        })
        test('Suspender contrato', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.criarContrato();     
                await financeiroPage.clicarPrimeiraFaturaNaGrade('FRAÇÃO');
                await financeiroPage.suspenderContrato();
            })
        });
        test('Cancelar suspensão de contrato', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.criarContrato();
                await financeiroPage.clicarPrimeiraFaturaNaGrade('FRAÇÃO');
                await financeiroPage.suspenderContrato();
                await financeiroPage.clicarPrimeiraFaturaNaGrade('FRAÇÃO');
                await financeiroPage.cancelarSuspensaoContrato();     
            });
        });
        test('Cancelar contrato', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.criarContrato();
                await financeiroPage.clicarPrimeiraFaturaNaGrade('FRAÇÃO');  
                await financeiroPage.cancelarContrato();
            });
        });
        test('Enviar fatura no chat', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.enviarFaturaNoChat();
            });
        });

        test('Dar baixa na fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.darBaixaFatura();
            });
        })
        test('Inserir comentário na fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.inserirComentarioNaFatura();
            });
        });
        test('Remover fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.removerFatura();
            });
        });
        test('Suspender fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.suspenderConta();
            });
        });
        test('Imprimir fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.imprimirFatura();
            });
        });
        test('Alterar fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.alterarFatura();
            });
        });
        test('Faturar as contas', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.faturarContas();
            });
        });
        test('Editar informações do documento fiscal', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.editarDocumentoFiscal();
            });
        })
        test('Imprimir documentos fiscais da fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => { 
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.imprimirDocumentoFiscal();
            });
        });
        test('Anular documento fiscal', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {   
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.anularDocumentoFiscal();
            });
        });
        test('Cancelar documento fiscal', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.cancelarDocumentoFiscal();
            });
        });
        test('Gerar documentos fiscais da fatura', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.gerarDocumentosFiscaisDaConta();
            });
        })
        test('Enviar negativas de débito por e-mail', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarFinanceiro().then(async (financeiroPage) => {
                await financeiroPage.enviarNegativasDeDebitoPorEmail();
            });
        });
        test('Imprimir negativas de débito', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {});
        test('Gerar nova negativas de débito', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {});
    });
    test.describe('Workspace', () => {
        test('Criar um atendimento preenchendo todos os campos obrigatórios', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarWorkspace().then(async (workspacePage) => {
                await workspacePage.criarAtendimentoWorkspace();
            });
        });
        test('Editar um atendimento', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.abrirNovaConversa();
            await paginaBotNovo.acessarAbaPrimeiraConversa();
            await paginaBotNovo.acessarWorkspace().then(async (workspacePage) => {
                await workspacePage.editarAtendimento();
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
test.describe('Menu lateral', () => {
    test.describe('Indicadores', () => {
        test('Alterar filtro indicadores', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarIndicadores();
            await paginaBotNovo.alterarFiltro(7);
        });
    });    
    test.describe('Historico', () => {
        test('Alterar campos da tabela', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarHistorico();
            await paginaBotNovo.alterarCamposTabelaHistorico();
            await paginaBotNovo.botaoFecharModal.click();
        });
        test('Conferir filtros da tabela', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarHistorico();
            await paginaBotNovo.conferirFiltrosTabelaHistorico();
            await paginaBotNovo.botaoFecharModal.click();
        })
        test('Ver detalhes da conversa', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarHistorico();
            await paginaBotNovo.acessarDetalhesConversa();
            await paginaBotNovo.botaoFecharModal.click();
        });
        test('Imprimir detalhes da conversa', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarHistorico();
            await paginaBotNovo.imprimirDetalhesConversa();
        });
        test('Alterar o setor da conversa', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => { 
            await paginaBotNovo.acessarHistorico();
            await paginaBotNovo.alterarSetorConversa();
        });
        test('Iniciar conversa a partir do histórico', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarHistorico();
            await paginaBotNovo.iniciarNovaConversaHistorico();
        });
    });
    test.describe('Avaliações e críticas', () => {
        test('Verificar filtros de busca', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarAvaliacoesCriticas();
            await paginaBotNovo.alterarFiltrosAvaliacoesCriticas();
            await paginaBotNovo.botaoFecharModal.click();
        });
        test('Alterar campos da tabela', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarAvaliacoesCriticas();
            await paginaBotNovo.alterarCamposTabelaAvaliacoesCriticas();
            await paginaBotNovo.botaoFecharModal.click();
        });
        test('Ver conversa', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarAvaliacoesCriticas();
            await paginaBotNovo.verConversa();
            await paginaBotNovo.botaoFecharModal.click();
        });
        test('Imprimir conversa', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarAvaliacoesCriticas();
            await paginaBotNovo.imprimirConversa();
        });
        test('Filtrar atendimentos por operador', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarAvaliacoesCriticas();
            await paginaBotNovo.filtrarAtendimentosPorOperador();
        });
        test('Gravar informações em "análise da conversa"', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarAvaliacoesCriticas();
            await paginaBotNovo.gravarAnaliseConversa(); 
        });
    });  
    test.describe('Envio em massa', () => {
        test('Fazer envio em massa', async ({ paginaLogin, paginaPrincipal, paginaBotNovo }) => {
            await paginaBotNovo.acessarEnvioEmMassa();
            await paginaBotNovo.fazerEnvioEmMassa();
        })
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