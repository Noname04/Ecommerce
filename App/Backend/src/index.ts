import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { request } from "http";
import cors from "cors";
import { getTokenFrom } from "../utils/token";
import { authenticateJWT, RequestUser} from "../utils/authenticateJWT"
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cookieParser());
export const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

{
  /* cors */
}

const corsOptions = {

  origin: 'http://localhost:5173',


  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/register", async (req: Request, res: Response) => {
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

app.post("/login", async (req: Request, res: Response) => {
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
    path: "http://localhost:5173/" ,
    secure: true,
    maxAge: 3600000,
  });

  res.json({ message: "logged in successfully" });
});

app.post("/category", async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Empty name");
  }

  const category = await prisma.category.create({
    data: { name },
  });

  res.json(category);
});

app.get("/category", async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({});
  return res.status(200).json(categories);
});

app.get("/category/:categoryId", async (req: Request, res: Response) => {
  const singleCategory = await prisma.category.findFirst({
    where: { id: +req.params.categoryId },
  });
  return res.status(200).json(singleCategory);
});

app.post("/items", async (req: Request, res: Response) => {
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

app.get("/item/category/:categoryId", async (req: Request, res: Response) => {
  const item = await prisma.item.findMany({
    where: { categoryId: +req.params.categoryId },
  });
  return res.status(200).json(item);
});

app.get("/recommended", async (req: Request, res: Response) => {
  const recommended = await prisma.item.findMany({
    orderBy: { sold: "desc" },
    take: 10,
    include: { category: true },
  });
  return res.status(200).json(recommended);
});

app.get("/item/:id", async (req: Request, res: Response) => {
  const item = await prisma.item.findFirst({
    where: { id: +req.params.id },
    include: { category: true },
  });
  return res.status(200).json(item);
});

{/* Protected routes */}

app.use(authenticateJWT)

app.get("/profile", async (req: RequestUser, res: Response) => {
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

app.post("/orders", async (req: RequestUser, res: Response) => {
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
    console.log(req.body);
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
  console.log(fullPrice);

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


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
