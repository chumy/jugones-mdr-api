import { pool } from "../database.js"
import xml2json from "xml2json";


export const createJoc = async (req,res) =>{

    try {
        
        //console.log(req.body)
        const { jocId, joc, tipologia, ambit, comentaris, minJugadors, maxJugadors, dificultat, duracio, edat, expansio, bggId, imatge } = req.body;
        const [rows] = await pool.query(
          "INSERT INTO Jocs (jocId, joc, tipologia, ambit, comentaris, minJugadors, maxJugadors, dificultat, duracio, edat, expansio, bggId, imatge ) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?, ?)",
          [jocId, joc, tipologia, ambit, comentaris, minJugadors, maxJugadors, dificultat, duracio, edat, expansio, bggId, imatge]
        );

        console.log('insert realizado')
        
        if (rows.affectedRows === 0)
        return res.status(403).json({ message: "Joc not found" });

    const [jocs] = await pool.query("SELECT jocId, joc, tipologia, ambit, comentaris, minJugadors, maxJugadors, dificultat, duracio, edat, expansio, bggId, imatge FROM Jocs WHERE jocId = ?", [
        jocId  ]);

    res.status(201).json(jocs[0]);
        
    } catch (error) {
        return res.status(500).json({ error });
    }

}

export const getJocs = async (req,res) => {
    try {
        const [jocs] = await pool.query('SELECT * FROM Jocs order by joc asc') 
        res.json({ jocs })
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
    
}

export const getJocById = async (req,res) =>{

    try {
        const [joc] = await pool.query('SELECT * FROM Jocs WHERE jocId = ?',[req.params.jocId]) 
        
        if (joc.length <= 0) 
            return res.status(404).json({ message: 'Joc no trobat' })

        res.status(200).json(joc[0])
    
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
}

export const updateJoc = async (req,res) =>{
    try {
        const { jocId, joc, tipologia, ambit, comentaris, minJugadors, maxJugadors, dificultat, duracio, edat, expansio, bggId, imatge } = req.body;

        let query = "UPDATE Jocs SET joc = IFNULL(?, joc), tipologia = IFNULL(?, tipologia), ambit = IFNULL(?, ambit), comentaris = IFNULL(?, comentaris)," +
        " minJugadors = IFNULL(?, minJugadors), maxJugadors = IFNULL(?, maxJugadors), dificultat = IFNULL(?, dificultat), duracio = IFNULL(?, duracio)," + 
        " edat = IFNULL(?, edat), expansio = IFNULL(?, expansio), bggId = IFNULL(?, bggId), imatge = IFNULL(?, imatge) WHERE jocId = ?"
        
        console.log(req.body)
        
        const [result] = await pool.query( query ,
        [joc, tipologia, ambit, comentaris, minJugadors, maxJugadors, dificultat, duracio, edat, expansio, bggId, imatge, jocId]
        );

        console.log(result);
        if (result.affectedRows === 0)
        return res.status(404).json({ message: "Joc not found" });

        const [rows] = await pool.query("SELECT * FROM Jocs WHERE jocId = ?", [
        jocId,
        ]);

        res.json(rows[0]);
        
    } catch (error) {
        
        return res.status(500).json({ message: "Something goes wrong on update" });
    }
}

export const deleteJocById = async (req,res) =>{
    try {
        
        const { jocId } = req.params;
        const [rows] = await pool.query("DELETE FROM Jocs WHERE jocId = ?", [jocId]);

        if (rows.affectedRows <= 0) {
        return res.status(404).json({ message: "Joc not trobat" });
        }

        res.sendStatus(204);
        
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
}

export const getBggInfo = async (req,res) =>{
    try {
        const { jocId } = req.params;
        let url = "https://api.geekdo.com/xmlapi/boardgame/"+jocId+"&stats=1"
//        console.log(url)
               

        
        const responseBgg = await fetch(url)
        const contentBgg = await responseBgg.text();
            
        const data =  xml2json.toJson(contentBgg);
       
        res.status(200).send(data)
          

        
    } catch (e) {
        return res.status(500).send( {error :  e });
    }
}