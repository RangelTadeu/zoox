<h1 align="center">
    <img src="https://ik.imagekit.io/rangel/zoox-logo_kZDBKJf-k.png">
</h1>

---

# Índice

- [Sobre](#-sobre)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Segurança](#-segurança)
- [Como Executar](#-como-executar)
- [Rotas](#-rotas)
- [Executando Testes](#-executando-testes)

---

## Sobre

Projeto realizado para atender ao desafio enviado pela **Zoox Smart Data**.

---

## Tecnologias Utilizadas

- [cors](https://github.com/expressjs/cors)
- [docker](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/)
- [express](https://github.com/expressjs/express)
- [express-brute](https://github.com/AdamPflug/express-brute)
- [express-brute-redis](https://github.com/AdamPflug/express-brute-redis)
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit)
- [helmet](https://github.com/helmetjs/helmet)
- [ioredis](https://github.com/luin/ioredis)
- [jest](https://github.com/facebook/jest)
- [mongoose](https://mongoosejs.com/)
- [rate-limit-redis](https://github.com/wyattjoh/rate-limit-redis)
- [redis](https://redis.io/)
- [supertest](https://github.com/visionmedia/supertest)
- [yup](https://github.com/jquense/yup)

---

## Segurança

Todas as rotas necessitam de autorização. Authorization: Bearer **zoox**, ou o valor que estiver na variável de ambiente **APP_SECRET**. No **Insomnia** o token pode ser definido em **Auth > Bearer Token**.

### [cors](https://github.com/expressjs/cors)

Define quais as origens de URLs que a API aceita requisições.

```js
this.express.use(
  cors({
    origin: process.env.URL_FRONT || false,
  })
);
```

### [express-brute](https://github.com/AdamPflug/express-brute)

Proteção contra força bruta para rotas. Incrementará um atraso na resposta para solicitações em sequência semelhante.

```js
const bruteStore = new BruteRedis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});
const bruteForce = new Brute(bruteStore);

routes.post("/states", bruteForce.prevent, StateController.store);
```

### [express-rate-limit](https://github.com/nfriedly/express-rate-limit)

Define um limite de requisições que um usuário pode fazer em um determinado período de tempo sem ser bloqueado pela API.

```js
if (process.env.NODE_ENV !== "development") {
  this.express.use(
    new RateLimit({
      store: new RateLimitRedis({
        client: redis.createClient({
          host: process.env.REDIS_HOST || "localhost",
          port: process.env.REDIS_PORT || 6379,
        }),
      }),
      windowMs: 1000 * 60,
      max: 100,
    }) // permite 100 requisições por usuário por minuto
  );
}
```

### [helmet](https://github.com/helmetjs/helmet)

Adiciona inúmeros HTTP headers que auxiliam na proteção da API.

```js
this.express.use(helmet());
```

---

## Como Executar

```bash

    # Clonar o repositório.
    $ git clone https://github.com/RangelTadeu/zoox

    # Entrar no diretório.
    $ cd zoox

    # Baixar imagens e executar os containers.
    # Api será exposta na porta 3000.
    $ sudo docker-compose up
```

---

## Rotas

Todas as rotas necessitam de autorização. Authorization: Bearer **zoox**, ou o valor que estiver na variável de ambiente **APP_SECRET**. No **Insomnia** o token pode ser definido em **Auth > Bearer Token**.

### **- GET /states**

Lista os estados.

**URL**

```bash
http://localhost:3000/states/
```

**Informações de Recursos**

| Parâmetro           | Tipo |
| ------------------- | ---- |
| Formato de resposta | JSON |
| Formato de entrada  | JSON |
| Requer Autenticação | Sim  |

**Parâmetros**

| Parâmetro    | Tipo   | Descrição      | Obrigatório? |
| ------------ | ------ | -------------- | ------------ |
| name         | String | Nome do estado | Não          |
| abbreviation | String | UF do estado   | Não          |

### **- POST /states**

Inclui um estado no MongoDb.

**URL**

```bash
http://localhost:3000/states/
```

**Informações de Recursos**

| Parâmetro           | Tipo |
| ------------------- | ---- |
| Formato de resposta | JSON |
| Formato de entrada  | JSON |
| Requer Autenticação | Sim  |

**Parâmetros**

| Parâmetro    | Tipo   | Descrição      | Obrigatório? |
| ------------ | ------ | -------------- | ------------ |
| name         | String | Nome do estado | Sim          |
| abbreviation | String | UF do estado   | Sim          |

### **- PUT /states**

Atualiza um estado.

**URL**

```bash
http://localhost:3000/states/
```

**Informações de Recursos**

| Parâmetro           | Tipo |
| ------------------- | ---- |
| Formato de resposta | JSON |
| Formato de entrada  | JSON |
| Requer Autenticação | Sim  |

**Parâmetros**

| Parâmetro    | Tipo     | Descrição                     | Obrigatório |
| ------------ | -------- | ----------------------------- | ----------- |
| id           | ObjectId | Identificador único do estado | Sim         |
| name         | String   | Nome do estado                | Sim         |
| abbreviation | String   | UF do estado                  | Sim         |

### **- DELETE /states**

Exclui um estado.

**URL**

```bash
http://localhost:3000/states/:id/
```

**Informações de Recursos**

| Parâmetro           | Tipo         |
| ------------------- | ------------ |
| Formato de resposta | JSON         |
| Formato de entrada  | Query Params |
| Requer Autenticação | Sim          |

**Parâmetros**

| Parâmetro | Tipo     | Descrição                     | Obrigatório |
| --------- | -------- | ----------------------------- | ----------- |
| Id        | ObjectId | Identificador único do estado | Sim         |

### **- GET /cities**

Lista as cidades.

**URL**

```bash
http://localhost:3000/cities/
```

**Informações de Recursos**

| Parâmetro           | Tipo |
| ------------------- | ---- |
| Formato de resposta | JSON |
| Formato de entrada  | JSON |
| Requer Autenticação | Sim  |

**Parâmetros**

| Parâmetro | Tipo   | Descrição      | Obrigatório? |
| --------- | ------ | -------------- | ------------ |
| name      | String | Nome da cidade | Não          |

### **- POST /cities**

Inclui uma cidade no MongoDb.

**URL**

```bash
http://localhost:3000/:id/cities/
```

**Informações de Recursos**

| Parâmetro           | Tipo |
| ------------------- | ---- |
| Formato de resposta | JSON |
| Formato de entrada  | JSON |
| Requer Autenticação | Sim  |

**Parâmetros**

| Parâmetro | Tipo     | Descrição                     | Obrigatório? |
| --------- | -------- | ----------------------------- | ------------ |
| name      | String   | Nome da cidade                | Sim          |
| id        | ObjectId | Identificador único do estado | Sim          |

### **- PUT /cities**

Atualiza uma cidade.

**URL**

```bash
http://localhost:3000/cities/
```

**Informações de Recursos**

| Parâmetro           | Tipo |
| ------------------- | ---- |
| Formato de resposta | JSON |
| Formato de entrada  | JSON |
| Requer Autenticação | Sim  |

**Parâmetros**

| Parâmetro | Tipo     | Descrição                     | Obrigatório |
| --------- | -------- | ----------------------------- | ----------- |
| id        | ObjectId | Identificador único da cidade | Sim         |
| name      | String   | Nome da cidade                | Sim         |

### **- DELETE /cities**

Exclui uma cidade.

**URL**

```bash
http://localhost:3000/cities/:id/
```

**Informações de Recursos**

| Parâmetro           | Tipo         |
| ------------------- | ------------ |
| Formato de resposta | JSON         |
| Formato de entrada  | Query Params |
| Requer Autenticação | Sim          |

**Parâmetros**

| Parâmetro | Tipo     | Descrição                     | Obrigatório |
| --------- | -------- | ----------------------------- | ----------- |
| Id        | ObjectId | Identificador único da cidade | Sim         |

---

## Executando Testes

```bash
    # Entrar no diretório.
    $ cd zoox

    # Tenha certeza de que as portas 27018 e 6380 estão disponíveis.
    $ sudo yarn test
```
