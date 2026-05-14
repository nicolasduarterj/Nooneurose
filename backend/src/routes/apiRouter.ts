import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import aiRouter from './aiRouter';
import userRouter from './userRouter';
import characterRouter from './characterRouter';
import chatRouter from './chatRouter';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

apiRouter.use(Paths.AI._, aiRouter)
apiRouter.use(Paths.User._, userRouter)
apiRouter.use(Paths.Character._, characterRouter)
apiRouter.use(Paths.Chat._, chatRouter)

/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
