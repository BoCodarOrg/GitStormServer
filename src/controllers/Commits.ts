import { NextFunction, Request, Response } from "express";

import { exec } from 'child_process';
import parseToObject from '../util/parseToObject';
import { CHANGE_DIRECTORY } from "../util/changeDirectory";

export default {
    async index(req: Request, res: Response, next: NextFunction) {
        const cmd = `${CHANGE_DIRECTORY(req.params.repository)} && git log ${req.params.branch} --pretty=format:'{"commit":"%h","date":"%ad","message":"%s","author":"%an", "email":"%ce"}' --date=short`;
        exec(cmd, (error, stdout, stderr) => {
            if (!error) {
                const result = parseToObject(`${stdout}`);
                return res.json({ data: result, branch: req.params.branch });
            } else {
                console.log('error::', error);
                return res.send(`error::${error}`)
            }

        });
    }
}