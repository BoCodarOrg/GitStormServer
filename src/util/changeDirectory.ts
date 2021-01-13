import { Request, Response, NextFunction } from "express";

import { exec } from 'child_process';
import enviroments from "../config/enviroments";

export const CHANGE_DIRECTORY = (repo: string) => (
    `echo ${enviroments.passGit} | sudo -u ${enviroments.userGit} -S cd ${enviroments.dirFiles}/${repo}`
);

export const PERMISSIONS = `echo ${enviroments.passGit} | su -c ${enviroments.userGit} `;

export const chageDirectoryReq = async (req: Request, res: Response, next: NextFunction) => {
    exec(`cd ${enviroments.dirFiles}/${req.params.repository}`, (error, stdout, stderr) => {
        return new Promise((resolve, reject) => {
            if (!error) {
                resolve(stdout);
                return next();
            } else {
                reject(error);
                return next(false);
            }
        })
    })
}

export const changeDirectoryCmd = async (repo: string) => {
    exec(`cd ${enviroments.dirFiles}/${repo}`, (error, stdout, stderr) => {
        return new Promise((resolve, reject) => {
            if (!error) {
                resolve(stdout);
            } else {
                reject(error);
            }
        })
    })
}