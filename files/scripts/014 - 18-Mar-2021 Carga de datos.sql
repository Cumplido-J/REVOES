USE sisec;

ALTER TABLE `sisec`.`calificacion_alumno_uac` 
CHANGE COLUMN `parcial` `parcial` ENUM('1', '2', '3', '4', '5', '6') NOT NULL ;

ALTER TABLE `sisec`.`alumno` 
CHANGE COLUMN `direccion` `direccion` VARCHAR(150) NULL DEFAULT NULL ;

INSERT INTO `sisec`.`plantel_carrera` (`plantel_id`, `carrera_id`) VALUES ('49', '8');

UPDATE `sisec`.`uac` SET `clave_uac` = '01' WHERE (`id` = '37');
UPDATE `sisec`.`uac` SET `clave_uac` = '02' WHERE (`id` = '38');
UPDATE `sisec`.`uac` SET `clave_uac` = '03' WHERE (`id` = '39');
UPDATE `sisec`.`uac` SET `clave_uac` = '04' WHERE (`id` = '40');
UPDATE `sisec`.`uac` SET `clave_uac` = '05' WHERE (`id` = '41');
UPDATE `sisec`.`uac` SET `clave_uac` = '06' WHERE (`id` = '42');
UPDATE `sisec`.`uac` SET `clave_uac` = '07' WHERE (`id` = '43');
UPDATE `sisec`.`uac` SET `clave_uac` = '08' WHERE (`id` = '44');
UPDATE `sisec`.`uac` SET `clave_uac` = '09' WHERE (`id` = '45');