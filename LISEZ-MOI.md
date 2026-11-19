# Pages SEO CALCUB — fonctionnement

Le site n'est plus une collection de 136 fichiers HTML à modifier un par un :
**le contenu vient du fichier Excel**, et les pages sont **fabriquées automatiquement**.

## Les dossiers

| Dossier | Contenu | À modifier ? |
|---|---|---|
| `contenus/` | `CALCUB_Modules_Contenus_Pages.xlsx` : titres SEO, meta, mots-clés et textes de toutes les pages | **Oui** — c'est ici qu'on change les textes |
| `src/pages/` | Les 3 pages faites sur mesure : Aménagements (pilier), Restauration & Commerce, Container Snack | Oui, à la main si besoin |
| `assets/` | Styles (`css/`), scripts (`js/`), images (`img/`) | Oui (design, photos) |
| `build/` | Le générateur | Non (sauf évolution du gabarit) |
| `site/` | **Le site final** : 136 pages + assets, prêt à mettre en ligne | **Non** — recréé à chaque construction |

## Mettre à jour le site

1. Modifier le fichier Excel dans `contenus/` (puis le fermer).
2. Double-cliquer sur **`construire-le-site.bat`** (ou `npm run build`).
3. Ouvrir `site/plan-du-site.html` pour parcourir toutes les pages.

La construction vérifie automatiquement que **tout le texte de l'Excel est présent** dans les pages
et qu'**aucun lien interne n'est cassé** ; le résultat s'affiche à la fin.

> Les 3 pages de `src/pages/` ne sont pas régénérées depuis l'Excel : si leur texte change dans l'Excel,
> il faut aussi le reporter à la main dans ces fichiers.

## Gabarits utilisés

- **Page pilier** (Aménagements, Modules & Bungalows) et **page catégorie** : panneau bleu + photo, sections, solutions en lignes photo + texte.
- **Page produit** : photo avec encart bleu, repères clés, sections numérotées avec sommaire à droite, équipements en cartes à pictos, options en pastilles, tableau des formats, galerie, FAQ (pages Modules).

## Pages « Conteneurs » (Cubner)

Ces pages ne viennent pas de l'Excel :

| Fichier | Contenu |
|---|---|
| `build/seo-gammes-data.js` | Textes des 11 pages SEO (Standards, Petits, 20 pieds, 40 pieds, Location, Frigorifiques, Location frigorifique, Spécifiques, Occasion, Stockage, Off-shore) : titres, meta, intro, guide, usages, FAQ |
| `build/conteneurs-produits.json` | Caractéristiques des modèles (relevées sur les fiches boutique) : dimensions, volume, palettes, poids, lien boutique |
| `build/conteneurs-maritimes.js` | Page d'entrée « Nos conteneurs maritimes » (onglets par gamme) |

Les cartes modèles renvoient vers les **fiches produit de la boutique** (`/produit/conteneurs/…`).
Dans les textes : `**gras**`, `[texte](lien)`, et `[texte](@id)` pour un lien vers une autre page SEO (ex. `@20-pieds`).

## Ajouter une page

Ajouter une ligne dans l'Excel (même colonnes : N°, Catégorie / Branche, Nom, Type `categorie` ou `produit`,
Titre SEO, Meta description, Mots-clés, Contenu), puis reconstruire.
Dans le texte : paragraphes séparés par une ligne vide, listes avec des tirets `- `,
`[GALERIE PHOTOS — réalisations à intégrer]` pour l'emplacement de la galerie, et `FAQ` seul sur une ligne
suivi de blocs « Question ? / Réponse » pour une FAQ.

## Réalisations CALCUB (à saisir dans WordPress)

Le bouton « Découvrez toutes nos réalisations » (page Aménagements) mène à `realisations.html` :
bandeau, repères, filtres par secteur et cartes. **Pas de page par réalisation** : un clic sur une carte
agrandit la photo, avec le titre, le secteur et le résumé en légende, et des flèches pour passer d'une
réalisation à l'autre (parmi celles du filtre en cours).

| Fichier | Rôle |
|---|---|
| `build/realisations-data.js` | Contenu des réalisations (une entrée = une carte) — maquette du contenu WordPress |
| `build/realisations.js` | Gabarit de la page |
| `assets/js/realisations.js` | Filtres par secteur et photo agrandie |
| `assets/css/calcub-page.css` | Styles, section « Page Réalisations » |

### Intégration WordPress : formulaire « Réalisation »

| Champ | Type WordPress | Obligatoire | Où il s'affiche |
|---|---|---|---|
| Titre | Titre | Oui | Carte + légende de la photo agrandie |
| Secteur | Taxonomie `secteur` (13 secteurs) | Oui | Étiquette de la carte, filtres, légende |
| Résumé | Extrait (1 à 2 phrases) | Oui | Carte + légende |
| Photo | Image à la une (idéalement 1400 px de large ou plus) | Oui | Carte + photo agrandie |

- Type de contenu sans page publique (`publicly_queryable => false`) : seule la page liste affiche les réalisations.
- Chaque carte porte `data-secteur="<slug du secteur>"` ; un bouton de filtre par secteur utilisé, avec le nombre de réalisations.
