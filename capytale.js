/**
 * Capytale Integration Bridge for ilo Robot App
 * 
 * Ce fichier gère la communication entre Capytale (MetaPlayer) et l'application Flutter ilo.
 * Il implémente les contrats:
 * - mode:1 - Pour recevoir le mode d'ouverture (create, assignment, review, view)
 * - separate-contents(json):1 - Pour gérer les contenus prof/élève séparés
 * 
 * @see https://github.com/capytale/metaplayer-rpc
 */

// État global de Capytale
window.capytaleState = {
  initialized: false,
  mode: null,           // 'create' | 'assignment' | 'review' | 'view'
  activityContent: null, // Contenu du cours (prof)
  assignmentContent: null, // Réponses élève
  socket: null,
  modeContract: null,
  contentContract: null,
  hasUnsavedChanges: false,
  flutterCallbacks: {
    onModeSet: null,
    onContentLoaded: null,
    onContentSaveRequested: null,
  }
};

/**
 * Initialise la connexion avec Capytale
 * Appelé automatiquement si ?capytale est dans l'URL
 */
export async function initCapytale() {
  console.log('[Capytale] Initialisation de l\'intégration Capytale...');
  
  try {
    // Import dynamique depuis le CDN Capytale
    const { getSocket } = await import('https://cdn.ac-paris.fr/capytale/contracts/1.0/app-agent.min.js');
    
    const socket = getSocket();
    window.capytaleState.socket = socket;
    
    console.log('[Capytale] Socket créé avec succès');
    
    // === Implémentation du contrat MODE ===
    socket.plug(
      'mode:1',
      (mode) => {
        console.log(`[Capytale] Contrat mode branché (version ${mode.version})`);
        window.capytaleState.modeContract = mode;
        
        return {
          setMode(modeValue) {
            console.log(`[Capytale] Mode reçu: ${modeValue}`);
            window.capytaleState.mode = modeValue;
            
            // Notifier Flutter du mode
            if (window.capytaleState.flutterCallbacks.onModeSet) {
              window.capytaleState.flutterCallbacks.onModeSet(modeValue);
            }
            
            // Dispatch un événement custom pour Flutter
            window.dispatchEvent(new CustomEvent('capytale-mode-set', { 
              detail: { mode: modeValue } 
            }));
          }
        };
      }
    );
    
    // === Implémentation du contrat SEPARATE-CONTENTS ===
    socket.plug(
      'separate-contents(json):1',
      (sc) => {
        console.log(`[Capytale] Contrat separate-contents branché (version ${sc.version})`);
        window.capytaleState.contentContract = sc;
        
        return {
          /**
           * Appelé par Capytale pour charger les contenus
           * @param {Object|null} activity - Contenu de l'activité (cours prof)
           * @param {Object|null|undefined} assignment - Contenu élève (réponses)
           */
          loadContent(activity, assignment) {
            console.log('[Capytale] loadContent appelé:', {
              hasActivity: activity !== null,
              hasAssignment: assignment !== null && assignment !== undefined
            });
            
            window.capytaleState.activityContent = activity;
            window.capytaleState.assignmentContent = assignment;
            window.capytaleState.hasUnsavedChanges = false;
            
            // Notifier Flutter
            if (window.capytaleState.flutterCallbacks.onContentLoaded) {
              window.capytaleState.flutterCallbacks.onContentLoaded(activity, assignment);
            }
            
            // Dispatch un événement custom pour Flutter
            window.dispatchEvent(new CustomEvent('capytale-content-loaded', { 
              detail: { 
                activity: activity,
                assignment: assignment
              } 
            }));
          },
          
          /**
           * Appelé par Capytale pour récupérer le contenu prof (mode create)
           * @returns {Object|null} Le contenu de l'activité
           */
          getActivityContent() {
            console.log('[Capytale] getActivityContent appelé');
            return window.capytaleState.activityContent;
          },
          
          /**
           * Appelé par Capytale pour récupérer les réponses élève (mode assignment/review)
           * @returns {Object|null} Le contenu élève avec évaluations
           */
          getAssignmentContent() {
            console.log('[Capytale] getAssignmentContent appelé');
            return window.capytaleState.assignmentContent;
          },
          
          /**
           * Appelé par Capytale pour notifier que la sauvegarde est terminée
           */
          contentSaved() {
            console.log('[Capytale] Contenu sauvegardé avec succès');
            window.capytaleState.hasUnsavedChanges = false;
            
            // Dispatch un événement custom pour Flutter
            window.dispatchEvent(new CustomEvent('capytale-content-saved'));
          }
        };
      }
    );
    
    // Indiquer que les plugins sont terminés
    socket.plugsDone();
    
    window.capytaleState.initialized = true;
    console.log('[Capytale] Intégration initialisée avec succès');
    
    // Dispatch un événement pour indiquer que Capytale est prêt
    window.dispatchEvent(new CustomEvent('capytale-ready'));
    
  } catch (error) {
    console.error('[Capytale] Erreur lors de l\'initialisation:', error);
    throw error;
  }
}

// ============================================
// API exposée à Flutter via JS Interop
// ============================================

/**
 * Vérifie si l'app tourne en mode Capytale
 * @returns {boolean}
 */
window.isCapytaleMode = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const isCapytaleParam = urlParams.has('capytale');
  const isCapytalePath = window.location.pathname.includes('/capytale');
  return isCapytaleParam || isCapytalePath;
};

/**
 * Vérifie si Capytale est initialisé
 * @returns {boolean}
 */
window.isCapytaleInitialized = function() {
  return window.capytaleState.initialized;
};

/**
 * Récupère le mode actuel
 * @returns {string|null}
 */
window.getCapytaleMode = function() {
  return window.capytaleState.mode;
};

/**
 * Récupère le contenu de l'activité (cours prof)
 * @returns {string} JSON stringifié ou null
 */
window.getCapytaleActivityContent = function() {
  return window.capytaleState.activityContent 
    ? JSON.stringify(window.capytaleState.activityContent) 
    : null;
};

/**
 * Récupère le contenu élève (réponses)
 * @returns {string} JSON stringifié ou null
 */
window.getCapytaleAssignmentContent = function() {
  if (window.capytaleState.assignmentContent === undefined) {
    return undefined;
  }
  return window.capytaleState.assignmentContent 
    ? JSON.stringify(window.capytaleState.assignmentContent) 
    : null;
};

/**
 * Met à jour le contenu de l'activité (appelé par Flutter)
 * @param {string} contentJson - Contenu JSON stringifié
 */
window.setCapytaleActivityContent = function(contentJson) {
  try {
    window.capytaleState.activityContent = contentJson ? JSON.parse(contentJson) : null;
    window.capytaleState.hasUnsavedChanges = true;
    
    // Notifier Capytale qu'il y a des changements
    if (window.capytaleState.socket) {
      window.capytaleState.socket.use('separate-contents(json)', (sc) => {
        if (sc.i) {
          sc.i.contentChanged();
        }
      });
    }
    
    console.log('[Capytale] Contenu activité mis à jour');
  } catch (error) {
    console.error('[Capytale] Erreur lors de la mise à jour du contenu activité:', error);
  }
};

/**
 * Met à jour le contenu élève (appelé par Flutter)
 * @param {string} contentJson - Contenu JSON stringifié
 */
window.setCapytaleAssignmentContent = function(contentJson) {
  try {
    window.capytaleState.assignmentContent = contentJson ? JSON.parse(contentJson) : null;
    window.capytaleState.hasUnsavedChanges = true;
    
    // Notifier Capytale qu'il y a des changements
    if (window.capytaleState.socket) {
      window.capytaleState.socket.use('separate-contents(json)', (sc) => {
        if (sc.i) {
          sc.i.contentChanged();
        }
      });
    }
    
    console.log('[Capytale] Contenu élève mis à jour');
  } catch (error) {
    console.error('[Capytale] Erreur lors de la mise à jour du contenu élève:', error);
  }
};

/**
 * Notifie Capytale que le contenu a changé
 */
window.notifyCapytaleContentChanged = function() {
  if (window.capytaleState.socket) {
    window.capytaleState.socket.use('separate-contents(json)', (sc) => {
      if (sc.i) {
        sc.i.contentChanged();
        window.capytaleState.hasUnsavedChanges = true;
        console.log('[Capytale] Notification de changement envoyée');
      }
    });
  }
};

/**
 * Enregistre un callback Flutter pour le mode
 * @param {Function} callback
 */
window.registerCapytaleModeCallback = function(callback) {
  window.capytaleState.flutterCallbacks.onModeSet = callback;
  // Si le mode est déjà défini, appeler immédiatement
  if (window.capytaleState.mode) {
    callback(window.capytaleState.mode);
  }
};

/**
 * Enregistre un callback Flutter pour le chargement du contenu
 * @param {Function} callback
 */
window.registerCapytaleContentCallback = function(callback) {
  window.capytaleState.flutterCallbacks.onContentLoaded = callback;
  // Si le contenu est déjà chargé, appeler immédiatement
  if (window.capytaleState.activityContent !== null || window.capytaleState.assignmentContent !== null) {
    callback(window.capytaleState.activityContent, window.capytaleState.assignmentContent);
  }
};

/**
 * Vérifie s'il y a des changements non sauvegardés
 * @returns {boolean}
 */
window.hasCapytaleUnsavedChanges = function() {
  return window.capytaleState.hasUnsavedChanges;
};

// ============================================
// Initialisation automatique
// ============================================

// Auto-init si ?capytale est présent
if (window.isCapytaleMode()) {
  console.log('[Capytale] Paramètre ?capytale détecté, initialisation...');
  initCapytale().catch(err => {
    console.error('[Capytale] Échec de l\'initialisation:', err);
  });
}
