import jetEnv, { num, str } from 'jet-env';
import tspo from 'tspo';

/******************************************************************************
                                 Constants
******************************************************************************/

// NOTE: These need to match the names of your ".env" files
export const NodeEnvs = {
  DEV: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
} as const;

/******************************************************************************
                                 Setup
******************************************************************************/

const EnvVars = jetEnv({
  NodeEnv: (v) => tspo.isValue(NodeEnvs, v),
  Port: num,
  OpenRouterAPIKey: str,
  OpenRouterModel: str,
  DatabaseUrl: str,
  JwtSecret: str,
  FrontendUrl: str
});

/******************************************************************************
                            Export default
******************************************************************************/

export default EnvVars;
