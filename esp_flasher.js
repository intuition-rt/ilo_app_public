// web/esp_flasher.js — ESM, robuste (macOS/Chrome) + interop Flutter

import * as esptool from 'https://esm.sh/esptool-js@0.5.7?bundle';

// Configuration de l'API Django pour récupérer le firmware
const FIRMWARE_API_BASE_URL = window.FIRMWARE_API_URL || 'https://api.ilorobot.com';

// Fichiers statiques (bootloader et partition-table ne changent presque jamais)
const STATIC_FIRMWARE_FILES = [
  { url: 'firmware/bootloader.bin', offset: 0x1000, name: 'bootloader' },
  { url: 'firmware/partition-table.bin', offset: 0x8000, name: 'partition-table' },
];

// L'app.bin sera récupéré dynamiquement depuis l'API Django
const APP_OFFSET = 0x10000;

// Cache pour le firmware téléchargé depuis l'API
let cachedLatestFirmware = null;

/**
 * Récupère les informations du dernier firmware depuis l'API Django
 * @returns {Promise<{id: number, version: string, description: string, file: string, uploaded_at: string}>}
 */
async function fetchLatestFirmwareInfo() {
  console.log('[ESP/API] Récupération des infos du dernier firmware...');
  
  try {
    const url = `${FIRMWARE_API_BASE_URL}/firmwares/latest/`;
    console.log(`[ESP/API] URL: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }
    
    const firmwareInfo = await response.json();
    console.log('[ESP/API] Firmware info récupérée:', firmwareInfo);
    console.log(`[ESP/API] Version: ${firmwareInfo.version}, ID: ${firmwareInfo.id}`);
    
    return firmwareInfo;
  } catch (error) {
    console.error('[ESP/API] Erreur lors de la récupération des infos firmware:', error);
    throw new Error(`Impossible de récupérer les informations du firmware: ${error.message}`);
  }
}

/**
 * Télécharge le fichier firmware depuis l'API Django
 * @param {string} filePath - Chemin du fichier retourné par l'API (ex: "/media/firmwares/sketch_nov25a.ino.bin")
 * @returns {Promise<Uint8Array>} Les données binaires du firmware
 */
async function downloadFirmwareBinary(filePath) {
  console.log(`[ESP/API] Téléchargement du firmware: ${filePath}`);
  
  try {
    // Construire l'URL complète du fichier
    const url = filePath.startsWith('http') ? filePath : `${FIRMWARE_API_BASE_URL}${filePath}`;
    console.log(`[ESP/API] URL complète: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentLength = response.headers.get('content-length');
    console.log(`[ESP/API] Taille du firmware: ${contentLength} bytes (${(contentLength / 1024).toFixed(2)} KB)`);
    
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    
    console.log(`[ESP/API] ✅ Firmware téléchargé: ${data.length} bytes`);
    return data;
  } catch (error) {
    console.error('[ESP/API] Erreur lors du téléchargement du firmware:', error);
    throw new Error(`Impossible de télécharger le firmware: ${error.message}`);
  }
}

export async function initEspFlasher() {
  console.log('[ESP] init start');
  const { ESPLoader, Transport } = esptool || {};
  if (!ESPLoader || !Transport) {
    console.error('[ESP] ESPLoader/Transport manquants');
    throw new Error('esptool-js non chargé (ESPLoader/Transport manquants)');
  }

  window._esp = { port: null, transport: null, loader: null }; // État partagé (stocké sur window pour debug/interop)

  // ---------------- Helpers fermeture propre ----------------
  async function _safeClosePort(port, transport) {
    try { transport?.reader?.releaseLock?.(); } catch (_) {}
    try { transport?.writer?.releaseLock?.(); } catch (_) {}
    try { await transport?.disconnect?.(); } catch (_) {}
    try { await port?.readable?.cancel?.(); } catch (_) {}
    try { await port?.close?.(); } catch (_) {}
  }

  async function _closeGrantedOpenPorts() {
    try {
      const granted = await navigator.serial.getPorts();
      for (const p of granted) {
        if (p.readable || p.writable) {
          await _safeClosePort(p);
        }
      }
    } catch (_) {}
  }

  async function _pickGrantedPortFirst(vendorId, productId) {
    try {
      const ports = await navigator.serial.getPorts();
      for (const p of ports) {
        const info = p.getInfo?.();
        if (!info) continue;
        const v = info.usbVendorId, pr = info.usbProductId;
        const vendorOk = !vendorId || v === vendorId;
        const productOk = !productId || pr === productId;
        if (vendorOk && productOk) return p;
      }
    } catch (_) {}
    return null;
  }

  // ---------------- Connexion ----------------
  let _connecting = false;

  async function espConnect(baud = 921600) {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial non supporté (Chrome/Edge desktop + HTTPS requis)');
    }
    if (_connecting) throw new Error('Connexion déjà en cours…');
    _connecting = true;

    try {
      // 0) Fermer session précédente connue de CE contexte
      if (window._esp?.port) {
        await _safeClosePort(window._esp.port, window._esp.transport);
        window._esp = { port: null, transport: null, loader: null };
      }

      // 1) Demander un port SANS l'ouvrir (esptool-js va l'ouvrir lui-même)
      console.log('[ESP] Demande de port série...');
      const port = await navigator.serial.requestPort();
      
      const info = port.getInfo();
      console.log('[ESP] Port série sélectionné:', info);
      console.log(`[ESP] Port état initial: readable=${!!port.readable}, writable=${!!port.writable}`);

      // 2) Laisser Transport/ESPLoader gérer l'ouverture du port
      console.log('[ESP] Création du transport (qui va ouvrir le port)...');
      const transport = new Transport(port);
      
      console.log('[ESP] Création du loader...');
      const loader = new ESPLoader({
        transport,
        baudrate: baud,
        terminal: { clean: () => {}, writeLine: () => {}, write: () => {} },
        debug: false,
      });

      console.log('[ESP] Handshake avec le bootloader...');
      try {
        await loader.main(); // handshake (ouvre le port internement)
      } catch (handshakeError) {
        console.error('[ESP] Erreur pendant handshake:', handshakeError);
        console.error('[ESP] Type de l\'erreur handshake:', typeof handshakeError);
        console.error('[ESP] Erreur handshake toString:', String(handshakeError));
        
        // Nettoyage en cas d'erreur pendant le handshake
        await _safeClosePort(port, transport);
        
        // Si l'erreur est vide/undefined, c'est probablement un problème de communication
        if (!handshakeError || (!handshakeError.message && !String(handshakeError))) {
          throw new Error('Échec du handshake: impossible de communiquer avec le bootloader. Vérifiez que l\'ESP est en mode bootloader (bouton BOOT enfoncé au démarrage).');
        }
        
        throw new Error(`Échec du handshake avec le bootloader: ${handshakeError.message || handshakeError}`);
      }
      
      console.log(`[ESP] Port après handshake: readable=${!!port.readable}, writable=${!!port.writable}`);
      console.log('[ESP] Récupération du nom de la puce...');
      let chip = 'ESP32'; // Valeur par défaut
      try {
        if (loader.chip && typeof loader.chip.getChipName === 'function') {
          chip = await loader.chip.getChipName();
        } else {
          console.warn('[ESP] loader.chip ou getChipName non disponible, utilisation de la valeur par défaut');
          // Essayer une méthode alternative si disponible
          if (loader.chipName) {
            chip = loader.chipName;
          } else if (loader.ESP_CHIP_MAGIC) {
            chip = 'ESP32'; // ou analyser loader.ESP_CHIP_MAGIC
          }
        }
      } catch (chipError) {
        console.warn('[ESP] Erreur lors de la récupération du nom de puce:', chipError);
        chip = 'ESP32'; // Valeur par défaut
      }
      
      console.log(`[ESP] Succès! Puce: ${chip}`);
      console.log('[ESP] Sauvegarde de la session...');
      console.log('[ESP] port:', port);
      console.log('[ESP] transport:', transport);
      console.log('[ESP] loader:', loader);
      console.log('[ESP] port type:', typeof port);
      console.log('[ESP] transport type:', typeof transport);
      console.log('[ESP] loader type:', typeof loader);
      
      // Vérification que les objets existent vraiment
      if (!port) {
        throw new Error('Port manquant après la connexion');
      }
      if (!transport) {
        throw new Error('Transport manquant après la connexion');
      }
      if (!loader) {
        throw new Error('Loader manquant après la connexion');
      }
      
      window._esp = { port, transport, loader };
      
      console.log('[ESP] Session sauvegardée:', window._esp);
      console.log('[ESP] Vérification - window._esp.loader:', window._esp.loader);
      console.log('[ESP] Vérification - window._esp.port:', window._esp.port);
      console.log('[ESP] Vérification - window._esp.transport:', window._esp.transport);
      return chip;
    } catch (e) {
      console.error('[ESP] Erreur détaillée:', e);
      const msg = String(e || '');
      
      if (e?.name === 'NotFoundError') {
        throw new Error('Aucun port sélectionné.');
      }
      
      // Ne traiter comme "already open" que si c'est vraiment une InvalidStateError lors de l'ouverture
      if (e?.name === 'InvalidStateError' && msg.includes('open')) {
        throw new Error('Le port semble déjà ouvert. Rechargez la page et réessayez.');
      }
      
      // Pour les autres erreurs, les transmettre telles quelles
      throw e;
    } finally {
      _connecting = false;
    }
  }

  // ---------------- Keep Alive Hack ----------------
  let _keepAliveContext = null;
  
  function _enableKeepAlive() {
    try {
      if (_keepAliveContext) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      _keepAliveContext = new AudioContext();
      // On joue un son inaudible en boucle pour forcer le navigateur à garder la priorité
      const oscillator = _keepAliveContext.createOscillator();
      const gainNode = _keepAliveContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1, _keepAliveContext.currentTime); // 1Hz (inaudible)
      gainNode.gain.setValueAtTime(0.001, _keepAliveContext.currentTime); // Très faible volume
      
      oscillator.connect(gainNode);
      gainNode.connect(_keepAliveContext.destination);
      
      oscillator.start();
      console.log('[ESP] Keep-alive (audio) activé pour empêcher le throttling');
    } catch (e) {
      console.warn('[ESP] Impossible d\'activer le keep-alive:', e);
    }
  }

  function _disableKeepAlive() {
    try {
      if (_keepAliveContext) {
        _keepAliveContext.close();
        _keepAliveContext = null;
        console.log('[ESP] Keep-alive désactivé');
      }
    } catch (e) {
      console.warn('[ESP] Erreur désactivation keep-alive:', e);
    }
  }

  // ---------------- Flash ----------------
  async function espFlashFixed({ verify = true, eraseAll = false, onProgress = null, firmwareUrl = null, firmwareVersionStr = null } = {}) {
    console.log('[ESP] Début du flash COMPLET (bootloader + partition + app depuis API)...');
    
    // Activer le keep-alive pour empêcher le throttling en arrière-plan
    _enableKeepAlive();

    console.log('[ESP] window._esp:', window._esp);
    
    if (!window._esp) {
      throw new Error('Pas connecté au bootloader (aucune connexion ESP)');
    }
    
    console.log('[ESP] window._esp.loader:', window._esp.loader);
    console.log('[ESP] window._esp.port:', window._esp.port);
    console.log('[ESP] window._esp.transport:', window._esp.transport);
    
    const { loader, port, transport } = window._esp;
    if (!loader) {
      throw new Error('Pas connecté au bootloader (loader manquant)');
    }
    
    if (!port || !transport) {
      throw new Error('Pas connecté au bootloader (port ou transport manquant)');
    }
    
    console.log('[ESP] Vérifications OK, début du flash...');

    // Fonction helper pour notifier Flutter de la progression
    function notifyProgress(operation, written, total) {
      if (window.flutterProgressCallback) {
        try {
          window.flutterProgressCallback(operation, 0, written, total);
        } catch (e) {
          console.warn('[ESP] Erreur callback progression:', e);
        }
      }
    }

    // 1️⃣ RÉCUPÉRATION DES INFOS DU FIRMWARE DEPUIS L'API
    console.log('[ESP] 📡 Étape 1/4: Récupération des infos du firmware...');
    let firmwareInfo;

    if (firmwareUrl) {
      console.log('[ESP] Utilisation du firmware spécifique:', firmwareUrl);
      firmwareInfo = {
        version: firmwareVersionStr || 'Custom',
        description: 'Firmware spécifique',
        file: firmwareUrl
      };
      // Notifier Flutter de la version
      if (window.flutterProgressCallback) {
        try {
          notifyProgress('firmware_info', 0, 1);
        } catch (_) {}
      }
    } else {
      try {
        firmwareInfo = await fetchLatestFirmwareInfo();
        console.log(`[ESP] ✅ Firmware trouvé: v${firmwareInfo.version} (${firmwareInfo.description})`);
        
        // Notifier Flutter de la version
        if (window.flutterProgressCallback) {
          try {
            // On peut utiliser un callback spécial pour la version
            notifyProgress('firmware_info', 0, 1);
          } catch (_) {}
        }
      } catch (error) {
        console.error('[ESP] ❌ Impossible de récupérer les infos firmware:', error);
        throw new Error(`Échec de la récupération du firmware: ${error.message}`);
      }
    }

    // 2️⃣ TÉLÉCHARGEMENT DES FICHIERS STATIQUES (bootloader + partition)
    console.log('[ESP] 📥 Étape 2/4: Téléchargement des fichiers statiques...');
    const files = [];
    
    for (const fileConfig of STATIC_FIRMWARE_FILES) {
      console.log(`[ESP] Téléchargement de ${fileConfig.name} (${fileConfig.url})...`);
      notifyProgress(fileConfig.name, 0, 100);
      
      const response = await fetch(fileConfig.url);
      if (!response.ok) {
        throw new Error(`Erreur ${response.status} pour ${fileConfig.url}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      console.log(`[ESP] ${fileConfig.name}: ${data.length} bytes à l'offset 0x${fileConfig.offset.toString(16)}`);
      
      // Convertir Uint8Array en string binaire pour esptool-js
      let binaryString = '';
      for (let i = 0; i < data.length; i++) {
        binaryString += String.fromCharCode(data[i]);
      }
      
      files.push({ 
        data: binaryString, 
        address: fileConfig.offset 
      });
      
      notifyProgress(fileConfig.name, 100, 100);
    }

    // 3️⃣ TÉLÉCHARGEMENT DU FIRMWARE DEPUIS L'API
    console.log('[ESP] 📥 Étape 3/4: Téléchargement du firmware applicatif depuis l\'API...');
    console.log(`[ESP] Version: ${firmwareInfo.version}, Fichier: ${firmwareInfo.file}`);
    notifyProgress('app', 0, 100);
    
    let appData;
    try {
      appData = await downloadFirmwareBinary(firmwareInfo.file);
      console.log(`[ESP] App firmware (v${firmwareInfo.version}): ${appData.length} bytes à l'offset 0x${APP_OFFSET.toString(16)}`);
      
      // Convertir Uint8Array en string binaire pour esptool-js
      let appBinaryString = '';
      for (let i = 0; i < appData.length; i++) {
        appBinaryString += String.fromCharCode(appData[i]);
      }
      
      files.push({ 
        data: appBinaryString, 
        address: APP_OFFSET 
      });
      
      notifyProgress('app', 100, 100);
    } catch (error) {
      console.error('[ESP] ❌ Erreur lors du téléchargement du firmware applicatif:', error);
      throw new Error(`Échec du téléchargement du firmware: ${error.message}`);
    }

    // 4️⃣ FLASH DE TOUS LES FICHIERS
    console.log('[ESP] 🔥 Étape 4/4: Flash de tous les fichiers...');
    console.log(`[ESP] Firmware version: ${firmwareInfo.version}`);
    console.log('[ESP] Taille totale:', files.reduce((sum, f) => sum + f.data.length, 0), 'bytes');
    console.log('[ESP] Fichiers à flasher:', files.map(f => `0x${f.address.toString(16)}: ${f.data.length} bytes`));
    
    try {
      // Flash TOUS les fichiers en UNE SEULE opération (comme PlatformIO)
      console.log('[ESP] Flash de TOUS les fichiers en une seule opération...');
      console.log('[ESP] Paramètres: keep (garde les paramètres existants de la flash)');
      
      await loader.writeFlash({
        fileArray: files,
        flashSize: "keep", // Garder la config existante
        flashMode: "keep", 
        flashFreq: "keep",
        eraseAll: false, // NE PAS effacer toute la flash
        compress: true,  // Compression pour la vitesse
        reportProgress: (fileIndex, written, total) => {
          const percent = Math.round((written / total) * 100);
          if (percent % 5 === 0 || percent === 100) {
            console.log(`[ESP] Fichier ${fileIndex + 1}/${files.length}: ${percent}% (${written}/${total} bytes)`);
          }
          
          // Déterminer quelle opération est en cours
          let operation = 'flash';
          if (fileIndex === 0) operation = 'bootloader';
          else if (fileIndex === 1) operation = 'partition';
          else if (fileIndex === 2) operation = 'app';
          
          notifyProgress(operation, written, total);
        }
      });
      
      console.log(`[ESP] ✅ Flash complet réussi ! Firmware v${firmwareInfo.version} installé`);
      console.log('[ESP] 🎉 Bootloader + Partition + App flashés avec succès');
    } catch (flashError) {
      console.error('[ESP] ❌ Erreur du flash:', flashError);
      _disableKeepAlive();
      throw new Error(`Échec du flash: ${flashError.message || flashError}`);
    }

    _disableKeepAlive();
    console.log(`[ESP] Flash terminé (v${firmwareInfo.version}), connexion maintenue`);
    return { success: true, version: firmwareInfo.version, description: firmwareInfo.description };
  }

  // ---------------- Flash App seulement (DÉPRÉCIÉ - utiliser espFlashFixed à la place) ----------------
  // Cette fonction n'est plus utilisée car elle peut corrompre la flash
  // On flash maintenant TOUT en une seule fois dans espFlashFixed
  async function espFlashAppOnly() {
    console.warn('[ESP] ⚠️ espFlashAppOnly est déprécié ! Utilisez espFlashFixed qui flash tout en une fois.');
    console.warn('[ESP] Redirection vers espFlashFixed...');
    return espFlashFixed();
  }

  // ---------------- Reset ESP ----------------
  async function espReset() {
    const { loader } = window._esp;
    if (!loader) throw new Error('Pas connecté');

    console.log('[ESP] Reset de l\'ESP32...');
    
    // Reset vers l'application
    await loader.transport.setDTR(false);
    await loader.transport.setRTS(true);
    await new Promise(r => setTimeout(r, 120));
    await loader.transport.setRTS(false);

    console.log('[ESP] Reset terminé');
    return true;
  }

  // ---------------- Erase ----------------
  async function espEraseChip() {
    const { loader } = window._esp;
    if (!loader) throw new Error('Pas connecté');
    await loader.eraseFlash();
  }

  // ---------------- Déconnexion ----------------
  async function espDisconnect() {
    const { port, transport } = window._esp || {};
    if (port) {
      await _safeClosePort(port, transport);
    }
    window._esp = { port: null, transport: null, loader: null };
    return true;
  }

  // ---------------- Force-close (utile en console) ----------------
  async function espForceCloseAllPorts() {
    try { await _safeClosePort(window._esp?.port, window._esp?.transport); } catch (_) {}
    window._esp = { port: null, transport: null, loader: null };
    await _closeGrantedOpenPorts();
    console.log('[ESP] Tous les ports accordés ont été fermés.');
    return true;
  }

  // ---------------- Récupérer les infos firmware (utile pour Flutter) ----------------
  async function espGetLatestFirmwareInfo() {
    console.log('[ESP] Récupération des infos du firmware disponible...');
    try {
      const info = await fetchLatestFirmwareInfo();
      console.log(`[ESP] Firmware disponible: v${info.version}`);
      return info;
    } catch (error) {
      console.error('[ESP] Erreur lors de la récupération des infos:', error);
      throw error;
    }
  }

  // Expose global + wrappers *Async* pour Dart
  window.espConnect             = espConnect;
  window.espFlashFixed          = espFlashFixed;
  window.espFlashAppOnly        = espFlashAppOnly;
  window.espReset               = espReset;
  window.espEraseChip           = espEraseChip;
  window.espDisconnect          = espDisconnect;
  window.espForceCloseAllPorts  = espForceCloseAllPorts;
  window.espGetLatestFirmwareInfo = espGetLatestFirmwareInfo;

  window.espConnectAsync        = (baud) => Promise.resolve().then(() => espConnect(baud));
  window.espFlashFixedAsync     = (opts) => Promise.resolve().then(() => espFlashFixed(opts));
  window.espFlashAppOnlyAsync   = () => Promise.resolve().then(() => espFlashAppOnly());
  window.espResetAsync          = () => Promise.resolve().then(() => espReset());
  window.espEraseChipAsync      = () => Promise.resolve().then(() => espEraseChip());
  window.espDisconnectAsync     = () => Promise.resolve().then(() => espDisconnect());
  window.espGetLatestFirmwareInfoAsync = () => Promise.resolve().then(() => espGetLatestFirmwareInfo());

  console.log('[ESP] init done');
}
