# Use uma imagem base leve com Node.js e ferramentas essenciais
FROM mcr.microsoft.com/playwright:v1.49.1-noble

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app
# Copie arquivos do projeto para o container
COPY package.json package-lock.json ./
COPY testes ./testes

COPY src ./src
COPY Setup.ts /usr/src/app/Setup.ts

# Instale dependências
RUN npm ci

# Instale navegadores necessários para o Playwright
RUN npx playwright install --with-deps

# Comando padrão para rodar testes

CMD ["npx", "playwright", "test", "gerenciador_de_contas_a_receber.spec.ts", "--reporter=html"]
