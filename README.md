# Cartographie des tirages au sort

Application Angular de visualisation des tirages de régions, villes et enseignes, publiée sur GitHub Pages.

## Développement

Prérequis : Node.js 20.19+ ou 22.12+.

```bash
npm install
npm start
```

Le serveur de développement recharge l’application à chaque modification. Pour vérifier le build de production :

```bash
npm run build:gh-pages
```

## Données cartographiques

Les données prêtes à publier sont conservées dans `public/data/`. Pour les régénérer :

```bash
npm run data
npm run geo
```

`npm run data` géocode les villes et magasins depuis `scripts/source-data.mjs`. `npm run geo` télécharge les contours administratifs depuis Etalab. Ces commandes nécessitent une connexion Internet.

## Organisation du code

- `src/app/data/` : chargement des données et projections destinées à l’interface.
- `src/app/models/` : entités métier et constantes d’affichage.
- `src/app/layout/` : en-tête et légende.
- `src/app/steps/` : contenu des quatre étapes.
- `src/app/map/` : carte Leaflet, couches, placement des étiquettes et popups.
- `scripts/` : données source et génération des fichiers statiques.

Le workflow `.github/workflows/deploy.yml` construit et publie automatiquement l’application lors d’un push sur `main`.
