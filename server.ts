import bcrypt from "bcrypt";
import "dotenv/config";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { checkAuth } from "./auth";
import { db } from "./data";
import { config } from "./src/config/config";

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/", checkAuth, (req: Request, res: Response) => {
    const { verify } = req.body;
    console.log("req.body", req.body);
    const user = db.find((user) => user.username === verify.username);
    if (!user) return res.status(400).send("Bad Request");

    res.send(user);
});

app.post("/register", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("Bad Request");
    const isUsername = db.find((user) => user.username === username);
    if (isUsername) return res.status(422).send("user is already exist");
    const hashPassword = await bcrypt.hash(password, 10);
    db.push({ username, password: hashPassword });
    res.send({ username, password });
});

app.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("Bad Request");
    const isUsername = db.find((user) => user.username === username);
    if (!isUsername) return res.status(400).send("incorret");
    const isPassword = await bcrypt.compare(password, isUsername.password);
    if (!isPassword) return res.status(401).send("incorret");
    const accessToken = jwt.sign({ username }, config.jwtSecret);
    res.send(accessToken);
});

app.listen(PORT, () => console.log(`server is running ${PORT}`));
