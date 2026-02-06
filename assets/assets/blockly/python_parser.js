// python_parser.js
// Parser basique Python → Blockly (utilise regex pour patterns simples)

(function() {
  'use strict';

  /**
   * Parse du code Python et génère des blocs Blockly
   * @param {Blockly.Workspace} workspace - Le workspace Blockly
   * @param {string} pythonCode - Le code Python à parser
   */
  window.IloPythonParser = {
    importFromPython: function(workspace, pythonCode) {
      if (!workspace || !pythonCode) {
        console.warn('[Parser] Invalid workspace or empty code');
        return;
      }

      console.log('[Parser] Starting Python → Blocks conversion');
      console.log('[Parser] Code length:', pythonCode.length);

      // Sauvegarder l'état actuel avant de tout effacer
      const previousXml = Blockly.Xml.workspaceToDom(workspace);
      
      try {
        // Nettoyer le workspace pour reconstruire
        workspace.clear();

      const lines = pythonCode.split('\n');
      let setupBlock = null;
      let loopBlock = null;
      let currentParentConnection = null;
      let insideSetup = false;
      let insideLoop = false;
      
      // Créer les blocs SETUP et LOOP par défaut
      setupBlock = workspace.newBlock('ilo_setup');
      setupBlock.initSvg();
      setupBlock.render();
      setupBlock.moveBy(20, 20);
      
      loopBlock = workspace.newBlock('ilo_loop');
      loopBlock.initSvg();
      loopBlock.render();
      loopBlock.moveBy(20, 200);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Ignorer les lignes vides, commentaires et import ilo
        if (!trimmed || trimmed.startsWith('#') || trimmed === 'import ilo') continue;

        // Détecter le début du while True: (début du LOOP)
        if (trimmed === 'while True:') {
          insideLoop = true;
          insideSetup = false;
          currentParentConnection = loopBlock.getInput('STATEMENTS').connection;
          console.log('[Parser] 🔄 Entering LOOP block');
          continue;
        }
        
        // Si on est dans le loop, on accepte uniquement les lignes indentées
        if (insideLoop) {
          // Vérifier que la ligne est indentée (fait partie du while)
          if (line.startsWith('  ') || line.startsWith('\t')) {
            console.log('[Parser] 🔵 Parsing LOOP line:', trimmed);
            const block = this.parseLineToBlock(workspace, trimmed);
            
            if (block) {
              console.log('[Parser] ✅ Created block:', block.type);
              block.initSvg();
              block.render();
              
              if (currentParentConnection.targetBlock() === null) {
                currentParentConnection.connect(block.previousConnection);
              } else {
                let lastBlock = currentParentConnection.targetBlock();
                while (lastBlock && lastBlock.nextConnection && lastBlock.nextConnection.targetBlock()) {
                  lastBlock = lastBlock.nextConnection.targetBlock();
                }
                if (lastBlock && lastBlock.nextConnection && block.previousConnection) {
                  lastBlock.nextConnection.connect(block.previousConnection);
                }
              }
            } else {
              console.warn('[Parser] ⚠️ Could not parse LOOP line:', trimmed);
            }
          } else {
            // Ligne non indentée après while True: = fin du loop
            console.log('[Parser] 🛑 Exiting LOOP (non-indented line)');
            insideLoop = false;
          }
          continue;
        }
        
        // Si on n'est ni dans setup ni dans loop, et que ce n'est pas un while True:
        // alors c'est du code SETUP (au début, avant le while True)
        if (!insideSetup && !insideLoop && trimmed.startsWith('ilo.')) {
          insideSetup = true;
          currentParentConnection = setupBlock.getInput('STATEMENTS').connection;
          console.log('[Parser] 🟢 Entering SETUP block');
        }

        // Parser les commandes du SETUP
        if (insideSetup) {
          console.log('[Parser] 🟢 Parsing SETUP line:', trimmed);
          const block = this.parseLineToBlock(workspace, trimmed);
          
          if (block) {
            console.log('[Parser] ✅ Created block:', block.type);
            block.initSvg();
            block.render();
            
            if (currentParentConnection.targetBlock() === null) {
              currentParentConnection.connect(block.previousConnection);
            } else {
              let lastBlock = currentParentConnection.targetBlock();
              while (lastBlock && lastBlock.nextConnection && lastBlock.nextConnection.targetBlock()) {
                lastBlock = lastBlock.nextConnection.targetBlock();
              }
              if (lastBlock && lastBlock.nextConnection && block.previousConnection) {
                lastBlock.nextConnection.connect(block.previousConnection);
              }
            }
          } else {
            console.warn('[Parser] ⚠️ Could not parse SETUP line:', trimmed);
          }
        }
      }

      console.log('[Parser] Conversion completed successfully');
      
      } catch (error) {
        // En cas d'erreur, restaurer l'état précédent
        console.error('[Parser] Error during conversion:', error);
        console.log('[Parser] Restoring previous workspace state...');
        workspace.clear();
        Blockly.Xml.domToWorkspace(previousXml, workspace);
        console.log('[Parser] Workspace restored');
      }
    },

    /**
     * Parse une ligne Python et retourne un bloc Blockly
     * @param {Blockly.Workspace} workspace
     * @param {string} line - Ligne Python (trimmed)
     * @returns {Blockly.Block|null}
     */
    parseLineToBlock: function(workspace, line) {
      // ============= MOUVEMENTS =============
      
      // ilo.move('front', 100, 200)
      let match = line.match(/^ilo\.move\s*\(\s*'(\w+)'\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
      if (match) {
        const block = workspace.newBlock('ilo_move');
        block.setFieldValue(match[1], 'DIR');
        block.setFieldValue(match[2], 'DIST');
        block.setFieldValue(match[3], 'ACC');
        console.log(`[Parser] ✓ ilo_move: ${match[1]}, ${match[2]}cm, acc=${match[3]}`);
        return block;
      }

      // ilo.rotate(90)
      match = line.match(/^ilo\.rotate\s*\(\s*(-?\d+)\s*\)$/);
      if (match) {
        const block = workspace.newBlock('ilo_rotate');
        block.setFieldValue(match[1], 'ANGLE');
        console.log(`[Parser] ✓ ilo_rotate: ${match[1]}°`);
        return block;
      }

      // ============= LUMIÈRE =============

      // ilo.set_led(255, 0, 0)
      match = line.match(/^ilo\.set_led\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
      if (match) {
        const block = workspace.newBlock('ilo_set_led');
        block.setFieldValue(match[1], 'R');
        block.setFieldValue(match[2], 'G');
        block.setFieldValue(match[3], 'B');
        console.log(`[Parser] ✓ ilo_set_led: RGB(${match[1]}, ${match[2]}, ${match[3]})`);
        return block;
      }

      // ilo.set_bottom_light(128)
      match = line.match(/^ilo\.set_bottom_light\s*\(\s*(\d+)\s*\)$/);
      if (match) {
        const block = workspace.newBlock('ilo_set_bottom_light');
        block.setFieldValue(match[1], 'VALUE');
        console.log(`[Parser] ✓ ilo_set_bottom_light: ${match[1]}`);
        return block;
      }

      // ============= MOTEURS =============

      // ilo.motor_speed(1, 500)
      match = line.match(/^ilo\.motor_speed\s*\(\s*(\d+)\s*,\s*(-?\d+)\s*\)$/);
      if (match) {
        const block = workspace.newBlock('ilo_motor_speed');
        block.setFieldValue(match[1], 'MOTOR_ID');
        block.setFieldValue(match[2], 'SPEED');
        console.log(`[Parser] ✓ ilo_motor_speed: motor ${match[1]}, speed=${match[2]}`);
        return block;
      }

      // ilo.motor_position(1, 2048)
      match = line.match(/^ilo\.motor_position\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)$/);
      if (match) {
        const block = workspace.newBlock('ilo_motor_position');
        block.setFieldValue(match[1], 'MOTOR_ID');
        block.setFieldValue(match[2], 'POSITION');
        console.log(`[Parser] ✓ ilo_motor_position: motor ${match[1]}, pos=${match[2]}`);
        return block;
      }

      // ============= CONTRÔLE =============

      // ilo.stop_all()
      if (line.match(/^ilo\.stop_all\s*\(\s*\)$/)) {
        console.log('[Parser] ✓ ilo_stop_all');
        return workspace.newBlock('ilo_stop_all');
      }

      // ilo.set_tempo(100)
      match = line.match(/^ilo\.set_tempo\s*\(\s*(\d+)\s*\)$/);
      if (match) {
        const block = workspace.newBlock('ilo_set_tempo');
        block.setFieldValue(match[1], 'TEMPO');
        console.log(`[Parser] ✓ ilo_set_tempo: ${match[1]}ms`);
        return block;
      }

      // ilo.delay(300)
      match = line.match(/^ilo\.delay\s*\(\s*(\d+)\s*\)$/);
      if (match) {
        const block = workspace.newBlock('ilo_delay');
        block.setFieldValue(match[1], 'MS');
        console.log(`[Parser] ✓ ilo_delay: ${match[1]}ms`);
        return block;
      }

      // ilo.raw('<40>')
      match = line.match(/^ilo\.raw\s*\(\s*'([^']+)'\s*\)$/);
      if (match) {
        const block = workspace.newBlock('ilo_raw');
        block.setFieldValue(match[1], 'CMD');
        console.log(`[Parser] ✓ ilo_raw: ${match[1]}`);
        return block;
      }

      // ============= STREAM =============

      // ilo.start_trame_s(10, ['battery', 'angle'])
      match = line.match(/^ilo\.start_trame_s\s*\(\s*(\d+)\s*,\s*\[([^\]]+)\]\s*\)$/);
      if (match) {
        const block = workspace.newBlock('ilo_start_trame_s');
        block.setFieldValue(match[1], 'HZ');
        // Nettoyer les quotes des paramètres
        const params = match[2].replace(/'/g, '').replace(/"/g, '').trim();
        block.setFieldValue(params, 'PARAMS');
        console.log(`[Parser] ✓ ilo_start_trame_s: ${match[1]}Hz, params=${params}`);
        return block;
      }

      // ilo.stop_trame_s()
      if (line.match(/^ilo\.stop_trame_s\s*\(\s*\)$/)) {
        console.log('[Parser] ✓ ilo_stop_trame_s');
        return workspace.newBlock('ilo_stop_trame_s');
      }

      // ============= BLOCS STANDARDS BLOCKLY =============

      // Boucle: for i in range(5):
      match = line.match(/^for\s+\w+\s+in\s+range\s*\(\s*(\d+)\s*\)\s*:$/);
      if (match) {
        console.log(`[Parser] ⚠️ for loop detected but not fully implemented yet`);
        // TODO: implémenter controls_repeat_ext avec nested statements
        return null;
      }

      // Condition: if ... :
      if (line.match(/^if\s+.+:$/)) {
        console.log(`[Parser] ⚠️ if condition detected but not fully implemented yet`);
        // TODO: implémenter controls_if avec nested statements
        return null;
      }

      console.warn(`[Parser] ⚠️ Unknown line pattern: "${line}"`);
      return null;
    }
  };

  console.log('[Ilo] Python parser loaded successfully');
})();
