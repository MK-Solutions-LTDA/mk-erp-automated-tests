import { test as base, BrowserContext } from "@playwright/test";
import { LoginPage } from "../../paginas/LoginPage";
import { MainPage } from "../../paginas/MainPage";
import { TipoPagina } from "../TipoPagina";
import { pass, user, user2, pass2 } from '../../../Setup';
import BotNovo from "../../paginas/subpaginas/bot/BotNovo";
import BotAntigo from "../../paginas/subpaginas/bot/BotAntigo";

export const test = base.extend<{
  navegador1: BrowserContext;
  navegador2: BrowserContext;
  paginaLogin: LoginPage;
  paginaLogin2: LoginPage;
  paginaPrincipal: MainPage;
  paginaPrincipal2: MainPage;
  paginaBotNovo: BotNovo;
  paginaBotNovo2: BotNovo;
  paginaBotAntigo: BotAntigo;
}>({
  
  // Cria a primeira instância de navegador
  navegador1: async ({ browser }, use) => {
    const navegador1 = await browser.newContext();
    await use(navegador1);
    await navegador1.close();
  },

  // Cria a segunda instância de navegador
  navegador2: async ({ browser }, use) => {
    const navegador2 = await browser.newContext();
    await use(navegador2);
    await navegador2.close();
  },

  // Fixture para a primeira página de login usando a primeira instância de navegador
  paginaLogin: async ({ navegador1 }, use) => {
    const page = await navegador1.newPage();
    const paginaLogin = new LoginPage(page);
    await paginaLogin.entrarPaginaLogin();
    await use(paginaLogin);
  },

  // Fixture para a segunda página de login usando a segunda instância de navegador
  paginaLogin2: async ({ navegador2 }, use) => {
    const page = await navegador2.newPage();
    const paginaLogin = new LoginPage(page);
    await paginaLogin.entrarPaginaLogin();
    await use(paginaLogin);
  },

  // Fixture para a página principal da primeira conta
  paginaPrincipal: async ({ paginaLogin }, use) => {
    const paginaPrincipal = await paginaLogin.realizarLogin(user, pass);
    await use(paginaPrincipal);
  },

  // Fixture para a página principal da segunda conta
  paginaPrincipal2: async ({ paginaLogin2 }, use) => {
    const paginaPrincipal2 = await paginaLogin2.realizarLogin(user2, pass2);
    await use(paginaPrincipal2);
  },

  // Fixture para o bot na primeira conta
  paginaBotNovo: async ({ paginaPrincipal, navegador1 }, use) => {
    const pagePromise = navegador1.waitForEvent('page');
    await paginaPrincipal.irParaPagina(TipoPagina.BOT);

    const newPage = await pagePromise;

    // Interceptar e monitorar a conexão WebSocket
    newPage.on('websocket', (ws) => {
      if (ws.url().includes('wss://mk4.mksolutions.com.br/ws-mkbot/')) {
        console.log('Conexão WebSocket iniciada:', ws.url());

        ws.on('framereceived', (frame) => {
          const payload = frame.payload.toString();
          
          if (payload.includes('<body>')) {
            console.log('Mensagem recebida com body:', payload);
            const bodyContentMatch = payload.match(/<body>(.*?)<\/body>/);
            if (bodyContentMatch && bodyContentMatch[1]) {
              paginaBotNovo.registrarMensagensWebsocket(bodyContentMatch[1]);
            }
          }

        });

        ws.on('close', () => {
          console.log('Conexão WebSocket fechada');
        });
      }
    });

    const paginaBotNovo = new BotNovo(newPage, navegador1);
    await use(paginaBotNovo);

    await newPage.waitForLoadState('load');
    await paginaBotNovo.limparConversa();
    await newPage.close();
  },

  paginaBotAntigo: async ({ paginaPrincipal, navegador1 }, use) => {
    const pagePromise = navegador1.waitForEvent('page');
    await paginaPrincipal.irParaPagina(TipoPagina.BOT);
    const newPage = await pagePromise;
    const pagePromise2 = navegador1.waitForEvent('page');
    await newPage.getByRole('link', { name: 'Chatbot' }).click();
    const newPage2 = await pagePromise2;
    const paginaBotAntigo = new BotAntigo(newPage2, navegador1);
    await use(paginaBotAntigo);
    await newPage.waitForLoadState('load');
    await newPage.close();
  },

  // Fixture para o bot na segunda conta
  paginaBotNovo2: async ({ paginaPrincipal2, navegador2 }, use) => {
    const pagePromise = navegador2.waitForEvent('page');
    await paginaPrincipal2.irParaPagina(TipoPagina.BOT);
    const newPage = await pagePromise;
    const paginaBotNovo = new BotNovo(newPage, navegador2);
    await use(paginaBotNovo);
    await newPage.waitForLoadState('load');
    await paginaBotNovo.limparConversa();
    await newPage.close();
  }

});

export const expect = base.expect