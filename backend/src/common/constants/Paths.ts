import jetPaths from 'jet-paths';

const Paths = {
    _: '/api',
    AI: {
        _: '/ai',
        Send: '/send'
    },
    Chat: {
        _: '/chat',
        ChatUUID: '/:chatUUID'
    },
    User: {
        _: '/user',
        Login: '/login'
    }
} as const;

export const JetPaths = jetPaths(Paths);
export default Paths;
