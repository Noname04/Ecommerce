import { Request } from "express";
import { prisma } from "../src";

const jwt = require('jsonwebtoken');
const { SECRET } = process.env;

export const getTokenFrom = async (request:Request) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      const token = authorization.substring(7);
      try {
        const decodedToken = await jwt.verify(token, SECRET);
        const user = await prisma.user.findFirst({
          where: {
            id: decodedToken.id,
          },
        });
        return user?.id;
      } catch (error) {
        return null;
      }
    }
    return null;
  };
  