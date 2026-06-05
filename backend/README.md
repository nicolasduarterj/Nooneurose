## Responsáveis pelo back-end (em ordem alfabética):
- Lucas Batista
- Nicolas Duarte

# Rotas

### /api/user
```
POST:
    Cria um usuário
    Content-Type: application/json

    Estrutura do body: {
        email: string,
        name: string,
        password: string
    }

    Estrutura da resposta: {
        id: number,
        name: string,
        email: string,
        password: string //HASH
    }
```

### /api/user/login
```
POST:
    Loga
    Content-Type: application/json

    Estrutura do body: {
        email: string,
        password: string
    }

    Estrutura da resposa: {
        token: string, //Armazenem no local storage
        name: string
    }
```

### /api/user/byId/:id
GET: Obtém as informações de um usuário.

    Estrutura da resposta: {
        id: number
        name: string
        email: string
    }

OBS: Para todos os pedidos abaixo, insira a string "Bearer \<TOKEN DA RESPOSTA\>" como valor do header Authorization

### /api/character
Gerenciamento de personagens
```
POST:
    Cria um personagem
    Content-Type: application/json

    Estrutura do body: {
        name: string,
        description: string
    }

    Estrutura da resposta: {
        id: number
        name: string
        description: string
        isGloballyChangeable: boolean
        isPrivatelyChangeable: boolean
        ownerId: number
        imageURL: string | null
    }
```

### /api/character/byId/:id
```
GET:
    Retorna um personagem.
    Estrutura da resposta: {
        id: number
        name: string
        description: string
        isGloballyChangeable: boolean
        isPrivatelyChangeable: boolean
        ownerId: number
        imageURL: string | null
    }

PATCH:
    Altera um personagem
    Estrutura do request: {
        name?: string
        description?: string
        isGloballyChangeable?: boolean
        isPrivatelyChangeable?: boolean
        imageURL?: string | null
    }
    Estrutura da resposta: ver resposta do POST

```

### /api/character/search/:query

GET:

    Procura por personagens pelo nome
    Estrutura da resposta: {
        id: number
        name: string
        description: string
        isGloballyChangeable: boolean
        isPrivatelyChangeable: boolean
        ownerId: number
        imageURL: string | null
    }
```

### /api/user/chats
Gerencia chats do usuário
```
POST:

    Cria um chat
    Content-Type: application/json

    Estrutura do body: {
        characterId: number //id do personagem
    }

    Estrutura da resposta: {
        id: number
        ownerId: number
        characterId: number
    }

GET:

    Retorna todos os chats do usuário

    Estrutura da resposta: {
        id: number
        ownerId: number
        characterId: number
    }[]

### /api/user/chats/:id
```
GET:

    Retorna os detalhes do chat

    Estrutura da resposta: {
        id: number
        ownerId: number
        characterId: number
    }
```

### /api/user/chats/:id/messages
```
GET:

    Retorna todas as mensagens do chat

    Estrutura da resposta: {
        id: number
        content: string
        chatId: number
        isIncludedInPrompt: boolean
        source: 'assistant' | 'user'
        timestamp: Date
    }

### /api/user/characters

GET:

    Retorna todos os personagens do usuário
    Estrutura da resposta: {
        id: number
        name: string
        description: string
        isGloballyChangeable: boolean
        isPrivatelyChangeable: boolean
        ownerId: number
        imageURL: string | null
    }
```
### /api/ai/send

    Envia uma mensagem para a IA

    POST:
    Content-Type: application/json

    Estrutura do body: {
        message: string, // mensagem do usuário
        chatId: string // UUID do chat
    }

    Estrutura da resposta (se 200): {
        response: string // resposta da IA
    }

    Erros: 400 (parâmetros faltando), 500 (problema com o provedor de IA)
