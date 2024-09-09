import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { request } from "http";
import cors from "cors";
import { getTokenFrom } from "../utils/token";
import { authenticateJWT, RequestUser } from "../utils/authenticateJWT";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import https from "https";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Console, error } from "console";
import csurf from 'csurf';




dotenv.config();

/*
{Server settings}
*/

const app: Express = express();

const privateKey = fs.readFileSync("ssl/localhost.key", "utf8");
const certificate = fs.readFileSync("ssl//localhost.crt", "utf8");

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

app.use(express.json());
app.use(cookieParser());
export const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

/* 
{
Validation
} 
*/

const {validateCommentBody,
  validateLoginBody,
  validateRegisterBody,
  validateOrderBody,} =  require( "../utils/validation");

const { validationResult } = require('express-validator');


/*
{ 
password salt  
}
*/

const saltRounds = 10;
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
/* 
{
X-Content-Type-Options Header
}
*/

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

/* 
{
 hash timestamps
}
*/

app.get("/timestamp", (req, res) => {
  const currentTimestamp = new Date().toISOString();
  res.json({ timestamp: currentTimestamp });
});

/* 
{
  generate nonce
} 
*/

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});

/* 
{
  Content security policy
} 
*/

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        (req, res) => {
          const expressRes = res as express.Response;
          return `'nonce-${expressRes.locals.nonce}'`;
        },
      ],
      styleSrc: [
        "'self'",
        (req, res) => {
          const expressRes = res as express.Response;
          return `'nonce-${expressRes.locals.nonce}'`;
        },
      ],
      imgSrc: ["'self'", "https://www.pexels.com", "https://images.pexels.com"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      frameAncestors: ["'none'"], //clickJacking protection
      formAction: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'self'"],
      //reportTo: '/csp-violation-report-endpoint',
    },
    reportOnly: false,
  })
);

/*
app.post('/api/csp-violation-report-endpoint',(req,res)=>{
  console.log(`CSP Violation`, req.body);
  res.status(204).end();
});
*/

/*
{
   CSRF token
}  
*/


const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: true, 
    sameSite: 'lax', 
  },
});

app.use(csrfProtection);


app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

/* 
{
  HSTS
}
*/

app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

app.use(express.static(path.join(__dirname, "dist")));

/*
{
  cache control directives
}
*/

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

/* 
{ 
disable server leak information
} 
*/
app.disable("x-powered-by");

/*
{
Potential meta data leak fix
}
*/

const allowedHosts = ["localhost:3000"];

const validateHost = (req: Request, res: Response, next: NextFunction) => {
  const host = req.get("Host");

  if (!host || !allowedHosts.includes(host)) {
    res.status(403).send("Access denied");
  } else {
    next();
  }
};

app.use(validateHost);

/* 
{
requests
} 
*/

app.get('/api/csrf-token', (req, res) => {
  return res.json({ csrfToken: req.csrfToken() });
});

app.post("/api/register",csrfProtection, validateRegisterBody, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json( "Invalid data" );
  }

  const { email, phoneNumber, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json("Invalid data");
  }
  const usernameAvailability = await prisma.user.findFirst({
    where: { username },
  });
  const EmailAvailability = await prisma.user.findFirst({ where: { email } });

  if (usernameAvailability) {
    return res.status(400).json("username is taken");
  }
  if (EmailAvailability) {
    return res.status(400).json("Email is taken");
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  try {
    await prisma.user.create({
      data: { email, phoneNumber, username, password: passwordHash },
    });

    return res.status(201).json({ message: "user created" });
  } catch (error) {
    return res.status(400).json({ error: "invalid request" });
  }
});

app.post("/api/login",csrfProtection, validateLoginBody, async (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json("Invalid data");
  }

  const { username, password } = req.body;

  /*
    const query = `SELECT * FROM public."User" WHERE username = '${username}' AND password = '${password}'`;
  const checkData = await prisma.$queryRawUnsafe(query) as Array<any>;

  if (!checkData || !password)
    return res.status(400).json("Wrong username or password")
  */

  const checkData = await prisma.user.findFirst({
    where: { username },
  });

  if (!checkData || !password)
    return res.status(400).json("Wrong username or password");

  const passwordCorrect = await bcrypt.compare(password, checkData.password);

  if (!passwordCorrect)
    return res.status(400).json("Wrong username or password");

  const token = jwt.sign(
    { id: checkData.id, username: checkData.username },
    process.env.SECRET!,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600000,
    sameSite: 'lax',
  });

  res.json({ message: "logged in successfully" });
});

app.post("/api/category",csrfProtection, async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Empty name");
  }

  const category = await prisma.category.create({
    data: { name },
  });

  res.json(category);
});

app.get("/api/category",csrfProtection, async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({});
  return res.status(200).json(categories);
});

app.get("/api/search",csrfProtection, async (req: Request, res: Response) => {
  const { search } = req.query;

  if (typeof search !== "string") {
    return res.status(400).json({ error: "Invalid search query" });
  }

  const sanitizedSearch = search.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
  try {
    const shows = await prisma.item.findMany({
      where: {
        OR: [
          {
            name: {
              contains: sanitizedSearch,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: sanitizedSearch,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      select: { id: true, name: true },
      take: 5,
    });

    return res.status(200).json(shows);
  } catch (error) {
    return res.status(500).json({ error: " iternal server error" });
  }
});

app.get("/api/category/:categoryId",csrfProtection, async (req: Request, res: Response) => {
  try {
    parseInt(req.params.categoryId, 32);
    const singleCategory = await prisma.category.findFirst({
      where: { id: +req.params.categoryId },
    });
    return res.status(200).json(singleCategory);
  } catch {
    return res.status(400).json("an error has occurred");
  }
});

app.post("/api/items",csrfProtection, async (req: Request, res: Response) => {
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

app.get(
  "/api/item/category/:categoryId",csrfProtection,
  async (req: Request, res: Response) => {
    try {
      parseInt(req.params.categoryId, 32);
      const item = await prisma.item.findMany({
        where: { categoryId: +req.params.categoryId },
      });
      return res.status(200).json(item);
    } catch {
      return res.status(400).json("an error has occurred");
    }
  }
);

app.get("/api/recommended",csrfProtection, async (req: Request, res: Response) => {
  const recommended = await prisma.item.findMany({
    orderBy: { sold: "desc" },
    take: 10,
    include: { category: true },
  });
  return res.status(200).json(recommended);
});

app.get("/api/item/:id",csrfProtection, async (req: Request, res: Response) => {
  try {
    parseInt(req.params.id, 32);
    const item = await prisma.item.findFirst({
      where: { id: +req.params.id },
      include: {
        category: true,
        comment: {
          select: {
            id: true,
            text: true,
            added: true,
            user: { select: { username: true } },
          },
        },
      },
    });
    return res.status(200).json(item);
  } catch {
    return res.status(400).json("an error has occurred");
  }
});

app.put("/api/logout",csrfProtection, async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).json({
    msg: "Success",
  });
});

{
  /* Protected routes */
}

app.use(authenticateJWT);

app.get("/api/profile",csrfProtection, async (req: RequestUser, res: Response) => {
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
        phoneNumber: true,
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

app.post("/api/orders", csrfProtection,validateOrderBody, async (req: RequestUser, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json("Invalid data");
  }
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
    res.status(201).json({message: "success"});
  } catch {
    return res.status(400).json({ error: "invalid request" });
  }
});

app.post("/api/comment", csrfProtection, validateCommentBody,  async (req: RequestUser, res: Response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json("Invalid data");
  }
  try {
  const { itemId, text } = req.body;

  const origin = req.get('origin');

  if (origin !== 'https://localhost:3000') {
    return res.status(403).json({ error: 'Invalid origin' });
  }

  const userId = req.user.id;

  const parsedItemId = parseInt(itemId, 10);

  if (isNaN(parsedItemId)) {
    return res.status(400).json({
      error: "Invalid item ID",
    });
  }
  
  if (!userId) {
    return res.status(401).json({
      error: "invalid user token",
    });
  }
  
  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        user: { connect: { id: userId } },
        item: { connect: { id: parsedItemId } },
      },
    });

    res.status(201).json({message: "success"});
  }catch (error) {
    console.error("Error occurred while creating comment:", error);
    return res.status(400).json({ error: "invalid request" });
  }}
  catch (error) {
    next(error); 
  };
});



app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'ForbiddenError: invalid csrf token') {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }
  // Inne błędy
  res.status(err.status || 500).json({ message: err.message });
});



app.get("*", (req: Request, res: Response) => {
  const indexPath = path.join(__dirname, "dist", "index.html");

  fs.readFile(indexPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error loading index.html");
    }

    const modifiedHtml = data.replace(
      '<meta property="csp-nonce" content="">',
      `<meta property="csp-nonce" content="${res.locals.nonce}" />`
    );
    res.send(modifiedHtml);
  });
});
/*
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
*/

httpsServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
