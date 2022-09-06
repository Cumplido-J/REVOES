CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `permisos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usuarios_roles` (
  `role_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usuarios_permisos` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permisos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roles_permisos` (
  `permission_id` bigint(20) unsigned NOT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permisos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint(20) unsigned NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `sisec`.`grupo` 
CHANGE COLUMN `status` `status` ENUM('activo', 'inactivo', 'pendiente') NOT NULL ;

ALTER TABLE `sisec`.`grupo` 
ADD COLUMN `created_at` TIMESTAMP NULL AFTER `status`;

ALTER TABLE `sisec`.`grupo` 
ADD COLUMN `id_original` INT NULL AFTER `created_at`;

ALTER TABLE `sisec`.`grupo_periodo` 
ADD COLUMN `max_alumnos` INT NOT NULL AFTER `grupo_id`;

ALTER TABLE `sisec`.`grupo` 
ADD COLUMN `accion` ENUM('crear', 'editar', 'eliminar') NULL AFTER `status`;

ALTER TABLE `sisec`.`carrera_competencia` 
ADD COLUMN `semestre` INT(11) NULL AFTER `competencia_id`;

ALTER TABLE `sisec`.`competencia` 
ADD COLUMN `clave_competencia` VARCHAR(45) NULL AFTER `competencia_emsad`;

ALTER TABLE `sisec`.`grupo_periodo` 
ADD COLUMN `grupo` VARCHAR(45) NOT NULL AFTER `id`,
ADD COLUMN `semestre` INT(11) NOT NULL AFTER `grupo`,
ADD COLUMN `turno` VARCHAR(5) NOT NULL AFTER `semestre`,
ADD COLUMN `plantel_carrera_id` INT(11) NOT NULL AFTER `grupo_id`,
ADD COLUMN `accion` ENUM('activar', 'editar', 'eliminar') NULL AFTER `status`,
CHANGE COLUMN `max_alumnos` `max_alumnos` INT(11) NOT NULL AFTER `turno`,
CHANGE COLUMN `status` `status` ENUM('activo', 'inactivo', 'pendiente') NOT NULL,
ADD INDEX `plantel_carrera_id_idxGrupoPeriodo` (`plantel_carrera_id` ASC);

ALTER TABLE `sisec`.`grupo_periodo` 
ADD CONSTRAINT `plantel_carrera_id_grupo`
  FOREIGN KEY (`plantel_carrera_id`)
  REFERENCES `sisec`.`plantel_carrera` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `sisec`.`grupo_periodo` 
ADD COLUMN `id_original` INT NULL AFTER `accion`;

CREATE TABLE `sisec`.`grupo_periodo_optativa` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `grupo_periodo_id` INT(11) NOT NULL,
  `uac_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `grupo_periodo_id_idx` (`grupo_periodo_id` ASC),
  INDEX `uac_id_idx` (`uac_id` ASC),
  CONSTRAINT `grupo_periodo_id_optativa`
    FOREIGN KEY (`grupo_periodo_id`)
    REFERENCES `sisec`.`grupo_periodo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `uac_id_optativa`
    FOREIGN KEY (`uac_id`)
    REFERENCES `sisec`.`uac` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

