# naPorta API

<div>
  <img src="https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/NestJS-TypeScript-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Jest-Testing-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
</div>

API REST desenvolvida para o gerenciamento de pedidos, com autenticação, validação de dados, persistência relacional e documentação interativa.

## Sumário

- [Introdução](#introdução)
- [Requisitos](#requisitos)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Instalação e execução](#instalação-e-execução)
- [Execução com Docker](#execução-com-docker)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Documentação Swagger](#documentação-swagger)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
    - [Autenticação](#1-autenticação)
    - [Criar pedido](#2-criar-pedido)
    - [Listar pedidos](#3-listar-pedidos)
    - [Consultar pedido](#4-consultar-pedido)
    - [Atualizar pedido](#5-atualizar-pedido)
    - [Excluir pedido](#6-excluir-pedido)
- [Testes](#testes)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Tratamento de erros](#tratamento-de-erros)
- [Autor e licença](#autor-e-licença)

## Introdução

A **naPorta API** é uma aplicação backend desenvolvida com NestJS e TypeScript para disponibilizar operações de gerenciamento de pedidos por meio de uma API REST.

O projeto utiliza PostgreSQL para persistência dos dados e Prisma ORM para acesso ao banco. A autenticação é baseada em JWT (JSON Web Token), permitindo proteger os recursos que exigem um usuário autenticado.

A aplicação também disponibiliza documentação interativa por meio do Swagger e suporte à execução em containers Docker.

## Requisitos

Para executar o projeto localmente, são necessários:

- Node.js 22 ou versão compatível com o projeto.
- npm.
- PostgreSQL 17 ou compatível.
- Git.

Para executar a aplicação utilizando containers:

- Docker.
- Docker Compose.

## Tecnologias

| Tecnologia | Finalidade |
|---|---|
| Node.js | Ambiente de execução JavaScript. |
| NestJS | Framework para desenvolvimento da API. |
| TypeScript | Tipagem estática e organização do código. |
| Prisma ORM | Acesso e manipulação dos dados. |
| PostgreSQL | Banco de dados relacional. |
| JWT | Autenticação baseada em tokens. |
| Swagger / OpenAPI | Documentação interativa dos endpoints. |
| Jest | Testes automatizados. |
| Docker Compose | Orquestração dos containers da aplicação e do banco. |

## Funcionalidades

- **Autenticação:** login e geração de token JWT.
- **Criação de pedidos:** cadastro de pedidos, clientes e itens.
- **Consulta de pedidos:** listagem e consulta individual.
- **Filtros:** pesquisa por número do pedido, status e intervalo de datas.
- **Paginação:** organização dos resultados em páginas.
- **Atualização:** alteração dos dados de um pedido.
- **Exclusão lógica:** remoção de pedidos sem apagar permanentemente seus registros.
- **Validação de dados:** validação dos parâmetros e corpos das requisições.
- **Integridade dos dados:** persistência relacional e restrições no banco de dados.
- **Tratamento de erros:** respostas HTTP apropriadas e mensagens em português.
- **Documentação interativa:** exploração dos endpoints por meio do Swagger.
- **Testes automatizados:** testes unitários para validar comportamentos da aplicação.
- **Containerização:** execução da aplicação e do banco com Docker Compose.

## Instalação e execução

### 1. Clone o repositório

```bash
git clone https://github.com/luizfelipe9627/na-porta-api.git
```

### 2. Acesse a pasta do projeto

```bash
cd na-porta-api
```

### 3. Instale as dependências

```bash
npm i
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, seguindo as instruções da seção [Configuração do ambiente](#configuração-do-ambiente).

### 5. Gere o Prisma Client

```bash
npm run prisma:generate
```

### 6. Execute as migrações

```bash
npx prisma migrate dev
```

### 7. Inicie a aplicação

Em modo de desenvolvimento:

```bash
npm run start:dev
```

A API ficará disponível em `http://localhost:3000`.

> Os comandos pressupõem que os scripts e as configurações descritos estejam presentes no `package.json` e no projeto.

## Execução com Docker

O projeto utiliza Docker Compose para executar os serviços da aplicação e do PostgreSQL.

### 1. Configure o arquivo `.env`

Preencha as variáveis necessárias para o banco, o JWT e o usuário inicial, conforme a seção de configuração.

### 2. Construa as imagens e inicie os containers

```bash
docker compose up -d --build
```

### 3. Confira o estado dos serviços

```bash
docker compose ps
```

### 4. Consulte os logs da API

```bash
docker compose logs -f api
```

O serviço PostgreSQL utiliza a porta `5433` no host, enquanto a comunicação entre os containers utiliza a porta interna `5432`.

A API é disponibilizada na porta `3000`. Se o serviço Prisma Studio estiver habilitado no Compose, sua interface fica disponível em `http://localhost:5555`.

> O container da API executa as migrações de produção antes de iniciar o servidor. O seed também está configurado no comando de inicialização atual; confirme se sua implementação evita recriar o usuário inicial quando ele já existe.

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto. O exemplo abaixo utiliza valores ilustrativos que devem ser substituídos conforme o ambiente.

```dotenv
# Banco de dados
POSTGRES_USER=postgres
POSTGRES_PASSWORD=altere_esta_senha
POSTGRES_DB=na_porta

DATABASE_URL="postgresql://postgres:altere_esta_senha@localhost:5433/na_porta?schema=public"

# Aplicação
PORT=3000
NODE_ENV=development

# Autenticação
JWT_SECRET=gere_uma_chave_secreta_forte
JWT_EXPIRES_IN=1h

# Usuário inicial
INITIAL_USER_NAME=Administrador
INITIAL_USER_EMAIL=admin@example.com
INITIAL_USER_PASSWORD=defina_uma_senha_forte
```

**Importante:**

- O valor de `DATABASE_URL` deve corresponder às credenciais do PostgreSQL.
- Na execução local, a URL utiliza `localhost:5433`.
- Dentro do Docker Compose, a API utiliza o hostname `db` e a porta interna `5432`.
- `JWT_SECRET` deve ser uma chave forte e privada.
- Nunca versione o arquivo `.env` com credenciais reais.
- As variáveis `INITIAL_USER_*` devem corresponder às utilizadas pelo seed do projeto.

## Documentação Swagger

A API possui documentação interativa gerada com Swagger e OpenAPI.

Com a aplicação em execução, acesse:

**Swagger UI:** http://localhost:3000/api

**Especificação OpenAPI em JSON:** http://localhost:3000/api-json

Pela interface do Swagger, é possível consultar os endpoints, visualizar os contratos das requisições e respostas e executar chamadas diretamente pela documentação.

Para testar as rotas protegidas:

1. Realize o login para obter um token JWT.
2. Clique em **Authorize** na interface Swagger.
3. Informe o token no formato aceito pela configuração Bearer.
4. Execute os endpoints protegidos.

## Autenticação

A autenticação utiliza JWT. Após realizar o login com credenciais válidas, o cliente recebe um token que deve ser enviado nas requisições protegidas.

Cabeçalho de autenticação:

```http
Authorization: Bearer <seu_token_jwt>
```

O token deve ser mantido em segurança e enviado somente em requisições destinadas à API.

## Endpoints

Os endpoints abaixo descrevem as operações previstas para o gerenciamento de pedidos. Consulte o Swagger da aplicação para confirmar os caminhos, os campos obrigatórios e os contratos efetivamente publicados.

### 1. Autenticação

Realiza o login e obtém um token de acesso.

- **Método:** `POST`
- **Endpoint:** `/auth/login`

Exemplo de requisição, caso o DTO de login utilize e-mail e senha:

```json
{
  "email": "admin@example.com",
  "password": "sua_senha"
}
```

O retorno contém o token JWT conforme o contrato implementado pelo módulo de autenticação.

### 2. Criar pedido

Cadastra um pedido com informações do cliente, endereço de entrega, previsão de entrega, status e itens.

- **Método:** `POST`
- **Endpoint:** `/orders`
- **Autenticação:** necessária quando exigida pelo controller.

Exemplo ilustrativo:

```json
{
  "orderNumber": "PED-TEST-001",
  "deliveryForecast": "2027-10-25T00:00:00.000Z",
  "customerName": "João Silva",
  "customerDocument": "12345678900",
  "deliveryAddress": "Rua das Flores, 100",
  "status": "PENDENTE",
  "items": [
    {
      "description": "Produto de exemplo",
      "price": 149.90
    }
  ]
}
```

Os campos de data, status, documento e itens devem respeitar as validações implementadas nos DTOs.

### 3. Listar pedidos

Retorna os pedidos ativos, com suporte a filtros e paginação.

- **Método:** `GET`
- **Endpoint:** `/orders`

Parâmetros de consulta disponíveis no serviço:

| Parâmetro | Finalidade |
|---|---|
| `orderNumber` | Filtra pelo número do pedido. |
| `status` | Filtra pelo status do pedido. |
| `startDate` | Define a data inicial do intervalo. |
| `endDate` | Define a data final do intervalo. |
| `page` | Define a página solicitada. |
| `limit` | Define a quantidade de registros por página. |

Exemplo:

```http
GET /orders?page=1&limit=10&status=PENDENTE
```

Filtro por data:

```http
GET /orders?startDate=2027-10-01&endDate=2027-10-31
```

A resposta contém os registros encontrados e as informações de paginação definidas pela implementação.

### 4. Consultar pedido

Retorna os detalhes de um pedido identificado por UUID.

- **Método:** `GET`
- **Endpoint:** `/orders/:id`

Exemplo:

```http
GET /orders/550e8400-e29b-41d4-a716-446655440000
```

Quando o pedido não existe ou já foi excluído logicamente, a API retorna uma resposta de não encontrado.

### 5. Atualizar pedido

Atualiza os dados de um pedido existente.

- **Método:** `PATCH` ou `PUT`, conforme a configuração do controller.
- **Endpoint:** `/orders/:id`

Exemplo ilustrativo de alteração:

```json
{
  "status": "EM_TRANSITO"
}
```

Os campos aceitos e a possibilidade de atualização parcial dependem do `UpdateOrderDto` e do método HTTP configurado.

### 6. Excluir pedido

Realiza a exclusão lógica de um pedido.

- **Método:** `DELETE`
- **Endpoint:** `/orders/:id`

Exemplo:

```http
DELETE /orders/550e8400-e29b-41d4-a716-446655440000
```

A exclusão lógica registra a data de remoção no campo `deletedAt`, preservando o registro no banco de dados. Pedidos excluídos deixam de aparecer nas consultas que consideram apenas registros ativos.

## Testes

O projeto utiliza Jest para execução dos testes automatizados.

Para executar todos os testes:

```bash
npm test -- --runInBand
```

Para executar os testes em modo de observação:

```bash
npm run test:watch
```

Para verificar a cobertura, caso o script esteja configurado:

```bash
npm run test:cov
```

Os testes devem validar os cenários de sucesso, os dados inválidos, os registros inexistentes e os erros esperados pelos serviços e controllers.

O processo de build do Docker também executa os testes antes de compilar a aplicação, conforme a configuração atual do `Dockerfile`.

## Estrutura do projeto

A estrutura geral segue a organização modular do NestJS:

```text
na-porta-api/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── auth/
│   ├── orders/
│   ├── prisma/
│   ├── common/
│   ├── app.module.ts
│   ├── main.ts
│   └── generated/
│       └── prisma/
├── test/
├── .env
├── .gitignore
├── compose.yaml
├── Dockerfile
├── package.json
├── prisma.config.ts
└── README.md
```

Os diretórios `auth`, `orders`, `prisma` e `common` representam as responsabilidades esperadas da aplicação. A estrutura exata pode variar conforme os módulos auxiliares presentes no repositório.

## Tratamento de erros

A API utiliza códigos HTTP para indicar o resultado das operações.

| Código | Significado |
|---|---|
| `200 OK` | Requisição processada com sucesso. |
| `201 Created` | Recurso criado com sucesso. |
| `204 No Content` | Operação concluída sem corpo de resposta, quando configurado. |
| `400 Bad Request` | Dados inválidos ou parâmetros incorretos. |
| `401 Unauthorized` | Autenticação ausente ou inválida. |
| `403 Forbidden` | Acesso não permitido. |
| `404 Not Found` | Recurso não encontrado. |
| `409 Conflict` | Conflito com dados existentes, como número de pedido duplicado. |
| `500 Internal Server Error` | Erro interno inesperado. |

As mensagens de validação e de negócio são apresentadas em português sempre que definidas pela aplicação.

## Autor e licença

Projeto desenvolvido por [Luiz Felipe Silva](https://github.com/luizfelipe9627).

- **GitHub:** https://github.com/luizfelipe9627
- **Licença:** MIT, caso o projeto contenha o arquivo `LICENSE` correspondente.

