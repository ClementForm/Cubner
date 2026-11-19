// ============================================================================
// Réalisations CALCUB — contenu de la page realisations.html
//   Chaque objet = une réalisation (type de contenu WordPress « Réalisation »).
//   Pas de page par réalisation : un clic sur la carte agrandit la photo.
//
//   titre     Titre de la réalisation (obligatoire)
//   secteur   Secteur d'activité (obligatoire) : une clé de SECTEURS ci-dessous
//   resume    Phrase courte affichée sur la carte et en légende de la photo agrandie (obligatoire)
//   photo     Photo (obligatoire), chemin dans assets/img/
//
//   Photos des dossiers familles/ et galerie/ : provisoires, à remplacer par de vraies réalisations.
// ============================================================================

// Secteurs = catégories WordPress (un bouton de filtre par secteur utilisé).
const SECTEURS = {
  restauration:    { label: "Restauration & commerce" },
  chantier:        { label: "Chantier BTP" },
  energie:         { label: "Énergie & environnement" },
  industrie:       { label: "Industrie & spécifique" },
  frigorifique:    { label: "Frigorifique" },
  agroalimentaire: { label: "Agroalimentaire" },
  defense:         { label: "Défense & sécurité" },
  sante:           { label: "Santé & humanitaire" },
  evenementiel:    { label: "Événementiel" },
  collectivite:    { label: "Mairie & collectivité" },
  pompier:         { label: "Pompier & SDIS" },
  habitat:         { label: "Logement & jardin" },
  sport:           { label: "Sport & loisirs" },
};

const REALISATIONS = [
  {
    titre: "Bar avec comptoir et terrasse",
    secteur: "restauration",
    resume: "Conteneur ouvert en façade, comptoir de service et espace terrasse pour accueillir la clientèle.",
    photo: "calcub/realisation-bar-terrasse.png",
  },
  {
    titre: "Conteneur support d'affichage",
    secteur: "evenementiel",
    resume: "Habillage grand format pour valoriser une marque sur un site commercial.",
    photo: "calcub/realisation-affichage-publicitaire.png",
  },
  {
    titre: "40 pieds à trois rideaux métalliques",
    secteur: "restauration",
    resume: "Trois ouvertures sécurisées pour un point de vente ou un espace de stockage accessible.",
    photo: "calcub/realisation-rideaux-metalliques.png",
  },
  {
    titre: "Habillage bardage bois",
    secteur: "habitat",
    resume: "Bardage, porte vitrée et fenêtres : un conteneur qui s'intègre à son environnement.",
    photo: "calcub/realisation-bardage-bois.png",
  },
  {
    titre: "Kiosque café",
    secteur: "restauration",
    resume: "Comptoir de service et équipements de préparation dans un format compact.",
    photo: "galerie/container-kiosque-cafe.jpg",
  },
  {
    titre: "Restaurant et terrasse en conteneurs",
    secteur: "restauration",
    resume: "Plusieurs modules assemblés pour créer salle, cuisine et terrasse extérieure.",
    photo: "galerie/containers-restaurant-terrasse.jpg",
  },
  {
    titre: "Café sur deux niveaux",
    secteur: "restauration",
    resume: "Conteneurs superposés pour gagner de la surface sur une emprise au sol réduite.",
    photo: "galerie/containers-empiles-cafe.jpg",
  },
  {
    titre: "Point de vente avec fresque",
    secteur: "restauration",
    resume: "Une façade personnalisée qui devient la vitrine de l'enseigne.",
    photo: "galerie/container-fresque-bleu.jpg",
  },
  {
    titre: "Stand de marché",
    secteur: "restauration",
    resume: "Façade ouvrante pour transformer le conteneur en étal en quelques minutes.",
    photo: "galerie/container-stand-marche.jpg",
  },
  {
    titre: "Base de chantier",
    secteur: "chantier",
    resume: "Bureaux, vestiaires, sanitaires et stockage sécurisé pour les équipes sur site.",
    photo: "familles/chantier.jpg",
  },
  {
    titre: "Conteneur technique énergie",
    secteur: "energie",
    resume: "Abri pour équipements solaires, hydrogène ou recharge électrique.",
    photo: "familles/energie.jpg",
  },
  {
    titre: "Atelier et shelter technique",
    secteur: "industrie",
    resume: "Ateliers, laboratoires et shelters adaptés aux process industriels.",
    photo: "familles/industrie.jpg",
  },
  {
    titre: "Chambre froide en conteneur",
    secteur: "frigorifique",
    resume: "Conservation à température maîtrisée, du laboratoire réfrigéré à la grande chambre froide.",
    photo: "familles/frigorifiques.jpg",
  },
  {
    titre: "Unité agroalimentaire",
    secteur: "agroalimentaire",
    resume: "Produire, transformer et stocker au plus près de l'exploitation.",
    photo: "familles/agroalimentaire.jpg",
  },
  {
    titre: "Shelter et base vie",
    secteur: "defense",
    resume: "Déploiement rapide de moyens sur les terrains les plus exigeants.",
    photo: "familles/defense.jpg",
  },
  {
    titre: "Unité médicale mobile",
    secteur: "sante",
    resume: "Services de santé essentiels déployés rapidement sur le terrain.",
    photo: "familles/sante.jpg",
  },
  {
    titre: "Buvette et espace de marque",
    secteur: "evenementiel",
    resume: "Billetterie, bar ou espace PLV livrés prêts à l'emploi pour vos événements.",
    photo: "familles/evenementiel.jpg",
  },
  {
    titre: "Local communal",
    secteur: "collectivite",
    resume: "Local associatif, sanitaire ou salle de pause pour les espaces publics.",
    photo: "familles/mairie.jpg",
  },
  {
    titre: "Caisson de formation",
    secteur: "pompier",
    resume: "Centre de formation mobile et caisson à feu pour l'entraînement des équipes.",
    photo: "familles/pompier.jpg",
  },
  {
    titre: "Salle de sport en conteneur",
    secteur: "sport",
    resume: "Musculation, vestiaires ou bloc sanitaire pour les clubs et les licenciés.",
    photo: "familles/sport.jpg",
  },
  {
    titre: "Studio de jardin",
    secteur: "habitat",
    resume: "Extension minimaliste, local piscine ou chambre d'hôte au fond du jardin.",
    photo: "familles/habitations.jpg",
  },
];

module.exports = { SECTEURS, REALISATIONS };
