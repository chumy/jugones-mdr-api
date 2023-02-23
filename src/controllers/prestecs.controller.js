import { pool } from "../database.js"
import * as q from "../queries.js"



export const createPrestec = async (req,res) =>{

    try {
        
        
        const { prestecId , jocId, uid, dataInici, dataFi } = req.body;
        console.log(req.body)
        const [rows] = await pool.query(
            q.queryInsertPrestec
          [prestecId , jocId, uid, dataInici, dataFi ]
        );

        console.log('insert realizado', prestecId)
        
        if (rows.affectedRows === 0)
        return res.status(403).json({ message: "Prestec not found" });

     //            console.log('control 2')
        const [prestecs] = await pool.query( q.queryListadoPrestecs + " WHERE prestecId = ?", [
        prestecId  ]);
        //console.log('control 1')
        res.status(201).json({prestecs});
        
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }

}

export const getPrestecs = async (req,res) => {
    try {
   
        //console.log(query);
        //const [prestecs] = await pool.query('SELECT * FROM Prestecs where dataFi is null order by dataInici asc') 
        const [prestecs] = await pool.query(q.queryListadoPrestecs) 
        res.status(200).send({prestecs })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something goes wrong" });
    }
    
}

export const updatePrestec = async (req,res) =>{
    try {
        const { prestecId , jocId, uid, dataInici, dataFi } = req.body;
        console.log("update prestec", req.body)

        let query = "UPDATE Prestecs SET jocId = IFNULL(?, jocId), uid = IFNULL(?, uid), dataInici = IFNULL(?, dataInici), dataFi = IFNULL(?, dataFi) " +
                " WHERE prestecId = ?"
        
        //console.log(req.body)
        
        const [result] = await pool.query( query ,
        [jocId, uid, dataInici, dataFi, prestecId]
        );

        //console.log(result);
        if (result.affectedRows === 0)
        return res.status(404).json({ message: "Prestec not found" });

        
        const [prestec] = await pool.query(q.queryListadoPrestecs, [prestecId]);
        //console.log(prestec);
        res.status(202).send({prestec});
        
    } catch (error) {
        
        return res.status(500).json({ message: "Something goes wrong on update" });
    }
}

export const deletePrestecById = async (req,res) =>{
    try {
        
        const { prestecId } = req.params;

        //console.log(req.params)
        const [rows] = await pool.query("DELETE FROM Prestecs WHERE prestecId = ?", [prestecId]);

        

        if (rows.affectedRows <= 0) {
        return res.status(404).json({ message: "Prestec no esborrat" });
        }

        res.sendStatus(204);
        
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
}


