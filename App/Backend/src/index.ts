import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"
import { request } from "http";
import cors from 'cors';


dotenv.config();

const app: Express = express();
app.use(express.json());
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

{/* cors */}


app.use(cors());


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


/*
app.post("/orders", async(req: Request, res:Response) => {
    const {firstName, lastName, adres , ZipCode, city, itemsid} = req.body;
    if(!firstName || !lastName || !adres || !ZipCode|| !city|| !itemsid){
        return res.status(400).send("Cannot be empty");
    }

})
app.get("/orders/history", async(req: Request, res:Response) => {

})

*/

app.get("/category", async(req: Request, res:Response) => {
  const categories = await prisma.category.findMany({})
  return res.status(200).json(categories);
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

app.get("/item/category/:categoryId", async(req: Request, res:Response) => {
  const item = await prisma.item.findMany({where:{categoryId:+req.params.categoryId}})
  return res.status(200).json(item);
})

app.get("/recommended", async(req: Request, res:Response) => {
  const recommended = await prisma.item.findMany({orderBy:{sold:"desc"},take:10})
  return res.status(200).json(recommended);
})

app.get("/item/:id", async(req: Request, res:Response) => {
  const item = await prisma.item.findFirst({where:{id:+req.params.id}})
  return res.status(200).json(item);
})


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
