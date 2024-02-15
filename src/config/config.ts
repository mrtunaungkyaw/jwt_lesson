interface Config {
    jwtSecret: string;
}

export const config: Config = {
    jwtSecret: process.env.JWT_SECRET || "",
};
