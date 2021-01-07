import { NextFunction, Request, Response } from "express";
import { exec } from 'child_process';
import enviroments from '../config/enviroments';

export default {
    async index(req: Request, res: Response, next: NextFunction) {
        exec(`ls ${enviroments.dirFiles} -d`, (error, stdout, stderr) => {
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
    },

}