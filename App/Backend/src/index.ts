import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { request } from "http";
import cors from "cors";
import { getTokenFrom } from "../utils/token";
import { authenticateJWT, RequestUser } from "../utils/authenticateJWT";
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import path from "path";

dotenv.config();

const app: Express = express();





app.use(express.json());
app.use(cookieParser());
export const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
 /*
{ 
  cors 
}

const corsOptions = {
  origin: "http://localhost:5173",

  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
*/

{
  /* Content security policy */
}
app.use(helmet.contentSecurityPolicy({
  directives:{
    defaultSrc:[ "'self'"],
    scriptSrc:["'self'"],
    styleSrc:["'self'"],
    imgSrc:["'self'","https://m.media-amazon.com/"],
    connectSrc:["'self'"],
    fontSrc:["'self'","data:"],
    objectSrc:["'self'"],
    frameSrc:["'self'"],
    reportUri: '/csp-violation-report-endpoint',
  }
}))
app.use(express.static(path.join(__dirname, "dist")));



app.post('/api/csp-violation-report-endpoint',(req,res)=>{
  console.log(`CSP Violation`, req.body);
  res.status(204).end();
})



app.post("/api/register", async (req: Request, res: Response) => {
  const { email, phonenumber, username, password } = req.body;

  if (!email || !username || !password)
    return res.status(400).send("Invalid data");

  const userNameAvailability = await prisma.user.findFirst({
    where: { username },
  });
  const EmailAvailability = await prisma.user.findFirst({ where: { email } });

  if (userNameAvailability) return res.status(400).send("Username is taken");
  if (EmailAvailability) return res.status(400).send("Email is taken");

  try {
    await prisma.user.create({
      data: { email, phonenumber, username, password },
    });

    return res.status(201).json({ message: "user created" });
  } catch {
    return res.status(400).json({ error: "invalid request" });
  }
});

app.post("/api/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const checkData = await prisma.user.findFirst({
    where: { username, password },
  });
  if (!checkData) return res.status(400).json("Wrong username or password");

  const token = jwt.sign(
    { id: checkData.id, username: checkData.username },
    process.env.SECRET!,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    path: "http://localhost:5173/",
    secure: true,
    maxAge: 3600000,
  });

  res.json({ message: "logged in successfully" });
});

app.post("/api/category", async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Empty name");
  }

  const category = await prisma.category.create({
    data: { name },
  });

  res.json(category);
});

app.get("/api/category", async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({});
  return res.status(200).json(categories);
});

app.get("/api/category/:categoryId", async (req: Request, res: Response) => {
  try {
    parseInt(req.params.categoryId, 32);
    const singleCategory = await prisma.category.findFirst({
      where: { id: +req.params.categoryId },
    });
    return res.status(200).json(singleCategory);
  } catch {
    return res.status(400).json("an error has occured");
  }
});

app.post("/api/items", async (req: Request, res: Response) => {
  const { name, photo, price, amount, sold, description, category } = req.body;
  if (
    !name ||
    !photo ||
    !price ||
    !amount ||
    !sold ||
    !description ||
    !category
  ) {
    return res.status(400).send("Cannot be empty");
  }
  const cat = await prisma.category.findFirst({ where: { name: category } });
  if (!cat) return res.status(400).send("Category not found");

  try {
    const item = await prisma.item.create({
      data: {
        name,
        photo,
        price,
        amount,
        sold,
        description,
        category: { connect: { id: cat.id } },
      },
    });

    res.status(200).json(item);
  } catch {
    return res.status(400).json({ error: "invalid request" });
  }
});

app.get("/api/item/category/:categoryId", async (req: Request, res: Response) => {
  try {
    parseInt(req.params.categoryId, 32);
    const item = await prisma.item.findMany({
      where: { categoryId: +req.params.categoryId },
    });
    return res.status(200).json(item);
  } catch {
    return res.status(400).json("an error has occured");
  }
});

app.get("/api/recommended", async (req: Request, res: Response) => {
  const recommended = await prisma.item.findMany({
    orderBy: { sold: "desc" },
    take: 10,
    include: { category: true },
  });
  return res.status(200).json(recommended);
});

app.get("/api/item/:id", async (req: Request, res: Response) => {
  try {
    parseInt(req.params.id, 32);
    const item = await prisma.item.findFirst({
      where: { id: +req.params.id },
      include: { category: true },
    });
    return res.status(200).json(item);
  } catch {
    return res.status(400).json("an error has occured");
  }
});

{
  /* Protected routes */
}



app.use(authenticateJWT);

app.get("/api/profile", async (req: RequestUser, res: Response) => {
  const userId = req.user.id;

  if (userId === null) {
    return res.status(403).json({
      error: "invalid user token",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        email: true,
        username: true,
        phonenumber: true,
        orders: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            status: true,
            date: true,
            fullPrice: true,
            items: { select: { item: true, amount: true } },
          },
        },
      },
    });

    return res.status(200).json(user);
  } catch {
    return res.status(400).json({ error: "invalid request" });
  }
});

app.post("/api/orders", async (req: RequestUser, res: Response) => {
  const { firstName, lastName, address, zipCode, city, items } = req.body as {
    firstName: string;
    lastName: string;
    address: string;
    zipCode: string;
    city: string;
    items: Array<{ id: number; amount: number }>;
  };
  if (
    !firstName ||
    !lastName ||
    !address ||
    !zipCode ||
    !city ||
    !items ||
    items.length === 0
  ) {
    return res.status(400).send("Cannot be empty");
  }
  const userId = req.user.id;

  {
    /* obliczanie pełnej ceny zamówienia */
  }
  const productIds = items.map((item) => item.id);
  const products = await prisma.item.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true },
  });

  let fullPrice = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + (product ? product.price * item.amount : 0);
  }, 0);

  fullPrice = parseFloat(fullPrice.toFixed(2));

  if (userId === null) {
    return res.status(403).json({
      error: "invalid user token",
    });
  }
  try {
    const order = await prisma.orders.create({
      data: {
        firstName,
        lastName,
        address,
        zipCode,
        city,
        fullPrice,
        items: {
          create: items.map((item) => ({
            amount: item.amount,
            item: {
              connect: { id: item.id },
            },
          })),
        },
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json(order);
  } catch {
    return res.status(400).json({ error: "invalid request" });
  }
});

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

