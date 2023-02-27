
/* Juegos */
export const queryJuego=" SELECT C.jocId, C.joc, C.bggId, C.comentaris, C.ambit, C.tipologia, " +
    "JB.expansio, JB.minJugadors, JB.maxJugadors, JB.dificultat, JB.duracio, JB.edat, JB.imatge, " +
    "IF(PD.jocId is null, 1, 0) disponible " +
    "from Coleccio C " +
    "left outer join (select  jocId from Prestecs P where P.dataFi is null) PD on PD.jocId = C.jocId " +
    "left outer join Jocs JB on JB.bggId = C.bggId " +
    " WHERE C.jocId = ? " 
        

export const queryListadoJuegos=" SELECT C.jocId, C.joc, C.bggId, C.comentaris, C.ambit, C.tipologia, " +
    "JB.expansio, JB.minJugadors, JB.maxJugadors, JB.dificultat, JB.duracio, JB.edat, JB.imatge, " +
    "IF(PD.jocId is null, 1, 0) disponible " +
    "from Coleccio C " +
    "left outer join (select  jocId from Prestecs P where P.dataFi is null) PD on PD.jocId = C.jocId " +
    "left outer join Jocs JB on JB.bggId = C.bggId " +
    "order by C.joc asc"

export const queryUpdateJoc = "UPDATE Coleccio SET joc = IFNULL(?, joc), tipologia = IFNULL(?, tipologia), ambit = IFNULL(?, ambit), comentaris = IFNULL(?, comentaris), " +
    "bggId = IFNULL(?, bggId) WHERE jocId = ?";                


/* Juegos BGG */

export const queryCheckBgg =  "select count(*) as total from Jocs where bggId = ?";  

export const queryInsertBgg = "INSERT INTO Jocs (minJugadors, maxJugadors, dificultat, duracio, edat, expansio, bggId, imatge, name ) VALUES ( ?, ?, ?,?, ?, ?, ?, ?, ?)";

export const queryUpdateBgg = "UPDATE Jocs SET minJugadors = IFNULL(?, minJugadors), maxJugadors = IFNULL(?, maxJugadors), dificultat = IFNULL(?, dificultat), "+
                " duracio = IFNULL(?, duracio), edat = IFNULL(?, edat), expansio = IFNULL(?, expansio), imatge = IFNULL(?, imatge), name = IFNULL(?, name)  " +
                " WHERE bggId = ?";

                             
/*  PARTIDES */
                      

export const queryListadoPartidas =    "select  p.partidaId, DATE_FORMAT(p.data, '%Y-%m-%d') as data, p.numJugadors, p.oberta, p.comentaris,  "+
       " (select cast(  JSON_OBJECT('joc',j.name, 'bggId', j.bggId, 'expansio', j.expansio, 'minJugadors', j.minJugadors,  'maxJugadors', j.minJugadors, "+
       " 'dificultat', j.dificultat, 'duracio', j.duracio, 'edat',j.edat,'imatge', j.imatge)  AS JSON )  from Jocs j where j.bggId = p.bggId)  as 'joc', " +
     "(select JSON_ARRAYAGG( JSON_OBJECT( 'uid', u.uid, 'displayName', u.displayName, 'email', u.email, 'rol', u.rol, 'photoURL',  " +
        "u.photoURL,'parella', u.parella) ) from Usuaris u, Participants Par where Par.soci = u.uid and Par.partidaId = p.partidaId)  as 'participants',  " +
    " (select JSON_OBJECT( 'uid', u.uid, 'displayName', u.displayName, 'email', u.email, 'rol', u.rol, 'photoURL', u.photoURL,'parella', u.parella) from Usuaris u where u.uid = p.organitzador) as 'organitzador' " +
    " from Partides p"


/* PRESTECS */

export const queryInsertPrestec = "INSERT INTO Prestecs (prestecId , jocId, uid, dataInici, dataFi  ) VALUES (?, ?, ?, ?,?)";       

        
export const queryListadoPrestecs = " select p.prestecId, DATE_FORMAT(p.dataInici, '%Y-%m-%d') as 'dataInici',  DATE_FORMAT(p.dataFi, '%Y-%m-%d') as 'dataFi',   " +
        "(select cast(   "+
        "JSON_OBJECT('jocId', c.jocId ,'joc',c.joc, 'bggId', c.bggId, 'expansio',j.expansio, 'tipologia', c.tipologia, 'ambit',c.ambit, " +
        "'minJugadors',j.minJugadors, 'maxJugadors',j.maxJugadors,'dificultat', j.dificultat, 'edat',j.edat,'imatge', j.imatge,'comentaris', c.comentaris) " +
        " AS JSON ) from Coleccio c left outer join Jocs j on c.bggId = j.bggId where c.jocId = p.jocId) as 'joc', " +
        "(select cast(  " +
        "JSON_OBJECT( 'uid', u.uid, 'displayName', u.displayName, 'email', u.email, 'rol', u.rol, 'photoURL', u.photoURL,'parella', u.parella)  " +
        "  AS JSON ) from Usuaris u where u.uid = p.uid) as 'usuari' " +
        " from Prestecs p "           