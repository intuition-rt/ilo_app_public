// custom_generators_python.js
// Générateurs Python pour les blocs custom Ilo Robot

// Fonction pour enregistrer les générateurs (sera appelée après l'init complète)
window.registerIloPythonGenerators = function() {
  if (!Blockly || !Blockly.Python) {
    console.error('[Python Generators] Blockly.Python not available!');
    return;
  }
  
  console.log('[Python Generators] Registering custom generators...');

  // ============= BLOCS STRUCTURE PROGRAMME =============

  // SETUP : Code d'initialisation (pas dans une fonction, juste au début)
  Blockly.Python.forBlock['ilo_setup'] = function(block) {
    let statements = Blockly.Python.statementToCode(block, 'STATEMENTS');
    // Retirer l'indentation générée automatiquement par Blockly
    if (statements) {
      statements = statements.replace(new RegExp('^' + Blockly.Python.INDENT, 'gm'), '');
    }
    return (statements || '# Initialisation\n') + '\n';
  };

  // LOOP : Boucle infinie while True (pas dans une fonction def loop)
  Blockly.Python.forBlock['ilo_loop'] = function(block) {
    const statements = Blockly.Python.statementToCode(block, 'STATEMENTS');
    // Créer un while True directement
    const code = 'while True:\n' + 
                 (statements || Blockly.Python.INDENT + 'pass\n');
    return code;
  };

  // ============= BLOCS MOUVEMENTS =============

  Blockly.Python.forBlock['ilo_move'] = function(block) {
    const dir = block.getFieldValue('DIR') || 'front';
    const dist = Number(block.getFieldValue('DIST')) || 100;
    const acc = Number(block.getFieldValue('ACC')) || 200;
    return `ilo.move('${dir}', ${dist}, ${acc})\n`;
  };

  Blockly.Python.forBlock['ilo_rotate'] = function(block) {
    const angle = Number(block.getFieldValue('ANGLE')) || 90;
    return `ilo.rotate(${angle})\n`;
  };

  // ============= BLOCS LUMIÈRE =============

  Blockly.Python.forBlock['ilo_set_led'] = function(block) {
    const r = Number(block.getFieldValue('R')) || 255;
    const g = Number(block.getFieldValue('G')) || 0;
    const b = Number(block.getFieldValue('B')) || 0;
    return `ilo.set_led(${r}, ${g}, ${b})\n`;
  };

  Blockly.Python.forBlock['ilo_set_bottom_light'] = function(block) {
    const value = Number(block.getFieldValue('VALUE')) || 128;
    return `ilo.set_bottom_light(${value})\n`;
  };

  // ============= BLOCS MOTEURS =============

  Blockly.Python.forBlock['ilo_motor_speed'] = function(block) {
    const motorId = Number(block.getFieldValue('MOTOR_ID')) || 1;
    const speed = Number(block.getFieldValue('SPEED')) || 0;
    return `ilo.motor_speed(${motorId}, ${speed})\n`;
  };

  Blockly.Python.forBlock['ilo_motor_position'] = function(block) {
    const motorId = Number(block.getFieldValue('MOTOR_ID')) || 1;
    const position = Number(block.getFieldValue('POSITION')) || 2048;
    return `ilo.motor_position(${motorId}, ${position})\n`;
  };

  // ============= BLOCS CONTRÔLE =============

  Blockly.Python.forBlock['ilo_stop_all'] = function(block) {
    return 'ilo.stop_all()\n';
  };

  Blockly.Python.forBlock['ilo_set_tempo'] = function(block) {
    const tempo = Number(block.getFieldValue('TEMPO')) || 100;
    return `ilo.set_tempo(${tempo})\n`;
  };

  Blockly.Python.forBlock['ilo_delay'] = function(block) {
    const ms = Number(block.getFieldValue('MS')) || 300;
    return `ilo.delay(${ms})\n`;
  };

  Blockly.Python.forBlock['ilo_display'] = function(block) {
    const value = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '0';
    return `print(${value})\n`;
  };

  Blockly.Python.forBlock['ilo_raw'] = function(block) {
    const cmd = block.getFieldValue('CMD') || '<40>';
    return `ilo.raw('${cmd}')\n`;
  };

  // ============= BLOCS STREAM =============

  Blockly.Python.forBlock['ilo_start_trame_s'] = function(block) {
    const hz = Number(block.getFieldValue('HZ')) || 10;
    const paramsStr = block.getFieldValue('PARAMS') || 'battery,angle';
    const params = paramsStr.split(',').map(s => `'${s.trim()}'`).join(', ');
    return `ilo.start_trame_s(${hz}, [${params}])\n`;
  };

  Blockly.Python.forBlock['ilo_stop_trame_s'] = function(block) {
    return 'ilo.stop_trame_s()\n';
  };

  // ============= BLOCS CAPTEURS =============

  Blockly.Python.forBlock['ilo_sensor_value'] = function(block) {
    const which = block.getFieldValue('WHICH') || 'front';
    return [`ilo.sensor['${which}']`, Blockly.Python.ORDER_MEMBER];
  };

  Blockly.Python.forBlock['ilo_sensor_imu'] = function(block) {
    const which = block.getFieldValue('WHICH') || 'roll';
    return [`ilo.imu['${which}']`, Blockly.Python.ORDER_MEMBER];
  };

  Blockly.Python.forBlock['ilo_sensor_battery'] = function(block) {
    const which = block.getFieldValue('WHICH') || 'battery_level';
    if (which === 'battery_level') {
      return ['ilo.battery_level', Blockly.Python.ORDER_MEMBER];
    } else {
      return ['ilo.battery_charging', Blockly.Python.ORDER_MEMBER];
    }
  };

  Blockly.Python.forBlock['ilo_sensor_color'] = function(block) {
    const position = block.getFieldValue('POSITION') || 'center';
    const component = block.getFieldValue('COMPONENT') || 'r';
    return [`ilo.color_${position}['${component}']`, Blockly.Python.ORDER_MEMBER];
  };

  Blockly.Python.forBlock['ilo_sensor_motor'] = function(block) {
    const motorId = Number(block.getFieldValue('MOTOR_ID')) || 1;
    const param = block.getFieldValue('PARAM') || 'speed';
    return [`ilo.motor[${motorId}]['${param}']`, Blockly.Python.ORDER_MEMBER];
  };

  const count = Object.keys(Blockly.Python.forBlock).filter(k => k.startsWith('ilo_')).length;
  console.log('[Ilo] ✅ Python generators registered successfully (' + count + ' generators in forBlock)');
};

// Appeler immédiatement si Blockly.Python est déjà disponible
if (typeof Blockly !== 'undefined' && Blockly.Python) {
  window.registerIloPythonGenerators();
}
