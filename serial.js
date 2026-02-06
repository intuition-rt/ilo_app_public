window.serialPort = null;
let globalReader = null;

async function requestPort() {
    if ('serial' in navigator) {
        try {
            window.serialPort = await navigator.serial.requestPort();
            await window.serialPort.open({ baudRate: 115200 });

            const info = window.serialPort.getInfo();
            console.log("Port série ouvert :", info);
            return info;
        } catch (err) {
            console.error("Erreur ouverture port série:", err.message);
            return { error: err.message };
        }
    } else {
        console.error("Web Serial API non supportée par ce navigateur.");
        return { error: "Web Serial API non supportée" };
    }
}

async function writeToSerial(data) {
    if (window.serialPort && window.serialPort.writable) {
        try {
            const writer = window.serialPort.writable.getWriter();
            await writer.write(new TextEncoder().encode(data));
            writer.releaseLock();
        } catch (err) {
            console.error("Erreur écriture série:", err);
        }
    } else {
        console.error("Aucun port série connecté.");
    }
}

async function readFromSerial() {
    if (!window.serialPort || !window.serialPort.readable) {
        console.error("Aucun port série lisible.");
        return "";
    }

    try {
        if (!globalReader) {
            globalReader = window.serialPort.readable
                .pipeThrough(new TextDecoderStream())
                .getReader();
        }

        const { value, done } = await globalReader.read();

        if (done) {
            globalReader.releaseLock();
            globalReader = null;
            return "";
        }

        return value || "";
    } catch (err) {
        console.error("Erreur lecture série:", err);
        return "";
    }
}

function resetSerialReader() {
    if (globalReader) {
        try {
            globalReader.releaseLock();
        } catch (e) {
            console.warn("Erreur lors du releaseLock:", e);
        }
        globalReader = null;
    }
}

window.writeBinaryToSerial = async function(base64data) {
  if (!window.serialPort || !window.serialPort.writable) {
    console.error("[Serial] Port non ouvert ou non writable");
    return;
  }
  try {
    const binary = Uint8Array.from(atob(base64data), c => c.charCodeAt(0));
    const writer = window.serialPort.writable.getWriter();
    await writer.write(binary);
    writer.releaseLock();
  } catch (e) {
    console.error("[Serial] writeBinaryToSerial error:", e);
  }
};