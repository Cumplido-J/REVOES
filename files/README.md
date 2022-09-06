colocarse adentro de esta carpeta y correr el comando

docker-compose up -d

- La aplicación web correrá en el puerto 4000
- El servidor java en el puerto 8080
- La base de datos en el puerto 3307 con la base ya inicializada
- Conectarse a la base con el usuario root y la contraseña c3c1t3.2o19 la base se llama sisec

Usuario con todos los permisos:

- usuario: QUBR950829HMCXRC01
- contraseña: 73b8a2ca654f

Tambien agregué el script completo de la base, lo tuve que correr desde consola para que sirva porque si no los carácteres españoles me los traía como basura con el siguiente comando

mysql -u root -p --default-character-set=utf8 < sisec.sql

# Ejecutar base de datos + scripts + migraciones

## Instalar dependencias

```
npm install
```

o

```
yarn
```

## Correr base de datos

### Base de datos + scripts:

```
node database.js
```

### Laravel seeders:

```
docker-compose exec control-escolar-backend php artisan db:seed
```

### Base de datos + scripts + laravel seeders:

```
npm run database
```

o

```
yarn database
```
