import { Router } from 'express';

import aiRouter from './aiRouter';
import userRouter from './userRouter';
import characterRouter from './characterRouter';
import chatRouter from './chatRouter';
import reportRouter from './reportRouter';
import fileRouter from './fileRouter';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

apiRouter.use(aiRouter)
apiRouter.use(userRouter)
apiRouter.use(characterRouter)
apiRouter.use(chatRouter)
apiRouter.use(reportRouter)
apiRouter.use(fileRouter)

/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
