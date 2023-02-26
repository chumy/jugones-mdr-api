import { pool } from "../database.js"




export const updateUserById = async (req,res) =>{
    try {
        //const { userId } = req.params;
        const { uid, displayName, email, photoURL, rol, parella } = req.body;
        
        console.log("recibiendo", req.body)
        const [result] = await pool.query(
            "UPDATE Usuaris  SET displayName = IFNULL(?, displayName) , email = IFNULL(?, email) , photoURL = IFNULL(?, photoURL) , rol = IFNULL(?, rol) , parella = IFNULL(?, parella) WHERE uid = ?",
            [displayName, email,  photoURL, rol, parella ,uid]
          );

        console.log("resultado", result);
        
        if (result.affectedRows === 0)
            return res.status(403).json({ message: "Usuari not found" });

        const [rows] = await pool.query("SELECT uid, displayNAme, email, rol, photoURL, parella FROM Usuaris WHERE uid = ?", [
            uid  ]);

        res.status(201).json(rows[0]);
        
          
    }
    catch (e){
        console.log(e)
        return res.status(500).json({ message: "Something goes wrong on update" });
    }
}

export const getUsers = async (req,res) =>{
    // Proteger con JWT solo para Admins
    try {
        const [usuaris] = await pool.query('SELECT * FROM Usuaris') 
        res.json({ usuaris })
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
    
}

export const getUserById = async (req,res) =>{
    try {
        const { uid } = req.params;
        const [usuaris] = await pool.query('SELECT * FROM Usuaris where uid = ?', [ uid ]) 
        res.status(200).json(usuaris[0])
    }
    catch(error){
        console.log(error)
        return res.status(500).json({ message: "Something goes wrong" });
    }
}

export const createUser = async (req,res) =>{
    try {
        const { uid, displayName, email, rol} = req.body;
        //console.log("recibiendo ", req.body)
        const [ins] = await pool.query(
            "INSERT INTO Usuaris (uid, displayName, email, rol, photoURL, parella) VALUES (?, ?, ?, ?, null, null)",
            [uid, displayName, email, rol]
          );        
        
        const [rows] = await pool.query("SELECT uid, displayName, email, rol, photoURL, parella FROM Usuaris WHERE uid = ?", [
            uid  ]);

        res.status(201).json(rows[0]);
          //res.status(201).json({ uid, displayName, email, photoURL, rol, parella });
    }
    catch(error){
        return res.status(500).json({ message: "Something goes wrong" });
    }
}

export const deleteUserById = async (req,res) =>{
    try {
        const { uid } = req.params;
        const [rows] = await pool.query("DELETE FROM Usuaris WHERE uid = ?", [
            uid  ]);

        res.status(201).json(rows[0]);
    }
    catch(error){
        return res.status(500).json({ message: "Something goes wrong" });
    }
}



