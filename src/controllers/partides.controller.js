import { pool } from "../database.js"
import * as q from "../queries.js"




export const createPartida = async (req,res) =>{

    try {
        
        
        const { partidaId, joc, organitzador, numJugadors, data, comentaris, participants } = req.body;
        //console.log(req.body)
       const [rows] = await pool.query(
          "INSERT INTO Partides (partidaId, bggId , organitzador, numJugadors, data, comentaris ) VALUES (?, ?, ?, ?, NULLIF(?, ''), NULLIF(?, ''))",
          [partidaId , joc.bggId, organitzador.uid, numJugadors, data, comentaris]
        );

        if (joc.bggId > 0){
            //console.log("check", joc.bggId , q.queryCheckBgg)
            // Check if exists
            const [checkBgg] = await pool.query(q.queryCheckBgg, [ joc.bggId ]);
            console.log("chequeo Bgg", checkBgg)

            if (checkBgg[0].total == 0)
            {
                console.log("nou joc BGG")
                const [rows] = await pool.query(q.queryInsertBgg, [joc.minJugadors, joc.maxJugadors, joc.dificultat, joc.duracio, joc.edat, joc.expansio, joc.bggId, joc.imatge, joc.joc] );
            }
        }

        
        //console.log('insert realizado', partidaId)
        // Insercion del organizador
        if (rows.affectedRows === 0)
            return res.status(403).json({ message: "Partida not found" });

        let row = await pool.query(
            "INSERT INTO Participants (partidaId, soci, explicador, propietario, need_explicacion  ) VALUES (?, ?, ?, ?, ?)",
                [ partidaId , organitzador.uid, organitzador.explicador, organitzador.propietari, organitzador.need_explicacio]
            );          


        //Retorno de Partida

            //console.log('control 2')
        const [partides] = await pool.query( q.queryListadoPartidas);
        //console.log('control 1')*/
        res.status(201).send({partides});
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something goes wrong" });
    }

}

export const getPartides = async (req,res) => {
    try {
       
        //console.log(query);
        //const [prestecs] = await pool.query('SELECT * FROM Prestecs where dataFi is null order by dataInici asc') 
        const [partides] = await pool.query(q.queryListadoPartidas) 

        //console.log(partides);

        res.status(200).send( {partides} )
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
    
}

export const updatePartidaById = async (req,res) =>{
    try {
        const { partidaId, joc, organitzador, numJugadors, data, participants, oberta, comentaris } = req.body;
        //console.log("update partida", req.body)

        let query = "UPDATE Partides SET bggId = IFNULL(?, bggId), organitzador = IFNULL(?, organitzador), numJugadors = IFNULL(?, numJugadors), " +
                " data = IFNULL(?, data), oberta = IFNULL(?, oberta), comentaris = IFNULL(?,comentaris)  " + 
                " WHERE partidaId = ?"
        
        //console.log(req.body)
        
        const [result] = await pool.query( query ,
        [joc.bggId, organitzador.uid, numJugadors, data, oberta, comentaris, partidaId]
        );

        //console.log(result);
        if (result.affectedRows === 0)
        return res.status(404).json({ message: "Partida not found" });

        //Actualizamos los participantes?

        
        const [partides] = await pool.query(q.queryListadoPartidas);
        //console.log(partides);
        res.status(202).send({partides});
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something goes wrong on update" });
    }
}

export const deletePartidaById = async (req,res) =>{
    try {
        //console.log("eliminado")
        
        const { partidaId } = req.params;

        //console.log(req.params)

        const [participants] = await pool.query("DELETE FROM Participants WHERE partidaId = ?", [partidaId]);
        if (participants.affectedRows <= 0) {
            console.log("No hi ha participants");
        }

        const [partida] = await pool.query("DELETE FROM Partides WHERE partidaId = ?", [partidaId]);
        //console.log("borrado")
        if (partida.affectedRows <= 0) {
            return res.status(404).json({ message: "Partida no esborrada" });
        }

        const [partides] = await pool.query( q.queryListadoPartidas);
        
        //console.log(partides);

        res.sendStatus(204);
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something goes wrong" });
    }
}

export const afegirParticipant = async (req,res) => {
    try {
        const { partida, participant } = req.body;

        let row = await pool.query(
            "INSERT INTO Participants (partidaId, soci, explicador, propietario, need_explicacion  ) VALUES (?, ?, ?, ?, ?)",
                [ partida.partidaId , participant.uid, participant.explicador, participant.propietari, participant.need_explicacio]
            ); 
        
        const [partides] = await pool.query(q.queryListadoPartidas + " and partidaId = ?", [partida.partidaId]);
        //console.log(partides);
        res.status(202).send({partides});

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something goes wrong" });
    }
}

export const eliminarParticipant = async (req,res) => {
    try {
        const { partida, participant } = req.body;
        //console.log(partida)

        let row = await pool.query(
            "DELETE FROM  Participants WHERE partidaId =? AND soci = ? ",
            [ partida.partidaId , participant ]
        );   
        
        const [partides] = await pool.query(q.queryListadoPartidas + " and partidaId = ?", [partida.partidaId]);
        //console.log(partides);
        res.status(202).send({partides});

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something goes wrong" });
    }


}

export const getPartidaById = async (req,res) => {
    try {
       
        const { partidaId } = req.params;
        //console.log(query);
        //const [prestecs] = await pool.query('SELECT * FROM Prestecs where dataFi is null order by dataInici asc') 
        const [partides] = await pool.query(q.queryListadoPartidas + " and p.partidaId = ?", [partidaId]) 

        //console.log(partides);

        res.status(200).send( {partides} )
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
    
}