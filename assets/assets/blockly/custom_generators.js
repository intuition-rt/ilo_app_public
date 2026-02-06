// custom_generators.js

(function () {
  function numOr(Blockly, block, field, def) {
    const v = Blockly.JavaScript.valueToCode(block, field, Blockly.JavaScript.ORDER_NONE) || def;
    try { return JSON.parse(v); } catch { return Number(v) || def; }
  }
  function strOr(Blockly, block, field, def) {
    const v = Blockly.JavaScript.valueToCode(block, field, Blockly.JavaScript.ORDER_NONE) || `"${def}"`;
    try { return JSON.parse(v); } catch { return String(v); }
  }

  const G = {};

  G['ilo_move'] = function(Blockly, block) {
    const dir  = block.getFieldValue('DIR');
    const dist = Number(block.getFieldValue('DIST')) || 100;
    const acc  = Number(block.getFieldValue('ACC')) || 200;
    return { op:'move', dir, dist, acc };
  };

  G['ilo_rotate'] = function(Blockly, block) {
    const angle = Number(block.getFieldValue('ANGLE')) || 90;
    return { op:'rotate', angle };
  };

  G['ilo_set_led'] = function(Blockly, block) {
    const r = Number(block.getFieldValue('R')) || 255;
    const g = Number(block.getFieldValue('G')) || 0;
    const b = Number(block.getFieldValue('B')) || 0;
    return { op:'set_led', r,g,b };
  };

  G['ilo_start_trame_s'] = function(Blockly, block) {
    const hz = Number(block.getFieldValue('HZ')) || 10;
    const paramsStr = block.getFieldValue('PARAMS') || 'battery,angle';
    const params = String(paramsStr).split(',').map(s=>s.trim()).filter(Boolean);
    return { op:'start_trame_s', hz, params };
  };

  G['ilo_stop_trame_s'] = function() {
    return { op:'stop_trame_s' };
  };

  G['ilo_delay'] = function(Blockly, block) {
    const ms = Number(block.getFieldValue('MS')) || 300;
    return { op:'delay', ms };
  };

  G['ilo_raw'] = function(Blockly, block) {
    const cmd = block.getFieldValue('CMD') || '<40>';
    return { op:'raw', command: String(cmd) };
  };

  G['ilo_sensor_value'] = function(Blockly, block) {
    const which = block.getFieldValue('WHICH') || 'front';
    return { type:'sensor', which };
  };

  G['ilo_sensor_imu'] = function(Blockly, block) {
    const which = block.getFieldValue('WHICH') || 'roll';
    return { type:'sensor', which };
  };

  G['ilo_sensor_battery'] = function(Blockly, block) {
    const which = block.getFieldValue('WHICH') || 'battery_level';
    return { type:'sensor', which };
  };

  G['ilo_sensor_color'] = function(Blockly, block) {
    const position = block.getFieldValue('POSITION') || 'center';
    const component = block.getFieldValue('COMPONENT') || 'r';
    const which = `color_${position}_${component}`;
    return { type:'sensor', which };
  };

  G['ilo_sensor_motor'] = function(Blockly, block) {
    const motorId = Number(block.getFieldValue('MOTOR_ID')) || 1;
    const param = block.getFieldValue('PARAM') || 'speed';
    const which = `motor_${motorId}_${param}`;
    return { type:'sensor', which };
  };

  G['ilo_set_bottom_light'] = function(Blockly, block) {
    const value = Number(block.getFieldValue('VALUE')) || 128;
    return { op:'set_bottom_light', value };
  };

  G['ilo_motor_speed'] = function(Blockly, block) {
    const motor = Number(block.getFieldValue('MOTOR_ID')) || 1;
    const speed = Number(block.getFieldValue('SPEED')) || 0;
    return { op:'motor_speed', motor, speed };
  };

  G['ilo_motor_position'] = function(Blockly, block) {
    const motor = Number(block.getFieldValue('MOTOR_ID')) || 1;
    const position = Number(block.getFieldValue('POSITION')) || 2048;
    return { op:'motor_position', motor, position };
  };

  G['ilo_stop_all'] = function() {
    return { op:'stop_all' };
  };

  G['ilo_set_tempo'] = function(Blockly, block) {
    const tempo = Number(block.getFieldValue('TEMPO')) || 100;
    return { op:'set_tempo', tempo };
  };

  G['ilo_display'] = function(Blockly, block) {
    // Récupérer la valeur connectée (capteur ou nombre)
    const valueBlock = block.getInputTargetBlock('VALUE');
    let value = null;
    
    if (valueBlock) {
      const valueType = valueBlock.type;
      
      // Si c'est un capteur, on génère l'objet sensor
      if (valueType === 'ilo_sensor_value') {
        const which = valueBlock.getFieldValue('WHICH') || 'front';
        value = { type: 'sensor', which };
      } else if (valueType === 'ilo_sensor_imu') {
        const which = valueBlock.getFieldValue('WHICH') || 'roll';
        value = { type: 'sensor', which };
      } else if (valueType === 'ilo_sensor_battery') {
        const which = valueBlock.getFieldValue('WHICH') || 'battery_level';
        value = { type: 'sensor', which };
      } else if (valueType === 'ilo_sensor_color') {
        const position = valueBlock.getFieldValue('POSITION') || 'center';
        const component = valueBlock.getFieldValue('COMPONENT') || 'r';
        const which = `color_${position}_${component}`;
        value = { type: 'sensor', which };
      } else if (valueType === 'ilo_sensor_motor') {
        const motorId = Number(valueBlock.getFieldValue('MOTOR_ID')) || 1;
        const param = valueBlock.getFieldValue('PARAM') || 'speed';
        const which = `motor_${motorId}_${param}`;
        value = { type: 'sensor', which };
      } else if (valueType === 'math_number') {
        // Si c'est un nombre
        const num = Number(valueBlock.getFieldValue('NUM')) || 0;
        value = { type: 'num', value: num };
      } else if (valueType === 'text') {
        // Si c'est un texte
        const textValue = valueBlock.getFieldValue('TEXT') || '';
        value = { type: 'text', value: textValue };
      }
    }
    
    return { op: 'display', value };
  };

  // Générateurs pour SETUP et LOOP
  G['ilo_setup'] = function(Blockly, block) {
    // Ne retourne rien directement, sera géré dans workspaceToProgramJSON
    return null;
  };

  G['ilo_loop'] = function(Blockly, block) {
    // Ne retourne rien directement, sera géré dans workspaceToProgramJSON
    return null;
  };

  // ============ GÉNÉRATEURS JAVASCRIPT POUR BLOCKLY.JAVASCRIPT ============
  // Ces générateurs sont nécessaires pour que Blockly ne génère pas d'erreurs
  // quand il rencontre ces blocs. On ne les utilise PAS pour la génération réelle.
  // On retourne juste des placeholders pour éviter les erreurs.
  
  Blockly.JavaScript['ilo_sensor_value'] = function(block) {
    // Retourner un placeholder - ne sera jamais utilisé
    return ['0', Blockly.JavaScript.ORDER_ATOMIC];
  };

  Blockly.JavaScript['ilo_sensor_imu'] = function(block) {
    return ['0', Blockly.JavaScript.ORDER_ATOMIC];
  };

  Blockly.JavaScript['ilo_sensor_battery'] = function(block) {
    return ['0', Blockly.JavaScript.ORDER_ATOMIC];
  };

  Blockly.JavaScript['ilo_sensor_color'] = function(block) {
    return ['0', Blockly.JavaScript.ORDER_ATOMIC];
  };

  Blockly.JavaScript['ilo_sensor_motor'] = function(block) {
    return ['0', Blockly.JavaScript.ORDER_ATOMIC];
  };

  // ============ FIN GÉNÉRATEURS JAVASCRIPT ============;

  function topBlockToSteps(Blockly, block) {
    // Transforme un block (et ses suivants) en liste d'objets étapes
    const steps = [];
    let b = block;
    while (b) {
      const t = b.type;
      if (G[t]) {
        const result = G[t](Blockly, b);
        if (result !== null) {
          steps.push(result);
        }
      }
      b = b.getNextBlock();
    }
    return steps;
  }

  function getStatementsFromBlock(Blockly, block, inputName) {
    const steps = [];
    let child = block.getInputTargetBlock(inputName);
    while (child) {
      const t = child.type;
      
      // Traitement spécial pour les structures de contrôle
      if (t === 'controls_if') {
        // Générer la structure conditionnelle
        const ifBlock = generateIfBlock(Blockly, child);
        if (ifBlock) {
          steps.push(ifBlock);
        }
      } else if (t === 'controls_repeat_ext' || t === 'controls_whileUntil') {
        // Générer les boucles
        const loopBlock = generateLoopBlock(Blockly, child);
        if (loopBlock) {
          steps.push(loopBlock);
        }
      } else if (G[t]) {
        // Générateur standard
        const result = G[t](Blockly, child);
        if (result !== null) {
          steps.push(result);
        }
      }
      
      child = child.getNextBlock();
    }
    return steps;
  }

    // Générer un bloc IF avec conditions et branches
  function generateIfBlock(Blockly, block) {
    const elseifCount = block.elseifCount_ || 0;
    const elseCount = block.elseCount_ || 0;
    
    // Condition IF principale - on génère directement l'objet condition
    const ifConditionBlock = block.getInputTargetBlock('IF0');
    const ifCondition = generateConditionExpression(Blockly, ifConditionBlock);
    const ifSteps = getStatementsFromBlock(Blockly, block, 'DO0');
    
    // Si on n'a pas d'ELSEIF, on utilise la structure simple attendue par le code Dart
    if (elseifCount === 0) {
      const elseSteps = elseCount > 0 ? getStatementsFromBlock(Blockly, block, 'ELSE') : [];
      
      return {
        op: 'if',
        cond: ifCondition,
        then: ifSteps,
        else: elseSteps
      };
    }
    
    // Si on a des ELSEIF, on les transforme en IF imbriqués
    // IF cond1 THEN steps1 ELSEIF cond2 THEN steps2 ELSE steps3
    // devient: IF cond1 THEN steps1 ELSE { IF cond2 THEN steps2 ELSE steps3 }
    
    let currentElseBlock = null;
    
    // Construire de la fin vers le début (pour l'imbrication)
    if (elseCount > 0) {
      currentElseBlock = getStatementsFromBlock(Blockly, block, 'ELSE');
    }
    
    // Traiter les ELSEIF en ordre inverse
    for (let i = elseifCount; i >= 1; i--) {
      const elseifConditionBlock = block.getInputTargetBlock('IF' + i);
      const elseifCondition = generateConditionExpression(Blockly, elseifConditionBlock);
      const elseifSteps = getStatementsFromBlock(Blockly, block, 'DO' + i);
      
      // Créer un IF imbriqué
      const nestedIf = {
        op: 'if',
        cond: elseifCondition,
        then: elseifSteps,
        else: currentElseBlock || []
      };
      
      currentElseBlock = [nestedIf];
    }
    
    // IF principal avec les ELSEIF transformés en ELSE imbriqués
    return {
      op: 'if',
      cond: ifCondition,
      then: ifSteps,
      else: currentElseBlock || []
    };
  }

  // Générer une expression de condition à partir d'un bloc
  function generateConditionExpression(Blockly, condBlock) {
    if (!condBlock) {
      console.log('[COND] No condition block');
      return false;
    }
    
    const blockType = condBlock.type;
    console.log(`[COND] Processing condition block type: ${blockType}`);
    
    // Si c'est un bloc de comparaison logic_compare
    if (blockType === 'logic_compare') {
      const op = condBlock.getFieldValue('OP') || 'EQ';
      const leftBlock = condBlock.getInputTargetBlock('A');
      const rightBlock = condBlock.getInputTargetBlock('B');
      
      console.log(`[COND] Comparison: ${op}`);
      console.log(`[COND] Left block type: ${leftBlock ? leftBlock.type : 'null'}`);
      console.log(`[COND] Right block type: ${rightBlock ? rightBlock.type : 'null'}`);
      
      return {
        type: 'cmp',
        op: op,
        left: generateValueExpression(Blockly, leftBlock),
        right: generateValueExpression(Blockly, rightBlock)
      };
    }
    
    // Si c'est un autre type de bloc booléen, retourner true par défaut
    console.log(`[COND] Unknown condition block type: ${blockType}, returning true`);
    return true;
  }

  // Générer une expression de valeur (nombre ou capteur)
  function generateValueExpression(Blockly, valueBlock) {
    if (!valueBlock) {
      console.log('[VALUE] No value block, returning 0');
      return 0;
    }
    
    const blockType = valueBlock.type;
    console.log(`[VALUE] Processing value block type: ${blockType}`);
    
    // Si c'est un nombre
    if (blockType === 'math_number') {
      const num = Number(valueBlock.getFieldValue('NUM')) || 0;
      console.log(`[VALUE] Number: ${num}`);
      return { type: 'num', value: num };
    }
    
    // Si c'est un capteur
    if (G[blockType]) {
      console.log(`[VALUE] Sensor block found in G: ${blockType}`);
      const result = G[blockType](Blockly, valueBlock);
      console.log(`[VALUE] Sensor result:`, result);
      return result;
    }
    
    // Par défaut, retourner 0
    console.warn(`[VALUE] Unknown block type: ${blockType}, returning 0`);
    return { type: 'num', value: 0 };
  }

  // Générer un bloc de boucle
  function generateLoopBlock(Blockly, block) {
    const type = block.type;
    
    if (type === 'controls_repeat_ext') {
      const times = Blockly.JavaScript.valueToCode(block, 'TIMES', Blockly.JavaScript.ORDER_NONE);
      const steps = getStatementsFromBlock(Blockly, block, 'DO');
      
      return {
        op: 'repeat',
        times: times,
        steps: steps
      };
    } else if (type === 'controls_whileUntil') {
      const mode = block.getFieldValue('MODE'); // WHILE ou UNTIL
      const condition = Blockly.JavaScript.valueToCode(block, 'BOOL', Blockly.JavaScript.ORDER_NONE);
      const steps = getStatementsFromBlock(Blockly, block, 'DO');
      
      return {
        op: mode === 'WHILE' ? 'while' : 'until',
        condition: condition,
        steps: steps
      };
    }
    
    return null;
  }

  window.IloGenerators = {
    workspaceToProgramJSON(Blockly, workspace) {
      const topBlocks = workspace.getTopBlocks(true);
      
      // Chercher les blocs SETUP et LOOP
      let setupBlock = null;
      let loopBlock = null;
      const otherSteps = [];
      
      for (const block of topBlocks) {
        if (block.type === 'ilo_setup') {
          setupBlock = block;
        } else if (block.type === 'ilo_loop') {
          loopBlock = block;
        } else {
          // Autres blocs (mode flat)
          otherSteps.push(...topBlockToSteps(Blockly, block));
        }
      }
      
      // Si on a SETUP ou LOOP, retourner format structuré
      if (setupBlock || loopBlock) {
        const setup = setupBlock ? getStatementsFromBlock(Blockly, setupBlock, 'STATEMENTS') : [];
        const loop = loopBlock ? getStatementsFromBlock(Blockly, loopBlock, 'STATEMENTS') : [];
        
        return {
          setup: setup,
          loop: loop
        };
      }
      
      // Sinon, mode flat (ancien comportement)
      return otherSteps;
    }
  };
})();
