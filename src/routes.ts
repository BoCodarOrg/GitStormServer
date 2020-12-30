import express, { NextFunction, Request, Response } from 'express';

import { spawn } from 'child_process';
import parseToObject from './util/parseToObject';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    const branch = spawn('git', ['branch']);
    branch.stdout.on('data', (data: any) => {
        branch.on('close', (code) => console.log('branch::', code));
        return res.render('home', { data: data.toString().trim().split('\n') });

    });
})


router.get('/branch/:branch', (req: Request, res: Response, next: NextFunction) => {
    const commits = spawn('git', ['log', req.params.branch, '--pretty=format:{"commit":"%h","date":"%ad","message":"%s","author":"%an", "email":"%ce"}', '--date=short'])
    commits.stdout.on('data', data => {
        commits.on('close', (code) => console.log('commit::', code));
        const result = parseToObject(`${data}`);
        return res.render('commit', { data: result, branch: req.params.branch });
    })
});

router.get('/pull-request/:branch', (req: Request, res: Response, next: NextFunction) => {
    const log = spawn('git', ['log', req.params.branch ,'--pretty=format:%d']);
    log.stdout.on('data', data => {
        const branch = data.toString().split('\n')[0];
        const parent = branch.split(',')[1].replace(')', '');
        return res.render('pullRequest', { branch: req.params.branch, toBranch: parent });
    });
})

export default router;