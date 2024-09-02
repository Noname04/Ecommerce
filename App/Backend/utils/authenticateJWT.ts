import { Request, Response } from "express";

const jwt = require('jsonwebtoken');

export interface RequestUser extends Request {user?:any}

export const authenticateJWT = (req: RequestUser, res: Response, next: Function) => {

  const { pathname } = new URL(req.originalUrl, `http://${req.headers.host}`);
  if(pathname.startsWith("/api")){
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json("Access denied");
    }
  
    jwt.verify(token, process.env.SECRET!, (err: any, user: any) => {
      if (err || user === null || user?.id === null) {
        return res.status(403).json("Invalid token");
      }
  
      req.user = user;
      next();
    });
  }else{
    next();
  }
  };

