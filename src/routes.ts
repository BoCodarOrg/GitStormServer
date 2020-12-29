import express, { NextFunction, Request, Response } from 'express';

import { spawn } from 'child_process';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const ls = spawn('git', ['branch']);
    ls.stdout.on('data', (data: any) => {
        console.log(data);
    });
    return res.render('home', { data: [] });

})

export default router;