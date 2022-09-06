## Instrucciones
- copiar el contenido del archivo .env.example a .env 
#### `cp .env.example .env`
- configurar el archivo .env con los siguientes datos:
#### `DB_HOST=mysql`
#### `DB_PORT=3307`
#### `DB_DATABASE=sisec`
#### `DB_USERNAME=certificados`
#### `DB_PASSWORD=c3c1t3.2o19`
- Después de ejecutar el comando docker-compose up instalar las dependencias de composer
#### `docker-compose exec control-escolar-backend composer install`
- Ejecutar el comando 
#### `docker-compose exec control-escolar-backend php artisan key:generate`