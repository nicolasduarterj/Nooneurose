import jetPaths from 'jet-paths';

const Paths = {
    _: '/api',
    AI: {
        _: '/ai',
        Send: '/send'
    },
    Chat: {
        _: '/chat',
        ChatId: {
            _: '/byId/:id',
            Messages: '/byId/:id/messages'
        }
    },
    User: {
        _: '/user',
        Login: '/login'
    },
    Character: {
        _: '/character',
        ById: '/byId/:id',
    }
} as const;

export const JetPaths = jetPaths(Paths);
export default Paths;
