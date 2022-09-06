USE sisec;

ALTER TABLE `sisec`.`cat_estado` 
ADD COLUMN `tiene_control_escolar` TINYINT NOT NULL DEFAULT 0 AFTER `nombre_oficial`;

UPDATE `sisec`.`cat_estado` SET `tiene_control_escolar` = '1' WHERE (`id` = '3');