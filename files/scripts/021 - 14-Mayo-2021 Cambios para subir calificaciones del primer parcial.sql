USE sisec;

UPDATE `sisec`.`grupo_periodo` SET `turno` = 'TV' WHERE (`id` = '171');
UPDATE `sisec`.`grupo_periodo` SET `turno` = 'TV' WHERE (`id` = '182');

/*Hotelería 2B* cecyt09*/
UPDATE `sisec`.`grupo_periodo` SET `grupo` = 'B' WHERE (`id` = '189');
UPDATE `sisec`.`grupo` SET `grupo` = 'B' WHERE (`id` = '189');
/*Hotelería 6B cecyt09*/
UPDATE `sisec`.`grupo_periodo` SET `grupo` = 'A' WHERE (`id` = '192');
UPDATE `sisec`.`grupo` SET `grupo` = 'A' WHERE (`id` = '192');

/*Añadir alumno a grupo de emsad14*/
INSERT INTO `sisec`.`alumno_grupo` (`alumno_id`, `grupo_periodo_id`, `status`) VALUES ('435089', '248', 'Inscrito');
