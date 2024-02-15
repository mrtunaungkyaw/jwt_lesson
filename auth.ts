import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "./src/config/config";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(400).send("Bad Request");
    const accessToken = authHeader.split(" ")[1];
    try {
        jwt.verify(accessToken, config.jwtSecret, (err, user) => {
            if (err) {
                return res.status(403).send("Token is not vaild!");
            }
            req.body = { ...req.body, verify: user };
            return next();
        });
    } catch (error) {
        return res.status(401).send("You are not authenticated");
    }
};
