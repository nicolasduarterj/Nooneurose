import { Router } from 'express';

import aiRouter from './aiRouter';
import userRouter from './userRouter';
import characterRouter from './characterRouter';
import chatRouter from './chatRouter';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

apiRouter.use(aiRouter)
apiRouter.use(userRouter)
apiRouter.use(characterRouter)
apiRouter.use(chatRouter)

/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
