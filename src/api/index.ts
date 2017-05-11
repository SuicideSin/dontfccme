import * as express from 'express'
export let router = express.Router();

import { FccQueueRouter } from './fcc-queue'

router.use('/fcc-queue', FccQueueRouter);

export let ApiRouter = router
