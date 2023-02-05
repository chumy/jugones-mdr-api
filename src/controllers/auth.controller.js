import jwt from "jsonwebtoken";
import { pool } from "../database.js"
import { ROLE_ADMIN, ROLE_RESPONSABLE, SECRET } from "../config.js";



  export const login = async (req,res) =>{
    let usuario;
    try {
        //console.log(req.params)
        //console.log(req.body)
        let rol = 0;

        const {  uid, displayName, email, photoURL } = req.body;
        //Check Email
        const [rows] = await pool.query(
          "SELECT COUNT(*) as emails FROM Usuaris where email = ?",
          [email]
        );
        //console.log("checking emails ", rows[0].emails);
        if (rows[0].emails == 0){
          // insert
          const [rows] = await pool.query(
            "INSERT INTO Usuaris (uid, displayName, email, rol, photoURL) VALUES (?, ?, ?, ?, ?)",
            [uid, displayName, email, rol, photoURL]
          );
          usuario.uid = uid;
          usuario.sodisplayNameci = displayName;
          usuario.email = email;
          usuario.rol = rol;
          usuario.photoURL = photoURL;
          usuario.parella = '';
          
          console.log("insertando ", usuario)

        }else{
          // get Role
          //console.log("usuario existe")
          const [usuaris] = await pool.query("SELECT uid, displayName, email, rol, photoURL, parella FROM Usuaris where email = ?", [email]);
          //console.log(usuaris[0])
          usuario = usuaris[0];
          // chequeamos el uid por si el usuario ha sido introducido manualmente
          if (usuario.uid != uid)
          {
            usuario.uid = uid;
            usuario.photoURL = photoURL;
            const [rows] = await pool.query("UPDATE FROM Usuaris set uid = ?, photoURL = ? where email = ? ", [uid, photoURL, email])
            console.log( "usuario actualizado correctamente")
          }
        
        }

          // Create a token
      const token = jwt.sign({ id: uid }, SECRET, {
        expiresIn: 86400, // 24 hours
      });

        res.status(201).json({usuario , token } );
       
        
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
  }

  export async function verifyToken(req, res, next) {
    // Get the token from the headers
    console.log("Verifying..")
    
    let token = req.headers["authorization"]; 
  
    // if does not exists a token
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No Token was Provided" });
    }
  
    //console.log("token", token)
    // decode the token
    try {
      token = token.replace('Bearer ',''); 
      const decoded = await jwt.verify(token, SECRET);

      //console.log("decoded", decoded)
    
      // verificacion
      const [rows] = await pool.query("SELECT rol FROM Usuaris WHERE uid = ?", [
        decoded.id  ]);
      
      if (rows.affectedRows === 0)
        return res.status(403).json({ message: "User Not allowed" });
      
      //console.log(rows[0])

      //if (decoded.id != req.headers['x-auth-token']){
      if (rows[0].rol != ROLE_ADMIN && rows[0].rol != ROLE_RESPONSABLE){
        //console.log("error x-auth")
        return res.status(403).send({auth: false, message: "Not allowed"})
      }
  
      // continue with the next function
      next();
    } catch(err){
      //console.log("error general", err)
      return res.status(403).send({auth: false, message: "Not allowed"})
    }
  }
