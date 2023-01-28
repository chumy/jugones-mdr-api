import express from "express"
import morgan from "morgan"
import pkg from "../package.json" assert { type: "json" };
import cors from "cors"

import jocsRoute from "./routes/jocs.route.js";
import authRoute from "./routes/auth.route.js";
import usuarisRoute from "./routes/usuaris.route.js";
import prestecsRoute from  "./routes/prestecs.route.js";
//import xml2json from "xml2json";



/*const allowedOrigins = ['http://localhost:8100', 'http://localhost',];
const options = cors.CorsOptions = {
    origin : allowedOrigins
};
*/
const app = express();

app.use(cors())
app.set("pkg",pkg);

app.use(morgan('dev'));
app.use(express.json());


app.get('/', (req,res)=>{
    res.json({
        author: app.get("pkg").author,
        description: app.get("pkg").description,
        version: app.get("pkg").version
    })
})



app.use('/api/jocs', jocsRoute);
app.use('/api/auth', authRoute);
app.use('/api/usuaris', usuarisRoute);
app.use('/api/prestecs', prestecsRoute);

export default app;