use sisec;

/* eliminar doble docente CARLOS SOTELO */
/* curp incorrecta: SOAC761225HBSTVE09, id 188*/
/* select * from docente where curp = 'SOAC761225HBSTVE09';
/* select * from plantilla_docente where docente_id = 188;
/* modificar plantilla id 194 */

/* select * from docente_asignatura where plantilla_docente_id = 194; /* no hay asignaturas */
update plantilla_docente set docente_id = 217 where id = 194; /* transferir plantillas */
/* select * from usuario_docente where docente_id = 188; */
/* usuario: 360107 docente: 188 */
delete from usuario_docente where id = 188;
delete from usuario where id = 360107;
delete from docente where id = 188; /* eliminar docente y usuario*/
/* eliminacion de docente repetido y cambio de curp/usaername*/

/* eliminar doble docente ISAURA SALGADO */
/* curp incorrecta: SATI800819MBSLR06, id 275*/
/* select * from docente where curp = 'SATI800819MBSLR06'; */
/* curp corracta: SATI800919MBSLRS06, id 216*/
/* select * from docente where curp = 'SATI800919MBSLRS06'; */
/* asignacion de docente error */
/* select * from plantilla_docente where docente_id = 275; */
delete from plantilla_docente where id = 287; /* eliminar asignacion incorrecta */
/* eliminar usuario */
/* select * from usuario_docente where docente_id = 275; */
/* usuario: 360107 docente: 188 */
delete from usuario_docente where id = 275;
delete from usuario where id = 360194;
delete from docente where id = 275; /* eliminar docente y usuario*/


/* eliminar doble docente LUIS ARBALLO */
/* curp incorrecta: AACL860804HBSRTS0, id 278*/
/* select * from docente where curp = 'AACL860804HBSRTS0'; */
/* curp incorrecta/correcta: AACL860804HBSRT05, correcta: AACL860804HBSRTS05  id = 284*/
/* select * from docente where curp = 'AACL860804HBSRT05'; */
/* cambio de curp */
update docente set curp = 'AACL860804HBSRTS05' where id = 284;
/* eliminar asignacion incorrecta  del docente correcto*/
/*select * from plantilla_docente where docente_id = 284;*/
/* eliminar asignacion incorrecta */
delete from plantilla_docente where id = 296;
/* select * from plantilla_docente where docente_id = 278; */
delete from plantilla_docente where id = 290; 
/* eliminar usuario */
/* select * from usuario_docente where docente_id = 278; */
/* usuario: 360107 docente: 188 */
delete from usuario_docente where id = 278;
delete from usuario where id = 360197;
delete from docente where id = 278; /* eliminar docente y usuario*/

/* eliminar doble docente ALEJANDRO ALBERTO con curp error y unir asignacioones */
/* curp incorrecta: 0EAA850925HBSJBL08, id 147*/
/* select * from docente where curp = '0EAA850925HBSJBL08';
/* curp corracta: OEAA850925HBSJBL08, id 35*/
/* select * from docente where curp = 'OEAA850925HBSJBL08';
/* asignacion de docente error */
/* select * from plantilla_docente where docente_id = 147;*/
update plantilla_docente set docente_id = 35 where id = 153; /* editar asignacion del docente incorrecto */
/* eliminar usuario */
/*select * from usuario_docente where docente_id = 147;
/* usuario: 360107 docente: 188 */
delete from usuario_docente where id = 147;
delete from usuario where id = 360066;
delete from docente where id = 147; /* eliminar docente y usuario*/

/* eliminar doble docente REYNA SOLIS con curp error y unir asignacioones */
/* curp incorrecta: SOCR720106MMCIRY08 id = , id 115 y CURP: SOCR720106MDFLRY03 id = 69
select * from docente where curp = 'SOCR720106MDFLRY08'; /* curp real 
select * from docente where curp = 'SOCR720106MDFLRY03'; /* curp incorrecta */
update docente set curp = 'SOCR720106MDFLRY08' where id = 69; /* asignar curp correcta */
/* select * from docente where curp = 'SOCR720106MMCIRY08'; /* curp incorrecta */
/* curp corracta: id 69*/
/* asignacion de docente error */
/*select * from plantilla_docente where docente_id = 115; /* re asignatar asignacion docente */
update plantilla_docente set docente_id = 69 where id = 121; /* editar asignacion del docente incorrecto */
/* eliminar usuario */
/*select * from usuario_docente where docente_id = 115;*/
/* usuario: 360107 docente: 188 */
delete from usuario_docente where id = 115;
delete from usuario where id = 360034;
delete from docente where id = 115; /* eliminar docente y usuario*/


/* eliminar doble docente MIRYAM RUIZ con curp error y unir asignacioones */
/* curp incorrecta: RUCN870117MCHZSR08 id = , id 137
select * from docente where curp = 'RUCN870117MCHZSR08'; /* curp incorrecta
/* curp correcta: RUCM870117MCHZSR08 id = 68 
select * from docente where curp = 'RUCM870117MCHZSR08'; /* curp correcta */
/* curp corracta: id 68*/
/* asignacion de docente error 
select * from plantilla_docente where docente_id = 137; /* re asignatar asignacion docente */
update plantilla_docente set docente_id = 68 where id = 143; /* editar asignacion del docente incorrecto */
/* eliminar usuario 
select * from usuario_docente where docente_id = 137;
/* usuario: 360107 docente: 188 */
delete from usuario_docente where id = 137;
delete from usuario where id = 360056;
delete from docente where id = 137; /* eliminar docente y usuario*/

/* eliminar doble docente ADRIANA ARMENTA corregir curp y eliminar duplicado */
/* curp incorrecta: AEGA9000526MSLRRD0 y AEGA900526MSLRRD0 id = , id 137*/
/* curp correcta: AEGA900526MSLRRD05
select * from docente where curp = 'AEGA9000526MSLRRD0'; /* curp incorrecta 
select * from docente where curp = 'AEGA900526MSLRRD0'; /*curp correcta */
/* eliminar docente id = 296 y modificar curop de 80 */
update docente set curp = 'AEGA900526MSLRRD05' where id = 80; 
/* eliminar asginacion docente 296 
select * from plantilla_docente where docente_id = 296; /* re asignatar asignacion docente */
delete from plantilla_docente where id = 312;
/* eliminar usuario 
select * from usuario_docente where docente_id = 296;
/* usuario: 360107 docente: 188 */
delete from usuario_docente where id = 296;
delete from usuario where id = 415607;
delete from docente where id = 296; /* eliminar docente y usuario*/

/* jose luis id 78 eliminar */
/*select * from docente where id = 78;
select * from plantilla_docente where docente_id = 78; /* re asignatar asignacion docente */
delete from plantilla_docente where docente_id = 78;
/* eliminar usuario */
/*select * from usuario_docente where docente_id = 78;*/
/* usuario: 360107 docente: 188 */
delete from usuario_docente where id = 78;
delete from usuario where id = 359997;
delete from docente where id = 78; /* eliminar docente y usuario*/



