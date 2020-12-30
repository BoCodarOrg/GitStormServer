import express, { NextFunction, Request, Response } from 'express';

import { exec } from 'child_process';
import parseToObject from './util/parseToObject';
import enviroments from './config/enviroments';
import { stderr, stdout } from 'process';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {

    exec(`find ${enviroments.dirFiles} -name ".git"`, (error, stdout, stderr) => {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }

        console.log('Child Process STDOUT: ' + stdout);
        console.error('Child Process STDERR: ' + stderr);

        return res.render('repositories', {
            data: stdout.toString()
                .trim()
                .split('\n')
                .map(item =>
                    item.replace(`${enviroments.dirFiles}`, '')
                        .replace('/.git', ''))
        });
    });
})

router.get('/:repository', (req: Request, res: Response, next: NextFunction) => {
    exec(`cd ${enviroments.dirFiles}/${req.params.repository} && git branch`, (error, stdout, stderr) => {
        return res.render('branches', { data: stdout.toString().trim().split('\n'), repo: req.params.repository });
    })
})


router.get('/:repository/:branch/commits', (req: Request, res: Response, next: NextFunction) => {
    const cmd = `cd ${enviroments.dirFiles}/${req.params.repository} && git log ${req.params.branch} --pretty=format:'{"commit":"%h","date":"%ad","message":"%s","author":"%an", "email":"%ce"}' --date=short`;
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

export default router;