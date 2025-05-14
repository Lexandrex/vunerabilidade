# 🛡️ Teste de Vulnerabilidade – Segurança da Informação

**Aluno:** Alexandre Sebastian Basso Muller  
**Disciplina:** Segurança da Informação  
**Professor:** Claudinei Dias  
 

---

## 📌 Escopo

Este projeto tem como objetivo demonstrar vulnerabilidades comuns em aplicações web e as soluções implementadas para mitigá-las.

A aplicação desenvolvida permite operações de autenticação e funcionalidades CRUD via API Express.js, com banco de dados MySQL local (XAMPP) e uma interface HTML simples.

---

## 🧪 Testes Realizados – Versão 1.0 (Vulnerável)

| Teste | Código Malicioso                                | Resultado Obtido              | Observação                                     |
|-------|--------------------------------------------------|-------------------------------|------------------------------------------------|
| 001   | `' OR 1=1 --`                                     | Usuário fantasma criado       | Injetado no campo de login/cadastro            |
| 002   | `<script>alert('XSS executado!')</script>`        | Erro interno no banco         | Tentativa de XSS nos campos de cadastro        |
| 003   | Página HTML maliciosa                             | Dados de login capturados     | Coleta de e-mail e senha do usuário            |

### 🧾 Descrição dos Testes

#### Teste 001: SQL Injection
- Injeção de `' OR 1=1 --` nos campos de login e cadastro.
- **Resultado:** criação de um "usuário fantasma" com campos nulos, revelando falha crítica de SQL Injection.

#### Teste 002: XSS
- Inserção de script malicioso em campos de cadastro.
- **Resultado:** falha na criação do usuário, com travamento interno no banco.

#### Teste 003: HTML Malicioso
- Criação de página falsa para capturar credenciais.
- **Resultado:** coleta de e-mail e senha foi bem-sucedida, sem proteção.

---

## 🔐 Versão 2.0 – Correções Implementadas

A segunda versão da aplicação recebeu correções nas principais vulnerabilidades:

- ✅ Uso de **prepared statements** com `mysql2`/`sequelize`
- ✅ **Criptografia de senhas** com `bcrypt`
- ✅ **JWT** para autenticação e autorização segura
- ✅ Tratamento de entradas para prevenir **XSS**
- ✅ Variáveis sensíveis com `dotenv`

### ✅ Exemplo de Prepared Statement

```js
const [result] = await db.execute(
  'INSERT INTO usuario (username, email, password) VALUES (?, ?, ?)',
  [username, email, hashedPassword]
);
```

### ✅ Exemplo de Verificação de Token JWT

```js
const token = localStorage.getItem('token');

fetch(apiUrl, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🔁 Retestes – Versão 2.0

| Teste | Resultado Corrigido                                 | Observação                                     |
|-------|------------------------------------------------------|------------------------------------------------|
| 001   | Comando tratado como string, sem efeito nocivo       | SQL Injection corrigido                        |
| 002   | Script inofensivo, sem travamento                    | XSS corrigido                                  |
| 003   | Coleta de dados bloqueada via token e segurança      | Captura via HTML malicioso foi evitada         |

---

## 🧩 Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **MySQL (via XAMPP)**
- **Sequelize**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **dotenv**
- **HTML + JavaScript (interface simples)**

---

## ⚙️ Instalação e Execução Local

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Instalar Dependências

Certifique-se de ter o [Node.js](https://nodejs.org) instalado. Em seguida, execute:

```bash
npm install
```

As dependências instaladas serão:

```json
"bcrypt": "^6.0.0",
"body-parser": "^2.2.0",
"cors": "^2.8.5",
"dotenv": "^16.5.0",
"express": "^5.1.0",
"jsonwebtoken": "^9.0.2",
"mysql2": "^3.14.1",
"sequelize": "^6.37.7"
```

### 3. Configurar Banco de Dados (XAMPP)

- Inicie o **MySQL via XAMPP**
- Crie um banco de dados, por exemplo: `seguranca_db`
- Crie uma tabela `usuario` com os seguintes campos:

```sql
CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL
);
```

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
JWT_SECRET=SEGREDO
```

### 5. Iniciar o Servidor

```bash
node index.js
```

A API estará disponível em: `http://localhost:3000`

---

## 🌐 Interface HTML

Você pode utilizar qualquer navegador para abrir a interface simples feita em HTML. Basta abrir o arquivo `index.html` no navegador ou configurar um servidor local como Live Server (VSCode).

---

## ✅ Conclusão

A aplicação evoluiu de um sistema vulnerável para uma base segura com:

- Prevenção de SQL Injection
- Proteção contra XSS
- Autenticação segura com JWT
- Criptografia de senhas com bcrypt

---
