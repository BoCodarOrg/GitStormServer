import { NextFunction, Request, Response } from "express";

import { exec } from 'child_process';
import { CHANGE_DIRECTORY } from "../util/changeDirectory";

export default {
    async index(req: Request, res: Response, next: NextFunction) {
        exec(`${CHANGE_DIRECTORY(req.params.repository)} && git branch`, (error, stdout, stderr) => {
            return res.json({ data: stdout.toString().trim().split('\n').map(item => ({ name: item.replace('*', '').trim() })), repo: req.params.repository });
        })
    }
}