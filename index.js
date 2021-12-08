const db = require("quick.db");
let rlSync = require("readline-sync");

const checkSave = db.get("player");
console.log(db.get("player.inventory"));
function generateRandomItemsChest(num) {
  if (checkSave) {
    var items = [],
      itemsDB = db.get("items");
    for (var i = 0; i < num; i++) {
      var item = itemsDB[Math.floor(Math.random() * itemsDB.length + 0)];
      items.push(item);
    }
    return items;
  } else return;
}

function seeInventory() {
  if (checkSave) {
    var player = db.get("player"),
      inventory = db.get("player.inventory");
    console.log("====== Estadísticas jugador ======");
    console.log("Nombre: " + player.name);
    console.log("Vida: " + player.health);
    console.log("Damage: " + player.damage);
    console.log("Cleaned rooms: " + player.cleanedRooms);
    console.log("====== Inventario ======");
    console.log(inventory.map((e) => "- " + e.name).join("\n"));
  } else return;
}
//console.log(generateRandomEnemies(3));
function generateRandomEnemies(num) {
  if (checkSave) {
    var enemies = [],
      enemiesDB = db.get("enemies");
    for (var i = 0; i < num; i++) {
      var enemy = enemiesDB[Math.floor(Math.random() * enemiesDB.length + 0)];
      enemies.push(enemy);
    }
    return enemies;
  } else return;
}

function generateRandomRooms() {
  var randomNumber = /*Math.floor((Math.random() * 5) + 1);*/ 1;
  var chestNum = Math.floor(Math.random() * 3 + 1);
  const queHacer = rlSync.question(
    "Entras en una sala, la cual contiene " +
      chestNum +
      " cofres, ¿que quieres hacer?\n1. Recoger cofres\n2. Seguir explorando\n> "
  );
  if (queHacer == "1") {
    var getPlayerStats = db.get("player"),
      cleanedRoomsStats = getPlayerStats.cleanedRooms;
    const chestItems = generateRandomItemsChest(chestNum + 1);
    var isEnemy = true,
      isBoss = Math.random() < 0.3;

    console.log(
      "Después de buscar en los cofres te has encontrado " +
        chestItems.map((e) => e.name).join(", ") +
        "\n"
    );
    chestItems.forEach((e) => {
      db.push("player.inventory", e);
    });
    if ((isEnemy = true)) {
      //random number 1 to 3
      var EnemiesQuant = Math.floor(Math.random() * 3 + 1),
        Enemies = generateRandomEnemies(EnemiesQuant),
        damageNecesario = cleanedRoomsStats / 2 + 3;

      var questionenemigos1 = rlSync.question(
        "Una vez abres los cofres decides seguir caminando, llevas un rato caminando y de repente te cruzas con " +
          Enemies.map((e) => e.name).join(", ") +
          " ¿que haces?\n1. Atacar\n2. Huir\n\n" +
          "Nota: Para ganar esta batalla debes derrotar a todos ambos enemigos tener un damage mayor a " +
          damageNecesario +
          " (Tu damage actual es de " +
          getPlayerStats.damage +
          ")" +
          "\n> "
      );
      if (questionenemigos1 == 1) {
        if (getPlayerStats.damage > damageNecesario) {
          const DamageRecibido = Enemies.map((e) => e.damage).reduce(
            (a, b) => a + b
          );
          if (getPlayerStats.health - DamageRecibido < 0) {
            rlSync.question(
              "Después de mucho esfuerzo y pociones usadas, no has sido capaz de vencer a los enemigos que habían en la habitación, te has muerto.\n1. Crear partida nueva\n2. Salir\n> "
            );
          } else {
            const enemigosKilled = rlSync.question(
              "Has conseguido derrotar todos los enemigos, después de mucho esfuerzo, que deseas hacer ahora.\n 1.Continuar 2.Ver inventario"
            );
            db.add("player.cleanedRooms", 1);
            if (enemigosKilled == 1) {
              generateRandomRooms();
            } else {
              seeInventory();
            }
          }
        }
      } else if (questionenemigos1 == 2) {
      } else {
      }

      if ((isBoss = true)) {
      }
    } else if (queHacer == "2") {
      console.log("Sigues explorando...");
    } else {
      console.log("No has introducido una opción correcta\n\n\n");
      rlSync.question(
        "Entras en una sala, la cual contiene " +
          chestNum +
          " cofres, ¿qué quieres hacer?\n1. Recoger cofres\n2. Seguir explorando\n> "
      );
    }
  } else if (queHacer == "2") {
    console.log("Sigues explorando...");
  } else;
}

function StartGame() {
  const preguntasIniciales = rlSync.question(
    `Bienvenido al juego, elige lo que quieres hacer\n1. Crear Partida\n2. Continuar Aventura\n> `
  );

  if (preguntasIniciales == "1") {
    console.log("Creando partida...");
    const nombre = rlSync.question("Introduce tu nombre:\n> ");
    db.set("player", {
      name: nombre,
      health: 100,
      damage: 5,
      cleanedRooms: 0,
      inventory: [],
    });
    //Saving all items
    db.set("items", [
      {
        id: 1,
        name: "Espada de Madera",
        description: "Una espada de madera, útil para tus primeras batallas.",
        damage: 10,
        durability: 75,
      },
      {
        id: 2,
        name: "Poción pequeña de vida",
        description: "Usa esta poción cuándo tu vida esté baja",
        heal: 20,
      },
      {
        id: 3,
        name: "Poción grande de vida",
        description: "Usa esta poción cuándo tu vida esté baja",
        heal: 50,
      },
      {
        id: 4,
        name: "Espada de hierro",
        description: "Una espada de hierro, útil para tus batallas.",
        damage: 15,
        durability: 100,
      },
      {
        id: 5,
        name: "Poción rejuvenecedora",
        description: "Esta poción será capáz de curar tu vida",
        heal: 100,
      },
      {
        id: 6,
        name: "Galleta de chocolate",
        description:
          "Una galleta de chocolate, para regenerar un poco de vida.",
        heal: 5,
      },
    ]);
    //Saving all enemies
    db.set("enemies", [
      {
        id: 1,
        name: "Zombie",
        description: "Un zombie, una criatura que puede atacar a tu personaje",
        hp: 10,
        damage: 5,
      },
      {
        id: 2,
        name: "Goblin",
        description: "Un goblin, una criatura que puede atacar a tu personaje",
        hp: 20,
        damage: 10,
      },
      {
        id: 3,
        name: "Orco",
        description: "Un orco, una criatura que puede atacar a tu personaje",
        hp: 30,
        damage: 15,
      },
      {
        id: 4,
        name: "Dragon",
        description: "Un dragon, una criatura que puede atacar a tu personaje",
        hp: 50,
        damage: 20,
      },
    ]);
    console.log(
      "Partida creada con éxito, bienvenido " + nombre + "\n\n\n\n\n"
    );
    StartGame();
  } else if (preguntasIniciales == "2") {
    const comprobarSaves = db.get("player");
    if (comprobarSaves) {
      console.log(
        "Partida cargada con éxito, bienvenido " +
          comprobarSaves.name +
          "\n\n\n\n\n"
      );
      generateRandomRooms();
    } else {
      console.log("No hay partida guardada, crea una nueva\n\n\n\n\n");
      StartGame();
    }
  } else return;
}
StartGame();
