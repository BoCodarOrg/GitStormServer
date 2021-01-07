import { NextFunction, Request, Response } from "express";

import { exec } from 'child_process';
import { CHANGE_DIRECTORY } from "../util/changeDirectory";

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default {
    async index(req: Request, res: Response, next: NextFunction) {

    },

    async store(req: Request, res: Response, next: NextFunction) {
        const { origin, destination } = req.body;
        const cmdMerge = `${CHANGE_DIRECTORY(req.params.repository)} && git checkout ${destination.trim().replace('*', '')} && git merge ${origin.trim().replace('*', '')}`;

        exec(cmdMerge, (errorMerge, resultMerge, stderrMerge) => {
            const cmd = `${CHANGE_DIRECTORY(req.params.repository)} && git diff`
            exec(cmd, (errorDiff, resultDiff, stderrDiff) => {
                if (!errorDiff) {
                    const cmdAbort = `${CHANGE_DIRECTORY(req.params.repository)} && git merge --abort`;
                    exec(cmdAbort, async (errorAbort, resultAbort, stderrAbort) => {
                        if (!errorAbort) {

                            //database insert
                            

                            return res.json({ data: resultDiff.toString().trim().split('diff --git') })
                        } else {
                            console.log({ data: 'Abort: ' + stderrAbort })
                            return res.json({ data: stderrAbort })
                        }
                    })
                } else {
                    console.log({ data: 'Diff: ' + stderrDiff })
                    return res.json({ data: stderrDiff })
                }
            })
        });
    },

    async merge(req: Request, res: Response, next: NextFunction) {
        const { origin, destination } = req.body;
        const cmd = `${CHANGE_DIRECTORY(req.params.repository)} && git checkout ${destination} && git merge ${origin}`;
        exec(cmd, (error, stdout, stderr) => {
            if (!error) {
                return res.json({ data: "Merge success" })
            } else {

                return res.json({ data: stderr })
            }
        })
    }
}