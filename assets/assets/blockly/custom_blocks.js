// custom_blocks.js

// ============= BLOCS STRUCTURE PROGRAMME =============

Blockly.Blocks['ilo_setup'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("⚙️ SETUP (initialisation)");
    this.appendStatementInput("STATEMENTS")
      .setCheck(null);
    this.setColour("#FF9500");
    this.setTooltip("Code exécuté une seule fois au démarrage du programme.");
    this.setDeletable(false);
    this.hat = 'cap'; // Chapeau arrondi
  }
};

Blockly.Blocks['ilo_loop'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("🔁 LOOP (boucle infinie)");
    this.appendStatementInput("STATEMENTS")
      .setCheck(null);
    this.setColour("#FF3B30");
    this.setTooltip("Code exécuté en boucle jusqu'à l'arrêt du programme.");
    this.setDeletable(false);
    this.hat = 'cap'; // Chapeau arrondi
  }
};

// ============= BLOCS MOUVEMENTS =============

Blockly.Blocks['ilo_move'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Avancer/Reculer")
      .appendField(new Blockly.FieldDropdown([
        ["avant","front"],["arrière","back"],["gauche","left"],["droite","right"]
      ]), "DIR");
    this.appendDummyInput()
      .appendField("distance (cm)")
      .appendField(new Blockly.FieldNumber(100, 0, 1000), "DIST");
    this.appendDummyInput()
      .appendField("accélération")
      .appendField(new Blockly.FieldNumber(200, 0, 300), "ACC");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#50E3C2");
    this.setTooltip("Déplace Ilo dans une direction.");
  }
};

Blockly.Blocks['ilo_rotate'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Rotation")
      .appendField("angle (°)")
      .appendField(new Blockly.FieldNumber(90, -360, 360), "ANGLE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#50E3C2");
    this.setTooltip("Rotation autour de l'axe vertical.");
  }
};

Blockly.Blocks['ilo_set_led'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("LED bas (R,G,B)");
    this.appendDummyInput()
      .appendField("R")
      .appendField(new Blockly.FieldNumber(255, 0, 255), "R");
    this.appendDummyInput()
      .appendField("G")
      .appendField(new Blockly.FieldNumber(0, 0, 255), "G");
    this.appendDummyInput()
      .appendField("B")
      .appendField(new Blockly.FieldNumber(0, 0, 255), "B");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#A259FF");
    this.setTooltip("Change la couleur de la LED inférieure.");
  }
};

Blockly.Blocks['ilo_set_bottom_light'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("LED bas intensité")
      .appendField(new Blockly.FieldNumber(128, 0, 255), "VALUE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#A259FF");
    this.setTooltip("Définit l'intensité de la LED inférieure (0-255).");
  }
};

Blockly.Blocks['ilo_motor_speed'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Moteur vitesse");
    this.appendDummyInput()
      .appendField("ID moteur")
      .appendField(new Blockly.FieldNumber(1, 1, 8, 1), "MOTOR_ID");
    this.appendDummyInput()
      .appendField("Vitesse")
      .appendField(new Blockly.FieldNumber(0, -7000, 7000), "SPEED");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#50E3C2");
    this.setTooltip("Contrôle la vitesse d'un moteur (-7000 à 7000).");
  }
};

Blockly.Blocks['ilo_motor_position'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Moteur position");
    this.appendDummyInput()
      .appendField("ID moteur")
      .appendField(new Blockly.FieldNumber(1, 1, 8, 1), "MOTOR_ID");
    this.appendDummyInput()
      .appendField("Position")
      .appendField(new Blockly.FieldNumber(2048, 0, 4096), "POSITION");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#50E3C2");
    this.setTooltip("Définit la position d'un moteur (0-4096).");
  }
};

Blockly.Blocks['ilo_stop_all'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("🛑 ARRÊT COMPLET");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FF5A5F");
    this.setTooltip("Arrête tous les mouvements du robot.");
  }
};

Blockly.Blocks['ilo_set_tempo'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Tempo déplacement")
      .appendField(new Blockly.FieldNumber(100, 0, 5000), "TEMPO")
      .appendField("ms");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4A90E2");
    this.setTooltip("Délai entre les déplacements du robot.");
  }
};

Blockly.Blocks['ilo_start_trame_s'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Démarrer trame S");
    this.appendDummyInput()
      .appendField("Hz (1-100)")
      .appendField(new Blockly.FieldNumber(10, 1, 100), "HZ");
    this.appendDummyInput()
      .appendField("params")
      .appendField(new Blockly.FieldTextInput("battery,angle"), "PARAMS");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FFB020");
    this.setTooltip("Commence l'envoi périodique des capteurs.");
  }
};

Blockly.Blocks['ilo_stop_trame_s'] = {
  init: function() {
    this.appendDummyInput().appendField("Arrêter trame S");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#FFB020");
    this.setTooltip("Stoppe l'envoi périodique des capteurs.");
  }
};

Blockly.Blocks['ilo_delay'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Attendre")
      .appendField(new Blockly.FieldNumber(300, 0, 10000), "MS")
      .appendField("ms");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4A90E2");
    this.setTooltip("Pause entre deux actions.");
  }
};

Blockly.Blocks['ilo_display'] = {
  init: function() {
    this.appendValueInput("VALUE")
      .setCheck(["Number", "String"])
      .appendField("📺 Afficher");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4A90E2");
    this.setTooltip("Affiche une valeur dans la console (capteur, nombre, etc.)");
  }
};

Blockly.Blocks['ilo_raw'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("Envoyer trame brute");
    this.appendDummyInput()
      .appendField("commande")
      .appendField(new Blockly.FieldTextInput("<40>"), "CMD");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("#4A90E2");
    this.setTooltip("Envoie une trame texte telle quelle.");
  }
};

// ============= BLOC CAPTEUR =============



// ============= BLOCS CAPTEURS =============

Blockly.Blocks['ilo_sensor_value'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("📡 capteur distance")
      .appendField(new Blockly.FieldDropdown([
        ["avant", "front"],
        ["arrière", "back"],
        ["gauche", "left"],
        ["droite", "right"]
      ]), "WHICH");
    this.setOutput(true, "Number");
    this.setColour("#FFB020");
    this.setTooltip("Valeur du capteur de distance (0-400)");
  }
};

Blockly.Blocks['ilo_sensor_imu'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("🧭 capteur IMU")
      .appendField(new Blockly.FieldDropdown([
        ["Roll", "roll"],
        ["Pitch", "pitch"],
        ["Yaw", "yaw"]
      ]), "WHICH");
    this.setOutput(true, "Number");
    this.setColour("#FFB020");
    this.setTooltip("Valeur du capteur IMU en degrés");
  }
};

Blockly.Blocks['ilo_sensor_battery'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("🔋 batterie")
      .appendField(new Blockly.FieldDropdown([
        ["Niveau (%)", "battery_level"],
        ["En charge", "battery_charging"]
      ]), "WHICH");
    this.setOutput(true, "Number");
    this.setColour("#FFB020");
    this.setTooltip("Niveau de batterie (0-100%) ou état de charge (0/1)");
  }
};

Blockly.Blocks['ilo_sensor_color'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("🎨 capteur couleur");
    this.appendDummyInput()
      .appendField("Position")
      .appendField(new Blockly.FieldDropdown([
        ["Centre", "center"],
        ["Gauche", "left"],
        ["Droite", "right"]
      ]), "POSITION");
    this.appendDummyInput()
      .appendField("Composante")
      .appendField(new Blockly.FieldDropdown([
        ["Rouge (R)", "r"],
        ["Vert (G)", "g"],
        ["Bleu (B)", "b"]
      ]), "COMPONENT");
    this.setOutput(true, "Number");
    this.setColour("#FFB020");
    this.setTooltip("Valeur RGB du capteur de couleur (0-255)");
  }
};

Blockly.Blocks['ilo_sensor_motor'] = {
  init: function() {
    this.appendDummyInput()
      .appendField("⚙️ état moteur");
    this.appendDummyInput()
      .appendField("ID moteur")
      .appendField(new Blockly.FieldNumber(1, 1, 8, 1), "MOTOR_ID");
    this.appendDummyInput()
      .appendField("Paramètre")
      .appendField(new Blockly.FieldDropdown([
        ["Vitesse", "speed"],
        ["Position", "position"],
        ["Température", "temperature"],
        ["Voltage", "voltage"],
        ["Courant", "current"],
        ["En mouvement", "moving"],
        ["Actif", "status"]
      ]), "PARAM");
    this.setOutput(true, "Number");
    this.setColour("#FFB020");
    this.setTooltip("État d'un moteur spécifique");
  }
};
