import jetPaths from 'jet-paths';

const Paths = {
  _: '/api',
  AI: {
    _: '/ai',
    Send: '/send'
  },
  Messages: {
    _: '/messages',
    Include: '/:id/include',
  },
  Prompts: {
    _: '/prompts',
    Latest: '/latest',
    Generate: '/generate',
  },
} as const;

export const JetPaths = jetPaths(Paths);
export default Paths;
