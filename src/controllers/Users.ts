import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import ModelResponse from "../model/ResponseModel";

const prisma = new PrismaClient();

export default {
    async search(req: Request, res: Response<ModelResponse>, next: NextFunction) {
        const result = await prisma.user.findMany({
            where: {
                name: {
                    contains: req.params.name
                }
            }
        })

        return res.status(200).json({
            error: false,
            status: 200,
            data: result
        })
    }
}