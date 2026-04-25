## About

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).

## Available Scripts

### `npm run clean-install`

Remove the existing `node_modules/` folder, `package-lock.json`, and reinstall all library modules.

### `npm run dev` 

Run the server in development with hot reloading and browser refresh (see `package.json` for all `npm run dev` variations)<br/>

**IMPORTANT** development mode uses `swc` for performance reasons which DOES NOT check for typescript errors. Run `npm run type-check` to check for type errors. NOTE: you should use your IDE to prevent most type errors.

### `npm test`

Run unit-tests with <a href="https://vitest.dev/guide/">vitest</a>.

### `npm run lint`

Check for linting errors.

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm run type-check`

Check for typescript errors.

## Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`.

## Responsáveis pelo back-end (em ordem alfabética):
- Lucas Batista
- Nicolas Duarte

# Rotas

### /api/ai/send
Envia uma mensagem para a IA
```
POST:
    Content-Type: application/json

    Estrutura do body: {
        message: string, // mensagem do usuário
        chatUUID: string // UUID do chat
    }

    Estrutura da resposta (se 200): {
        response: string // resposta da IA
    }

    Erros: 400 (parâmetros faltando), 500 (problema com o provedor de IA)
```

### /api/chat/\[chatUUID\]
Lista todas as mensagens e respostas de um chat
```
GET:
    Content-Type: application/json

    Estrutura da resposta: [
        {
            message: string, // Mensagem do usuário
            response: string | null // Resposta da IA
        }
    ]
```
