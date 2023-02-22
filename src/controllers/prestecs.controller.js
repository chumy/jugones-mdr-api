import { pool } from "../database.js"

export const queryInsertPrestec = "INSERT INTO Prestecs (prestecId , jocId, uid, dataInici, dataFi  ) VALUES (?, ?, ?, ?,?)";
export const queryListadoPrestecs = " select json_object('prestecId',p.prestecId, 'dataInici',p.dataInici,  'dataFi', p.dataFi,  " +
        "'Joc', (select cast( CONCAT('[',  "+
           "JSON_OBJECT('jocId', c.jocId ,'joc',c.joc, 'bggId', c.bggId, 'expansio',j.expansio, 'tipologia', c.tipologia, 'ambit',c.ambit, " +
            "'minJugadors',j.minJugadors, 'maxJugadors',j.maxJugadors,'dificultat', j.dificultat, 'edat',j.edat,'imatge', j.imatge,'comentaris', c.comentaris), " +
            "']') AS JSON ) from Coleccio c left outer join Jocs j on c.bggId = j.bggId where c.jocId = p.jocId), " +
        "'Usuari',   (select cast( CONCAT('[', " +
            "JSON_OBJECT( 'uid', u.uid, 'displayName', u.displayName, 'email', u.email, 'rol', u.rol, 'photoURL', u.photoURL,'parella', u.parella),  " +
            "']')  AS JSON ) from Usuaris u where u.uid = p.uid) " +
        ") as Prestecs from Prestecs p "

export const createPrestec = async (req,res) =>{

    try {
        
        
        const { prestecId , jocId, uid, dataInici, dataFi } = req.body;
        console.log(req.body)
        const [rows] = await pool.query(
            queryInsertPrestec
          [prestecId , jocId, uid, dataInici, dataFi ]
        );

        console.log('insert realizado', prestecId)
        
        if (rows.affectedRows === 0)
        return res.status(403).json({ message: "Prestec not found" });

     //            console.log('control 2')
        const [prestecs] = await pool.query( queryListadoPrestecs + " WHERE prestecId = ?", [
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
        const [prestecs] = await pool.query(queryListadoPrestecs) 
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

        
        const [prestec] = await pool.query(queryListadoPrestecs, [prestecId]);
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


