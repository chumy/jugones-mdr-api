//import jwt from "jsonwebtoken";
import { pool } from "../database.js"
import { SECRET } from "../config.js";



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
      /*const token = jwt.sign({ id: uid }, SECRET, {
        expiresIn: 60 //86400, // 24 hours
      });*/

        res.status(201).json(usuario);
       
        
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
  }
