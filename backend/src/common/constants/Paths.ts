import jetPaths from 'jet-paths';
import transformPaths from '../utils/transform-paths';

const Paths = {
    _: '/api',
    AI: {
        _: '/ai',
        Send: '/send'
    },
    User: {
        _: '/user',
        Login: '/login',
        byId: '/byId/:id',
        search: '/search/:query',
        Chats: {
            _: '/chats',
            ChatId: {
                _: '/:id',
                Messages: '/messages'
            }
        },
        Characters: '/characters'
    },
    Character: {
        _: '/character',
        ById: {
            _: '/byId/:id',
            derive: '/derive'
        },
        Search: '/search/:query',
        ByOwner: '/byUser/:userId'
    },
    Report: {
        _: '/report'
    }
} as const;

export const JetPaths = jetPaths(Paths);
export default Paths;
export const APIPaths = transformPaths(Paths)
