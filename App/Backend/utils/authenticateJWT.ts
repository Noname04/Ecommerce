import { Request, Response } from "express";

const jwt = require('jsonwebtoken');

export interface RequestUser extends Request {user?:any}

export const authenticateJWT = (req: RequestUser, res: Response, next: Function) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(403).json("Access denied");
    }
  
    jwt.verify(token, process.env.SECRET!, (err: any, user: any) => {
      if (err) {
        return res.status(403).json("Invalid token");
      }
  
      req.user = user;
      next();
    });
  };

