# TechX - Aplicação de Gerenciamento de Tarefas

## Descrição do Projeto

Este projeto é uma aplicação web full stack de um gerenciador de tarefas (to-do list) simples e eficiente, permitindo que usuários organizem suas tarefas diárias.

### Funcionalidades Principais:
- **Frontend:**
  - Interface desenvolvida com Angular 18 e Angular Material.
  - Páginas de login e registro.
  - Botões para criar tarefa, editar, deletar e logout.
- **Backend:** API RESTful construída com NestJS e TypeScript, incluindo operações CRUD para tarefas, autenticação de usuários com JWT, e autorização baseada em papéis (usuários normais e admin).
- **Autenticação e Autorização:**
  - Criação de usuários (register) com senha hasheada via bcrypt.
  - Login para gerar token JWT.
  - Tarefas associadas a usuários: Usuários normais só interagem com suas próprias tarefas; admins podem interagir com todas.
- **Banco de Dados:** MySQL para armazenar usuários e tarefas, gerenciado com MikroORM (ORM TypeScript-first).
- **Seeder e Migrações:** Um seeder inicial cria um usuário admin (username: "admin", password: "admin"). Migrações automáticas para schema.
- **Documentação da API:** Swagger integrado para documentar todas as rotas, acessível em `http://localhost:3000/api`.
- **Estrutura:** Monorepo com pastas `backend` e `frontend`(a ser implementado). Versionamento com Git, Docker para containerização.

O projeto segue boas práticas: código modular, validação com DTOs (class-validator), guards para auth/admin, e commits incrementais

### Tecnologias Utilizadas (Frontend):
- Angular 18: Framework para construção da interface.
- Angular Material: Componentes de UI (cards, botões, formulários, modal, snackbar).
- TypeScript: Tipagem estática.
- Docker e Docker Compose para ambiente de desenvolvimento/produção.
- Yarn como gerenciador de pacotes.

### Tecnologias Utilizadas (Backend):
- Node.js com NestJS (framework para API RESTful).
- TypeScript para tipagem estática.
- MikroORM para ORM e interações com o banco (MySQL).
- JWT e Passport para autenticação.
- Bcrypt para hash de senhas.
- Swagger para documentação da API.
- Docker e Docker Compose para ambiente de desenvolvimento/produção.
- Yarn como gerenciador de pacotes.

## Pré-requisitos

- Node.js v20+.
- Yarn.
- Docker e Docker Compose (para execução containerizada).
- Git.

## Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/miguelleite21/techX
   cd techX
   ```
2. Backend:
   - Navegue até o backend e instale dependências:
      ```
      cd backend
      yarn install
      ```
   - Configure o arquivo `.env` no backend (copie o ".env.exemple" ou crie um baseado em exemplo abaixo):
      ```
      DB_HOST=172.18.0.1
      DB_PORT=3306
      DB_USER=root
      DB_PASS=1234
      DB_NAME=techx_todo
      JWT_SECRET=techx (Mude para um secret forte em produção)
      ```
2. Frontend:
   - Navegue até o frontend e instale dependências:
      ```
      cd frontend
      yarn install
      ```
## Execução Local

### Banco de dados
   1. Inicie o banco MySQL.
      ```
      docker compose up --build -d db
      ```
   - Isso inicia o MySQL (db).
### Backend
   1. Rode migrações e seeder:
      ```
      cd backend
      yarn mikro-orm migration:up
      yarn mikro-orm seeder:run
      ```
   2. Inicie o servidor backend:
      ```
      yarn start:dev
      ```
   - A API estará disponível em `http://localhost:3000`.
   - Swagger (documentação das rotas): `http://localhost:3000/api`.
### Frontend
   1. Inicie o servidor frontend:
      ```
      cd frontend
      yarn dev
      ```
   - O frontend estará disponível em `http://localhost:4200`.

## Execução com Docker

1. No diretório raiz (`techX/`), rode:
   ```
   docker compose up --build -d
   ```
- Isso inicia o MySQL (db), o frontend e o backend.
- Migrações e seeder rodam automaticamente no startup do backend.
- Acesse o frontend em `http://localhost:4200`.
- Acesse a API em `http://localhost:3000`.
- Swagger: `http://localhost:3000/api`.

2. Para parar:
   ```
   docker compose down
   ```

3. Logs para depuração:
   ```
   docker compose logs backend
   docker compose logs frontend
   ```

## Documentação da API (Swagger)

A API é documentada automaticamente com Swagger. Acesse `http://localhost:3000/api` para ver todas as rotas, schemas e testar endpoints diretamente.

### Rotas Principais:
- **Auth:**
  - `POST /auth/register`: Cria um novo usuário (não admin).
  - `POST /auth/login`: Gera token JWT.
  - `PATCH /auth/profile`: Atualiza username ou senha.
- **Tasks (requer auth via JWT):**
  - `POST /tasks`: Cria tarefa (associada ao user logado).
  - `GET /tasks`: Lista tarefas (próprias ou todas se admin).
  - `GET /tasks/:id`: Busca uma tarefa.
  - `PUT /tasks/:id`: Atualiza tarefa.
  - `DELETE /tasks/:id`: Remove tarefa.

Todos os endpoints estão protegidos por guards: JWT para auth, e lógica interna para ownership/admin.

## Migrações e Seeders

- Crie migrações novas: `yarn mikro-orm migration:create --name NomeDaMigracao`.
- Rode migrações: `yarn mikro-orm migration:up`.
- Rode seeder: `yarn mikro-orm seeder:run`.
