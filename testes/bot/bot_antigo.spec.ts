import { faker } from "@faker-js/faker/locale/pt_BR";
import { test } from "../../src/utilitarios/fixtures/base";

test.describe('Salas de setores', () => {
    test("Enviar mensagens no chat", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.enviarMensagensNoChat(faker.lorem.sentence());
    });
    test("Envio de emojis no chat", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        await paginaBotAntigo.enviarMensagensNoChat('⚰️💔💀🫠😭🥴🤪😖🤣💕👌😊');
    });
    test("Envio de PDF no chat", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        const path = require('path');
        const filePath = path.join(__dirname, 'file.pdf');
        await paginaBotAntigo.enviarMensagensNoChat(filePath);
    });
    test("Envio de Imagem no chat", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {
        const path = require('path');
        const filePath = path.join(__dirname, 'image.jpg');
        await paginaBotAntigo.enviarMensagensNoChat(filePath);
    });
    test("Envio de Vídeo no chat", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {});
    test("Envio de Docx no chat", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {});
    test("Gravar e enviar áudio curto", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {});
    test("Gravar e enviar áudio longo", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {});
    test("Escutar áudios do operador", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {});
    test("Excluir gravação antes de enviar", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {});
    test("Fazer download do áudio e ouvir ", async ({paginaLogin, paginaPrincipal, paginaBotAntigo}) => {});
});