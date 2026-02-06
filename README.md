# ILO Web App

<p align="center">
  <img src="icons/Icon-192.png" alt="ILO Logo" width="120" />
  <br>
  <b>L'interface web officielle pour les robots ILO</b>
</p>

---

## 🚀 À propos

Ce dépôt contient la version **compilée pour le web** de l'application mobile ILO.
Ce code  est prêt à être hébergé sur n'importe quel serveur statique.

## 📡 Comment Héberger (Hosting)

Cette application est une **Single Page Application (SPA)** Flutter. Elle nécessite un serveur web capable de servir des fichiers statiques.


Copiez simplement l'intégralité des fichiers de ce dépôt dans le dossier racine de votre serveur web (ex: `/var/www/html`).

**Configuration Nginx recommandée :**
```nginx
server {
    listen 80;
    server_name ilo-app.local;
    root /var/www/html/ilo_app;
    index index.html;

    location / {
        # Important pour le routing Flutter (gère les URLs profondes)
        try_files $uri $uri/ /index.html;
    }
}
```

### Python (Test rapide)
Si vous avez Python installé, vous pouvez tester l'application localement en une ligne de commande :

```bash
python3 -m http.server 8080
```
Ouvrez ensuite `http://localhost:8080` dans votre navigateur.



---
<p align="center">Made with ❤️ by Intuition & Robotics Team</p>
