import express, { NextFunction, Request, Response } from 'express';

import { exec } from 'child_process';
import parseToObject from './util/parseToObject';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    exec('git branch', (error, stdout, stderr) => {
        return res.render('home', { data: stdout.toString().trim().split('\n') });
    })
})


router.get('/branch/:branch', (req: Request, res: Response, next: NextFunction) => {
    const cmd = `git log ${req.params.branch} --pretty=format:'{"commit":"%h","date":"%ad","message":"%s","author":"%an", "email":"%ce"}' --date=short`;
    exec(cmd, (error, stdout, stderr) => {
        if (!error) {
            const result = parseToObject(`${stdout}`);
            return res.render('commit', { data: result, branch: req.params.branch });
        } else {
            console.log('error::', error);
            return res.send(`error::${error}`)
        }

    });
});

router.get('/pull-request/:branch', (req: Request, res: Response, next: NextFunction) => {
    const cmd = 'git branch';
    exec(cmd, (error, stdout, stderr) => {
        return res.render('pullRequest', {
            branch: req.params.branch, branches: stdout.toString().trim().split('\n')
        });
    })
})

export default router;