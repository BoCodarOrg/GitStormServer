import { NextFunction, Request, Response } from "express";
import { exec } from 'child_process';
import enviroments from '../config/enviroments';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default {
    async index(req: Request, res: Response, next: NextFunction) {
        const result = await prisma.repository.findMany();
        return res.status(200).json({
            error: false,
            status: 200,
            data: result
        })
    },

}