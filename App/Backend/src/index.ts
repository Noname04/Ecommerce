import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"

dotenv.config();

const app: Express = express();
app.use(express.json());
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/register", async (req: Request, res: Response) => {
  const { email, phonenumber, username, password } =
    req.body;

  if (!email || !username || !password)
    return res.status(400).send("Invalid data");

  const userNameAvailability = await prisma.user.findFirst({
    where: { username },
  });
  const EmailAvailability = await prisma.user.findFirst({ where: { email } });

  if (userNameAvailability) return res.status(400).send("Username is taken");
  if (EmailAvailability) return res.status(400).send("Email is taken");

  const user = await prisma.user.create({
    data: { email, phonenumber, username, password },
  });

  res.json(user);
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const checkdata = await prisma.user.findFirst({
    where: {username, password},
  });
  if (!checkdata) return res.status(400).send("Wrong username or password");

  const token = jwt.sign({id:checkdata.id,username:checkdata.username},process.env.SECRET!,{expiresIn:"1h"});

  res.json({token});
});

app.post("/category", async(req: Request, res:Response) => {
  const {name} = req.body;
  if(!name){
    return res.status(400).send("Empty name");
  }

  const category = await prisma.category.create({
    data: {name},
  });

  res.json(category)
})

app.post("/items", async(req: Request, res:Response) => {
  const {name,photo,price,ammount, sold,description,category} = req.body;
  if(!name || !photo ||!price || !ammount || !sold || !description || !category){
    return res.status(400).send("Cannot be empty");
  }
    const cat = await prisma.category.findFirst({where:{name:category}})
    if(!cat)
      return res.status(400).send("Category not found");
    const item = await prisma.item.create({
      data: {name,photo,price,ammount, sold,description,category: {connect:{id:cat.id}}},
    });

    res.json(item)
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
