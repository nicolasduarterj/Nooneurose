import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import aiRouter from './aiRouter';
import chatRouter from './chatRouter';
import userRouter from './userRouter';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

apiRouter.use(Paths.AI._, aiRouter)
apiRouter.use(Paths.Chat._, chatRouter)
apiRouter.use(Paths.User._, userRouter)

/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
