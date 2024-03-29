const connection = require("../config/connection");

async function getTitres() {
  try {
    const pool = await connection();
    const request = pool.request();
    const query = `
select distinct   'EQUITY' Groupe,A.CLASSE,B.SECTEUR_ACTIVITE as CATEGORIE, A.TITRE
TITRE, A.DEST REFERENCE
                 from(
SELECT 'ACTIONS COTEES' as CLASSE,[TITRE_NAME] as TITRE, DESTINATION_TITRE as DEST
   FROM [DataWarehouse].[DIM].[TITRE_MAPPING]


   union
   select 'ACTIONS COTEES' as CLASSE,ticker TITRE, libelle DEST
   from DataWarehouse.DIM.TITRE_BVC
   where FLAG_2L=0
   ) as A
   inner join DataWarehouse.DIM.TITRE_BVC B
   on A.DEST=B.LIBELLE
   union
     (select  'OPCVM' Groupe,'OPC ' + Classification as CLASSE,Societe_Gestion
CATEGORIE, DENOMINATION_OPCVM TITRE,DENOMINATION_OPCVM REFERENCE

   from (
                                select *, count(*) over (partition by
DENOMINATION_OPCVM  order by date_expiration desc) as NB
                 from DataWarehouse.DIM.OPCVM
                 ) as A
                 where NB=1 )
union
        (select 'INDICE' Groupe, CLASSE as CLASSE,iif(CLASSE='TAUX',S_CATEGORIE,CATEGORIE) CATEGORIE, NOM_INDICE
TITRE,NOM_INDICE REFERENCE
   from DataWarehouse.DIM.INDICE
   where FLAG_ACTIF=1)`;

    const result = await request.query(query);

    return result.recordset;
  } catch (error) {
    return [];
  }
}

module.exports = getTitres;
