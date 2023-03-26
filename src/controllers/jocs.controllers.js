import { pool } from "../database.js"
import xml2json from "xml2json";
import * as q from "../queries.js";



export const createJoc = async (req,res) =>{

    try {
        
        //console.log(req.body)
        const { jocId, joc, tipologia, ambit, comentaris, minJugadors, maxJugadors, dificultat, duracio, edat, expansio, bggId, imatge } = req.body;
        const [rows] = await pool.query(
          "INSERT INTO Coleccio (jocId, joc, tipologia, ambit, comentaris, bggId ) VALUES (?, ?, ?, ?, ?, ?)",
          [jocId, joc, tipologia, ambit, comentaris, bggId]
        );

        if (bggId > 0){
            
            // Check if exists
            const [checkBgg] = await pool.query(q.queryCheckBgg, [bggId ]);
            console.log("chequeo Bgg", checkBgg[0].total)
            
            if (checkBgg[0].total == 0)
            {
                console.log("nou joc BGG")
                const [rows] = await pool.query(q.queryInsertBgg, [minJugadors, maxJugadors, dificultat, duracio, edat, expansio, bggId, imatge, joc] );
            }
            // Check update Bgg?
        }
        //console.log('insert realizado')
        
        if (rows.affectedRows === 0)
            return res.status(403).json({ message: "Joc not found" });

       
        const [jocs] = await pool.query(q.queryJuego,[jocId]) 
        
        console.log('Insertado el juego ', joc, ' BggId: ', bggId)

    res.status(201).json(jocs[0]);
        
    } catch (error) {
        return res.status(500).json({ error });
    }

}

export const getJocs = async (req,res) => {
    try {
       
        //const [jocs] = await pool.query('SELECT J.*, IF(PD.jocId is null, 1, 0) disponible from Jocs J left outer join (select  jocId from Prestecs P where P.dataFi is null) PD on PD.jocId = J.jocId order by joc asc') 
        const [jocs] = await pool.query(q.queryListadoJuegos);
        res.json({ jocs })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something goes wrong" });
    }
    
}

export const getJocById = async (req,res) =>{

    try {
     
        const [joc] = await pool.query(q.queryJuego,[req.params.jocId]) 
        
        /*SELECT J.*, PD.jocId from Jocs J
left outer join (select jocId from Prestecs P where P.dataFi is null) PD on PD.jocId = J.jocId;*/
        if (joc.length <= 0) 
            return res.status(404).json({ message: 'Joc no trobat' })

        res.status(200).json(joc[0])
    
    } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
    }
}

export const updateJoc = async (req,res) =>{
    try {

        //console.log(req.body)

        const { jocId, joc, tipologia, ambit, comentaris, minJugadors, maxJugadors, dificultat, duracio, edat, expansio, bggId, imatge } = req.body;

        if (bggId > 0){
            
            // Check if exists
            const [checkBgg] = await pool.query(q.queryCheckBgg, [bggId ]);
            console.log("chequeo Bgg", checkBgg[0].total)

            if (checkBgg[0].total == 0)
            {
                console.log("nou joc BGG")
                const [rows] = await pool.query(q.queryInsertBgg, [minJugadors, maxJugadors, dificultat, duracio, edat, expansio, bggId, imatge, joc] );
            }
            else{
                console.log("update joc BGG")
                const [rows] = await pool.query(q.queryUpdateBgg, [minJugadors, maxJugadors, dificultat, duracio, edat, expansio, imatge, joc, bggId] );
                console.log(req.body);
            }
        }
        
        
        
        const [result] = await pool.query( q.queryUpdateJoc ,
        [joc, tipologia, ambit, comentaris, bggId, jocId]
        );

        //console.log(result);
        if (result.affectedRows === 0)
        return res.status(404).json({ message: "Joc not found" });

        const [rows] = await pool.query(q.queryJuego, [jocId ]);

        res.json(rows[0]);
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Something goes wrong on update" });
    }
}

export const deleteJocById = async (req,res) =>{
    try {
        
        const { jocId } = req.params;
        console.log(req.params)

        const [rows] = await pool.query("DELETE FROM Coleccio WHERE jocId = ?", [jocId]);

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

        let url = "https://api.geekdo.com/xmlapi2/thing?id="+jocId + "&videos=1&stats=1"
        //url = "https://api.geekdo.com/xmlapi/boardgame/"+jocId+"&stats=1"
//        console.log(url)
        
        const responseBgg = await fetch(url)
        const contentBgg = await responseBgg.text();
            
        const data =  xml2json.toJson(contentBgg);
       
        res.status(200).send(data)
          

        
    } catch (e) {
        console.log(e)
        return res.status(500).send( {error :  e });
    }
}

export const searchBggByName = async (req,res) =>{
    console.log("entradon en busqueda BGG")
    try {
    const { query } = req.params;
    let url = "https://api.geekdo.com/xmlapi2/search?query=" + query

    console.log("Buscando en BGG", query)

    const responseBgg = await fetch(url)
    const contentBgg = await responseBgg.text();
        
    const data =  xml2json.toJson(contentBgg);

    let resultatsJson = JSON.parse(data);
    let resultats = resultatsJson.items.item;
    let total = resultatsJson.items.total;
   
    //console.log(resultatsJson)
    //console.log(resultats)
    //Si hay resultados enriquecemos el texto
    if (resultats)
    {
       // total = resultats.length

        let ids=''
        if (resultats.length  > 0) {
        //console.log("mathcings encontrados")

            let jocsArray = [];
            resultats.forEach(joc => {
                jocsArray.push(joc.id)
            });
            ids = jocsArray.join(',')
        }else{

            ids = resultats.id
        }

            //console.log(jocsArray.join(','))
            let nextUrl = "https://api.geekdo.com/xmlapi2/thing?id="+ids+"&stats=1&type=boardgame"
            //let nextUrl = "https://api.geekdo.com/xmlapi/boardgame/"+jocsArray.join(',')+"&stats=1"
            const responseNextBgg = await fetch(nextUrl)
            const contentNextBgg = await responseNextBgg.text();
            let dataNext =  xml2json.toJson(contentNextBgg);
            //console.log(dataNext)
            
            resultatsJson = JSON.parse(dataNext);
            
            //console.log(resultatsJson)
            resultats = resultatsJson;
            //console.log(resultats)

    }else{
        resultats = null;
    }
    console.log("Elementos encontrados", total)
    //res.status(200).send(data)
    res.status(200).send( resultats)      
     
    } catch (e) {
        console.log(e)
        return res.status(500).send( {error :  e });
    }
}