import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import aiRouter from './aiRouter';
import messageRouter from './messageRouter';
import promptRouter from './promptRouter'; 

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

apiRouter.use(Paths.AI._, aiRouter)
apiRouter.use(Paths.Messages._, messageRouter);
apiRouter.use(Paths.Prompts._, promptRouter);

/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
