import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import logger from 'jet-logger';
import morgan from 'morgan';

import Paths from '@src/common/constants/Paths';
import { RouteError } from '@src/common/utils/route-errors';
import BaseRouter from '@src/routes/apiRouter';

import EnvVars, { NodeEnvs } from './common/constants/env';
import AIServiceError from './common/types/AIServiceError';
import DatabaseError from './common/types/DatabaseError';
import PromptServiceError from './common/types/PromptServiceError';

/******************************************************************************
                                Setup
******************************************************************************/

const app = express();

// **** Middleware **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (EnvVars.NodeEnv === NodeEnvs.PRODUCTION) {
  app.use(cors({
    origin: EnvVars.FrontendUrl,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
} else {
  app.use(cors());
}

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.DEV) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.PRODUCTION) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (EnvVars.NodeEnv !== NodeEnvs.TEST.valueOf()) {
    logger.err(err, true);
  }
  if (err instanceof RouteError) {
    res.status(err.status).json({ error: err.message });
  }
  else if (err instanceof AIServiceError) {
    res.status(500).json({ error: 'Problem with our AI provider' })
  }
  else if (err instanceof DatabaseError) {
    res.status(500).json({ error: 'Problem with our database'})
  }
  else if (err instanceof PromptServiceError) {
    res.status(500).json({ error: 'Problem obtaining prompt' })
  }
  else {
    res.status(500).json({ error: 'An unknown error ocurred' })
  }
  return next(err);
});

/******************************************************************************
                                Export default
******************************************************************************/

export default app;
