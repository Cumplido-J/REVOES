-- Script que realiza correcciones ortográficas en los nombre de los drectores de planteles de BCS
USE sisec;
-- Cecyt 01 Mulegé
-- Actual: Lic. enrique Medina Rios
-- Correción: Lic. Enrique Medina Ríos
UPDATE personal_plantel SET nombre_director = "Lic. Enrique Medina Ríos" 
	WHERE id = 1;

-- Cecyt 02 Todos Sandos
-- Actual: Ing. Raul Jaramillo Ramirez
-- Correción: Ing. Raul Jaramillo Ramirez
UPDATE personal_plantel SET nombre_director = "Ing. Raul Jaramillo Ramírez" 
	WHERE id = 2;

-- Cecyt 03 Santiago
-- Actual: Lic. Rosario Guadalupe Hernandez Estrada
-- Correción: Ing. Rosario Guadalupe Hernández Estrada
UPDATE personal_plantel SET nombre_director = "Ing. Rosario Guadalupe Hernández Estrada" 
	WHERE id = 3;

-- Cecyt 05 Cabo San Lucas
-- Actual: Lic. Cirilo Fernando Cortes Mendoza
-- Correción: Lic. Cirilo Fernando Cortés Mendoza
UPDATE personal_plantel SET nombre_director = "Lic. Cirilo Fernando Cortés Mendoza" 
	WHERE id = 5;

-- Cecyt 07 San José del Cabo
-- Actual: Lic. Diego Garcia Garcia
-- Correción: Lic. Diego García García
UPDATE personal_plantel SET nombre_director = "Lic. Diego García García" 
	WHERE id = 7;

-- Cecyt 10 Ciudad Constitución
-- Actual: Lic. Alonso Zúñiga Ibarra
-- Correción: Lic. Alonso Zúñiga Ibarra
UPDATE personal_plantel SET nombre_director = "Lic. Alonso Zúñiga Ibarra" 
	WHERE id = 10;

	-- Cecyt 11 El Centenario
-- Actual:  Lic. Pablo Moises Aviles Matus 
-- Correción:  Lic. Pablo Moises Avilés Matus 
UPDATE personal_plantel SET nombre_director = "Lic. Pablo Moises Avilés Matus " 
	WHERE id = 11;

-- Emsad 01 Bahía Asunción
-- Actual: Profr. Luis Fernandez Ojeda
-- Correción: Lic. Luis Fernéndez Ojeda
UPDATE personal_plantel SET nombre_director = "Lic. Luis Fernéndez Ojeda" 
	WHERE id = 12;

-- Emsad 03 Bahía Tortugas
-- Actual: Lic. Martin Garcia Arce 
-- Correción: Lic. Martín García Arce 
UPDATE personal_plantel SET nombre_director = "Lic. Martín García Arce " 
	WHERE id = 13;

-- Emsad 07 San Ignacio
-- Actual: Profr. Jose Lino Fontes Murillo
-- Correción: Lic. José Lino Fontes Murillo
UPDATE personal_plantel SET nombre_director = "Lic. José Lino Fontes Murillo" 
	WHERE id = 15;

-- Emsad 10 Puerto Adolfo López Mateos
-- Actual: Profr. Jose Manuel Miranda Cadena
-- Correción: Profr. Jose Manuel Miranda Cadena
UPDATE personal_plantel SET nombre_director = "Profr. José Manuel Miranda Cadena" 
	WHERE id = 18;

-- Emsad 11 San Isidro
-- Actual: Lic. Monica Ramona Meza Higuera
-- Correción: Lic. Mónica Ramona Meza Higuera
UPDATE personal_plantel SET nombre_director = "Lic. Mónica Ramona Meza Higuera" 
	WHERE id = 19;

-- Emsad 12 Las Pocitas
-- Actual: Ing. Jose Guillermo Barajas Lizardi
-- Correción: Ing. José Guillermo Barajas Lizardi
UPDATE personal_plantel SET nombre_director = "Ing. José Guillermo Barajas Lizardi" 
	WHERE id = 20;

	-- Emsad 16 Los Barriles
-- Actual: Lic. Liliana Burquez Acevedo
-- Correción: Lic. Liliana Búrquez Acevedo
UPDATE personal_plantel SET nombre_director = "Lic. Liliana Búrquez Acevedo" 
	WHERE id = 23;


