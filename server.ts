import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import { db } from "./data";

const app = express();
const PORT = 3001;

app.use(express.json());
console.log("db", db);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello");
});

app.post("/register", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("Bad Request");
    const isUsername = db.find((user) => user.username === username);
    if (isUsername) return res.status(422).send("user is already exist");
    const hashPassword = await bcrypt.hash(password, 10);
    db.push({ username, password: hashPassword });
    console.log("register", db);
    res.send({ username, password });
});

app.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("Bad Request");
    const isUsername = db.find((user) => user.username === username);
    if (!isUsername) return res.status(400).send("Bad Request");
    const isPassword = await bcrypt.compare(password, isUsername.password);
    if (!isPassword) return res.status(401).send("incorret");
    res.send("login");
});

app.listen(PORT, () => console.log(`server is running ${PORT}`));
