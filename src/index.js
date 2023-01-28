import app from './app.js'
import "./database.js"

import * as env from "./config.js"



app.listen(env.PORT);

console.log("Listen on port", env.PORT)
