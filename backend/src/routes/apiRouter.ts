import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import aiRouter from './aiRouter';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

apiRouter.use(Paths.AI._, aiRouter)

/******************************************************************************
                                Export
******************************************************************************/

export default apiRouter;
