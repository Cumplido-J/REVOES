console.log("Conectando con el sistema...");

const mysql = require("mysql2");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const scriptFolder = "./scripts/";
const scripts = [];
const sqlRegex = /.*\.sql$/;

console.log("=====================");
console.log("> Creando conexión...");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: "3307",
  user: "certificados",
  password: "c3c1t3.2o19",
  multipleStatements: true, // Permite ejecutar os archivos como strings
});

const getScripts = () => {
  const filesToReturn = [];

  console.log("======================");
  console.log("> Buscando archivos...");

  console.log("✅", filesToReturn[0].file);

  fs.readdirSync(scriptFolder).forEach((file) => {
    if (file && file.match(sqlRegex)) {
      filesToReturn.push({
        file: scriptFolder + file,
        content: fs.readFileSync(scriptFolder + file).toString(),
      });

      console.log("✅", filesToReturn[filesToReturn.length - 1].file);
    } else {
      console.log("❌", scriptFolder + file);
    }
  });
  return filesToReturn;
};

const exec = (dropDb) => {
  console.log("===============");
  console.log("> Conectando...");
  connection.connect(function (err) {
    if (err) {
      console.error("❌", "Error al conectar: ", err.stack);
      process.exit(0);
    } else {
      console.log("✅", "Conexión establecida con el id", connection.threadId);
      scripts.push(...getScripts());
      const execScripts = (index) => {
        if (scripts.length === index) {
          connection.end();
          process.exit(0);
        } else {
          const script = scripts[index];
          console.log("================================================");
          console.log("> Ejecutando", script.file, "...");
          connection.query(script.content, function (error, results) {
            if (error) {
              console.log("================================================");
              console.log("❌", "Error al ejecutar", script.file);
              connection.end();
              throw error;
            } else {
              console.log("✅ Listo");
              execScripts(index + 1);
            }
          });
        }
      };
      if (dropDb) {
        console.log("=====================");
        console.log("> Eliminando base de datos SISEC...");
        connection.query(
          "DROP DATABASE IF EXISTS `sisec`",
          function (error, results) {
            if (error) {
              console.log(
                "============================================================="
              );
              console.error("❌", "Error al eliminar sisec SQL", error);
              process.exit(0);
            } else {
              console.log("✅ Listo");
              execScripts(0);
            }
          }
        );
      } else {
        execScripts(0);
      }
    }
  });
};
exec(false);
