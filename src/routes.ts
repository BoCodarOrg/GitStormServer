import express, { NextFunction, Request, Response } from 'express';

import { spawn } from 'child_process';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const branch = spawn('git', ['branch']);
    branch.stdout.on('data', (data: any) => {
        return res.render('home', { data: data.toString().trim().split('\n') });

    });
})


router.get('/:branch', async (req: Request, res: Response, next: NextFunction) => {
    const commits = spawn('git', ['log', req.params.branch, '--pretty=oneline','--abbrev-commit'])
    commits.stdout.on('data', data => {
        console.log(data.toString());
        return res.render('home', { data: data.toString().trim().split('\n') });
    })
});

export default router;