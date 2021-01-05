import express, { NextFunction, Request, Response } from 'express';

import { exec } from 'child_process';
import parseToObject from './util/parseToObject';
import enviroments from './config/enviroments';
import { stderr, stdout } from 'process';

const router = express.Router();

//Take Repositories
router.get('/', (req: Request, res: Response, next: NextFunction) => {

    exec(`find ${enviroments.dirFiles} -name ".git"`, (error, stdout, stderr) => {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }

        return res.json({
            name: 'repositories',
            data: stdout.toString()
                .trim()
                .split('\n')
                .map(item => ({
                    name:
                        item.replace(`${enviroments.dirFiles}`, '')
                            .replace('/.git', '')
                }))
        });
    });
})

//Take Branchs
router.get('/:repository', (req: Request, res: Response, next: NextFunction) => {
    exec(`cd ${enviroments.dirFiles}/${req.params.repository} && git branch`, (error, stdout, stderr) => {
        return res.json({ data: stdout.toString().trim().split('\n').map(item => ({ name: item })), repo: req.params.repository });
    })
})


//Take Commits
router.get('/:repository/:branch/commits', (req: Request, res: Response, next: NextFunction) => {
    const cmd = `cd ${enviroments.dirFiles}/${req.params.repository} && git log ${req.params.branch} --pretty=format:'{"commit":"%h","date":"%ad","message":"%s","author":"%an", "email":"%ce"}' --date=short`;
    exec(cmd, (error, stdout, stderr) => {
        if (!error) {
            const result = parseToObject(`${stdout}`);
            return res.json({ data: result, branch: req.params.branch });
        } else {
            console.log('error::', error);
            return res.send(`error::${error}`)
        }

    });
});

//Pull requests
router.post('/diff/:repository/:id', (req: Request, res: Response, next: NextFunction) => {
    const { origin, destination } = req.body;
    const cmd = `cd ${enviroments.dirFiles}/${req.params.repository} && git diff ${origin.trim().replace('*','')} ${destination.trim().replace('*','')}`
    exec(cmd, (error, stdout, stderr) => {
        if (!error) {
            return res.json({ data: stdout.toString().trim().split('\n') })
        } else {
            return res.json({ data: stderr })
        }
    })
});

export default router;