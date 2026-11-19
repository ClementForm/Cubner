// ============================================================================
// Pages SEO « conteneurs » (nœuds noirs de l'arborescence)
//   Les fiches produit (nœuds bleus) restent sur la boutique : les cartes y renvoient.
//   Caractéristiques des modèles : build/conteneurs-produits.json (relevées sur la boutique).
//
//   Textes : repris des pages en ligne (cubner.definima.net/conteneurs-maritimes/…)
//   + compléments SEO rédigés (guide de choix, FAQ, titres/meta) — À FAIRE VALIDER.
//   Dans les textes : **gras**, [texte](lien). Lien vers une autre page SEO : [texte](@id).
// ============================================================================
const SHOP = "https://www.cubner.com";

// Usages réutilisés : usages du conteneur brut (stockage, transport, logistique), sans aménagement
const U = {
  chantier: { title: "Stockage de chantier et BTP", icon: "i-barrier", link: ["@location-maritime", "Louer un conteneur de chantier"], paras: [
    "Le secteur du BTP et de l’artisanat fait face à un enjeu permanent : **protéger le matériel sensible sur les zones de travaux**.",
    "Un **conteneur maritime de chantier** offre un espace de rangement ultra-sécurisé, **étanche et anti-effraction**. Il abrite l’outillage électroportatif, les matériaux de valeur ou les engins légers à l’abri des intempéries et du vol.",
    "Une fois les travaux terminés, le conteneur se déplace facilement en camion-grue **vers le chantier suivant**.",
  ] },
  entreprise: { title: "Stockage professionnel et logistique", icon: "i-shelves", link: ["@40-pieds", "Voir les conteneurs grand volume"], paras: [
    "Surstock saisonnier, réserve de marchandises, pièces détachées, archives ou matières premières : le conteneur maritime **agrandit votre capacité de stockage** sans construire de bâtiment.",
    "Posé dans une cour, sur un parking ou sur un site industriel, il accueille vos **palettes Europe** (11 dans un 20 pieds, 25 dans un 40 pieds) et se charge facilement au chariot élévateur.",
  ] },
  transport: { title: "Transport maritime et export", icon: "i-ship", link: ["@specifiques", "Voir les conteneurs spécifiques"], paras: [
    "Conçu pour le **transport intermodal**, le conteneur maritime passe du navire au camion ou au train sans rupture de charge : idéal pour **expédier des marchandises à l’export** ou rapatrier du matériel.",
    "Ses dimensions normalisées ISO et son certificat **CSC** permettent de l’empiler, de le lever et de le transporter partout dans le monde.",
  ] },
  agriculture: { title: "Stockage agricole", icon: "i-wheat", paras: [
    "Exploitations agricoles, viticoles ou maraîchères : le conteneur maritime protège le **matériel agricole, les semences, les engrais ou les récoltes** de l’humidité et des nuisibles.",
    "Sa structure acier **résiste aux conditions extérieures** et se déplace au gré des besoins de l’exploitation.",
  ] },
  particulier: { title: "Rangement pour les particuliers", icon: "i-house", link: ["@petits", "Voir les petits conteneurs"], paras: [
    "Outils de jardin, mobilier, vélos, bois de chauffage ou matériel de loisirs : le conteneur maritime offre un **espace de rangement extérieur robuste et sécurisé**, bien plus durable qu’un abri de jardin.",
    "Étanche et fermé par des portes verrouillables, il protège durablement vos biens des intempéries et des intrusions.",
  ] },
  demenagement: { title: "Déménagement et garde-meubles", icon: "i-truck", link: ["@location-maritime", "Louer un conteneur"], paras: [
    "Travaux, déménagement ou transition entre deux logements ou locaux : le conteneur sert de **garde-meubles directement sur votre site**, sans aller-retour vers un entrepôt.",
    "Vous chargez à votre rythme, puis le conteneur est enlevé ou déplacé à la fin de l’opération.",
  ] },
};
const STD_USAGES = [U.chantier, U.entreprise, U.transport, U.agriculture, U.particulier, U.demenagement];

// FAQ réutilisée (fiches boutique)
const FAQ_AUTORISATION = ["Faut-il une autorisation pour poser un conteneur ?", [
  "Cela dépend principalement de la taille du conteneur, de son usage, de la durée de son installation et des règles d’urbanisme de votre commune.",
  "En règle générale, une installation créant plus de 5 m² et jusqu’à 20 m² d’emprise au sol ou de surface de plancher peut nécessiter une déclaration préalable de travaux. Au-delà de 20 m², un permis de construire peut être nécessaire. À titre indicatif, un conteneur de 20 pieds représente environ 15 m² d’emprise au sol, contre près de 30 m² pour un 40 pieds.",
  "Les règles pouvant varier selon le PLU, la localisation du terrain ou la présence d’un secteur protégé, nous vous recommandons de vous rapprocher du service urbanisme de votre mairie avant toute installation.",
]];
const FAQ_TERRAIN = ["Comment préparer le terrain avant l’installation d’un conteneur ?", [
  "Le conteneur doit être installé sur une surface plane, stable et suffisamment résistante pour supporter son poids et celui de son contenu.",
  "Il n’est pas toujours nécessaire de réaliser une dalle béton complète. Selon le terrain et l’utilisation prévue, des plots béton, des longrines, des cales adaptées ou une plateforme en grave compactée peuvent suffire. L’essentiel est que les points d’appui soient parfaitement de niveau afin de garantir notamment la bonne ouverture des portes.",
]];
const FAQ_LIVRAISON = ["Comment se déroulent la livraison et le déchargement ?", [
  "Cubner organise le transport jusqu’à votre site et le déchargement. Selon l’accès, la livraison se fait par camion-plateau, camion-grue ou un moyen de levage adapté ; un camion-grue peut poser l’unité directement à l’emplacement prévu lorsque les conditions le permettent.",
  "Avant le départ, nos équipes étudient la largeur d’accès, la hauteur libre, le rayon de braquage et la stabilité du terrain. Vous pouvez aussi retirer le matériel dans l’un de nos dépôts.",
]];

module.exports = {
  SHOP,
  // Réassurance commune (textes des fiches boutique)
  REASSURANCE: [
    ["i-shield", "Contrôlé avant expédition", "Structure, étanchéité au vent et à l’eau et certificat CSC selon l’usage prévu."],
    ["i-check", "Étanchéité garantie à vie", "Sur les conteneurs dry premier voyage, selon les conditions générales de vente."],
    ["i-truck", "Livré et déchargé", "Camion-plateau ou camion-grue, ou retrait dans l’un de nos 8 dépôts en France."],
    ["i-euro", "Achat, location ou LOA", "Paiement comptant, location ou leasing avec option d’achat via un partenaire."],
  ],
  DEPOTS: ["Bordeaux", "Dunkerque", "Fos-sur-Mer / Marseille", "Le Havre", "Lyon", "Ottmarsheim", "Strasbourg", "Trélissac"],

  pages: [
    // ------------------------------------------------------------------ MARITIMES (standards)
    {
      id: "standards", file: "conteneurs-maritimes-standards.html", path: "conteneurs-maritimes/standards/", parent: null,
      nav: "Standards", range: "Standard",
      seoTitle: "Conteneurs maritimes standards : 6 à 45 pieds | Cubner",
      meta: "Conteneurs maritimes standards en acier CORTEN : petits formats, 20 et 40 pieds, dry, High Cube ou pallet wide. Achat ou location, livrés partout en France.",
      keywords: "conteneur maritime, container maritime, conteneur standard, conteneur dry, conteneur high cube, conteneur 20 pieds, conteneur 40 pieds, acheter conteneur maritime",
      h1: ["Conteneurs maritimes", "standards"],
      lead: "Découvrez la gamme complète de conteneurs maritimes.",
      intro: [
        "Un conteneur maritime standard, polyvalent et robuste, est utilisé à la fois pour le **transport intermodal** et le **stockage de longue durée**.",
        "Les conteneurs sont conçus pour résister aux conditions difficiles en mer, tout en offrant une solution sécurisée pour le stockage des marchandises et des équipements. Leur structure en acier leur permet d’être empilés, optimisant ainsi l’espace dans les ports, les entrepôts et les chantiers.",
      ],
      hero: { img: "produits/conteneur-20-pieds-dry-4.jpg", alt: "Conteneur maritime standard gris anthracite vu de trois quarts sur un parc de stockage", w: 1600, h: 1297 },
      childrenTitle: ["Découvrez toutes nos gammes de", "conteneurs standards"],
      children: [
        ["petits", "Le petit conteneur offre une solution de stockage **ultra-compacte et sécurisée**. Nos modèles s’intègrent facilement dans vos espaces réduits."],
        ["20-pieds", "Le conteneur 20 pieds offre un **volume de stockage standard**. Robustes et étanches, ses 33 m³ s’adaptent facilement à tous vos projets."],
        ["40-pieds", "Le conteneur 40 pieds offre un **volume de stockage maximal** et très rentable. Ses 67 m³ répondent à vos plus grands besoins de logistique."],
        ["location-maritime", "Besoin d’un conteneur pour un chantier, une saison ou un projet ponctuel ? **Louez votre conteneur maritime** et faites-le livrer sur site."],
      ],
      productsTitle: ["Tous nos conteneurs", "maritimes standards"],
      products: ["conteneur-6-pieds-dry", "conteneur-8-pieds-dry", "conteneur-10-pieds-dry", "conteneur-10-pieds-dry-hc", "conteneur-10-pieds-half-height",
        "conteneur-20-pieds-dry", "conteneur-20-pieds-dry-hc", "conteneur-20-pieds-half-height",
        "conteneur-40-pieds-dry", "conteneur-40-pieds-dry-hc", "conteneur-40-pieds-hc-pallet-wide", "conteneur-45-pieds-pallets-wide-hc"],
      compareTitle: ["Dimensions des", "conteneurs maritimes standards"],
      guideTitle: ["Comment choisir votre", "conteneur maritime standard ?"],
      guide: [
        ["La longueur : petits formats, 20 ou 40 pieds", "La longueur d’un conteneur s’exprime en **pieds** (1 pied = 30,48 cm). Un 20 pieds mesure 6,06 m de long, un 40 pieds 12,19 m. Les [petits formats](@petits) de 6, 8 et 10 pieds se glissent dans les espaces réduits, le [20 pieds](@20-pieds) est le plus polyvalent et le [40 pieds](@40-pieds) double la surface pour les gros volumes."],
        ["La hauteur : dry, High Cube ou half height", "Un conteneur **dry** mesure 2,59 m de haut à l’extérieur. Le **High Cube (HC)** gagne 30 cm, soit 2,90 m : un 40 pieds passe ainsi de 67,7 m³ à 76,4 m³. Le **half height** (1,30 m) est réservé aux charges lourdes et denses, qui atteignent la charge maximale avant de remplir le volume."],
        ["La largeur : standard ou pallet wide", "Les modèles **pallet wide** sont conçus pour optimiser le chargement de palettes Europe. Le 45 pieds pallets wide High Cube, large de 2,50 m, accueille jusqu’à **33 palettes Europe**, contre 25 pour un 40 pieds standard."],
        ["Neuf, occasion ou location", "Les conteneurs dry **premier voyage** bénéficient d’une garantie d’étanchéité à vie (selon les conditions générales de vente). Pour un budget maîtrisé, nos [conteneurs d’occasion](@occasion) sont inspectés avant expédition. Pour un besoin ponctuel, pensez à la [location](@location-maritime)."],
      ],
      usagesTitle: ["Les usages d’un", "conteneur maritime"],
      usages: STD_USAGES,
      faq: [
        ["Quelle est la différence entre un conteneur dry et un conteneur High Cube ?", [
          "Les deux ont la même longueur et la même largeur. Seule la hauteur change : 2,59 m à l’extérieur pour un dry, 2,90 m pour un High Cube (HC). Ce gain de 30 cm augmente le volume utile : 33,2 m³ contre 37,4 m³ en 20 pieds, 67,7 m³ contre 76,4 m³ en 40 pieds.",
          "Le High Cube est idéal pour les marchandises hautes, le stockage en rayonnages ou les biens légers mais volumineux.",
        ]],
        ["Quelles sont les dimensions d’un conteneur maritime 20 pieds et 40 pieds ?", [
          "Un conteneur 20 pieds dry mesure 6,06 m × 2,44 m × 2,59 m à l’extérieur, pour 5,90 m × 2,35 m × 2,39 m à l’intérieur (33,2 m³).",
          "Un conteneur 40 pieds dry mesure 12,19 m × 2,44 m × 2,59 m à l’extérieur, pour 12,03 m × 2,35 m × 2,39 m à l’intérieur (67,7 m³). Retrouvez toutes les cotes dans le tableau des dimensions ci-dessus.",
        ]],
        ["Combien de palettes peut-on charger dans un conteneur maritime ?", [
          "À titre indicatif : 5 palettes Europe dans un 10 pieds, 11 dans un 20 pieds, 25 dans un 40 pieds et jusqu’à 33 dans un 45 pieds pallets wide High Cube.",
        ]],
        ["Peut-on louer un conteneur maritime ?", [
          "Oui. Vous pouvez acheter votre conteneur au comptant, le louer auprès de Cubner lorsque l’état Location est proposé, ou recourir à un leasing avec option d’achat (LOA) via un organisme financeur partenaire. Découvrez notre offre de [location de conteneurs maritimes](@location-maritime).",
        ]],
        FAQ_AUTORISATION,
        FAQ_LIVRAISON,
      ],
      related: ["frigorifiques", "specifiques", "stockage", "occasion", "offshore"],
    },

    // ------------------------------------------------------------------ PETITS
    {
      id: "petits", file: "petits-conteneurs-maritimes.html", path: "conteneurs-maritimes/standards/petits/", parent: "standards",
      nav: "Petits", range: "Standard",
      seoTitle: "Petit conteneur maritime 6, 8 et 10 pieds | Cubner",
      meta: "Petits conteneurs maritimes de 6, 8 et 10 pieds : dry, High Cube ou half height. Un stockage compact, étanche et sécurisé, livré partout en France.",
      keywords: "petit conteneur, petit conteneur maritime, conteneur 10 pieds, container 10 pieds, conteneur 8 pieds, conteneur 6 pieds, mini conteneur",
      h1: ["Petits", "conteneurs maritimes"],
      lead: "Le petit conteneur offre une solution de stockage ultra-compacte et sécurisée.",
      intro: [
        "Nos modèles s’intègrent facilement dans vos **espaces réduits**. Idéals pour abriter votre matériel, vos outils ou vos marchandises en toute sérénité.",
        "Conteneurs maritimes standards **CORTEN, étanches et sécurisés** — livraison possible partout en France.",
      ],
      hero: { lineup: true },
      productsTitle: ["Découvrez tous nos", "petits conteneurs"],
      products: ["conteneur-10-pieds-dry-hc", "conteneur-10-pieds-dry", "conteneur-8-pieds-dry", "conteneur-6-pieds-dry", "conteneur-10-pieds-half-height"],
      compareTitle: ["Dimensions des", "petits conteneurs"],
      guideTitle: ["Quel petit conteneur", "choisir ?"],
      guide: [
        ["6 pieds : le plus compact", "Avec 1,98 m de long et **6 m³** de volume, le conteneur 6 pieds dry accueille une palette Europe. C’est le format le plus discret de la gamme, pour un rangement d’appoint."],
        ["8 pieds : le format intermédiaire", "Le conteneur 8 pieds dry mesure 2,44 m de long pour **9,9 m³** et 2 palettes Europe : un bon compromis entre encombrement et capacité."],
        ["10 pieds : la moitié d’un 20 pieds", "Le 10 pieds dry reprend la largeur et la hauteur d’un 20 pieds sur 2,99 m de long : **15,9 m³**, 6,66 m² au sol et 5 palettes Europe. En **High Cube**, sa hauteur passe à 2,90 m pour **17,9 m³**."],
        ["10 pieds half height : pour les charges denses", "Haut de 1,30 m seulement (7,3 m³), le **half height** est pensé pour les matériaux lourds, qui atteignent la charge maximale avant de remplir le volume."],
      ],
      usagesTitle: ["Les usages d’un", "petit conteneur"],
      usages: STD_USAGES,
      faq: [
        ["Quelles sont les dimensions d’un conteneur 10 pieds ?", [
          "Un conteneur 10 pieds dry mesure 2,99 m × 2,44 m × 2,59 m à l’extérieur, pour 2,83 m × 2,35 m × 2,39 m à l’intérieur. Il offre 15,9 m³ de volume et 6,66 m² de surface au sol.",
        ]],
        ["Quelle différence entre un 10 pieds dry et un 10 pieds High Cube ?", [
          "Seule la hauteur change : 2,59 m à l’extérieur pour le dry, 2,90 m pour le High Cube. La hauteur intérieure passe de 2,39 m à 2,70 m et le volume de 15,9 m³ à 17,9 m³.",
        ]],
        ["Combien pèse un petit conteneur maritime ?", [
          "Un conteneur 10 pieds dry pèse environ 1,45 tonne à vide, pour une charge maximale de 10 160 kg. Ce poids limité facilite son déplacement en camion-grue.",
        ]],
        ["Un petit conteneur est-il adapté à un particulier ?", [
          "Oui : sa faible emprise au sol permet de l’installer dans un jardin, une cour ou un terrain pour ranger outils, mobilier, vélos ou matériel de loisirs. Pour un usage purement statique, découvrez aussi nos [conteneurs de stockage](@stockage) de 5 à 15 pieds.",
        ]],
        FAQ_AUTORISATION,
        FAQ_LIVRAISON,
      ],
      related: ["20-pieds", "40-pieds", "stockage", "location-maritime"],
    },

    // ------------------------------------------------------------------ 20 PIEDS
    {
      id: "20-pieds", file: "conteneur-20-pieds.html", path: "conteneurs-maritimes/standards/20-pieds/", parent: "standards",
      nav: "20 pieds", range: "Standard",
      seoTitle: "Conteneur 20 pieds : dimensions, dry, HC, occasion | Cubner",
      meta: "Conteneur maritime 20 pieds : 6,06 m de long, 33,2 m³ en dry, 37,4 m³ en High Cube, 11 palettes Europe. Neuf ou d’occasion, livré partout en France.",
      keywords: "conteneur 20 pieds, container 20 pieds, conteneur 20 pieds dimensions, conteneur 20 pieds high cube, conteneur 20 pieds occasion, conteneur maritime 20 pieds",
      h1: ["Conteneurs", "20 pieds"],
      lead: "Le conteneur 20 pieds offre un volume de stockage standard.",
      intro: [
        "Robustes et étanches, ses **33 m³** s’adaptent facilement à tous vos projets. Le choix idéal pour **sécuriser votre matériel**, vos marchandises ou **expédier vos biens à l’export**.",
        "Conteneurs maritimes standards **CORTEN, étanches et sécurisés** — livraison possible partout en France.",
      ],
      hero: { img: "produits/conteneur-20-pieds-dry-1.jpg", alt: "Conteneur maritime 20 pieds dry gris anthracite vu de trois quarts, portes fermées", w: 1600, h: 1180 },
      productsTitle: ["Découvrez tous nos", "conteneurs 20 pieds"],
      products: [{ name: "Conteneur 20 pieds occasion", href: "@occasion", label: "20 pieds occasion", range: "Occasion" }, "conteneur-20-pieds-dry", "conteneur-20-pieds-dry-hc", "conteneur-20-pieds-half-height"],
      compareTitle: ["Dimensions d’un", "conteneur 20 pieds"],
      sheet: "conteneur-20-pieds-dry",
      guideTitle: ["Quel conteneur 20 pieds", "choisir ?"],
      guide: [
        ["20 pieds dry : le format de référence", "Le 20 pieds dry est le conteneur maritime le plus répandu : **33,2 m³**, 13,87 m² au sol et **11 palettes Europe**, pour 2,2 tonnes à vide. Il convient au stockage sur site comme au transport de marchandises."],
        ["20 pieds High Cube : 30 cm de plus", "Avec 2,90 m de haut à l’extérieur et 2,70 m à l’intérieur, le **High Cube** offre **37,4 m³**. Un plus pour les marchandises hautes, les rayonnages ou le stockage sur plusieurs niveaux."],
        ["20 pieds half height : les charges lourdes", "Le **half height** (1,30 m de haut, 15,1 m³) est conçu pour les matériaux denses : il atteint sa charge maximale avant de remplir son volume."],
        ["Neuf ou occasion ?", "Le **premier voyage** bénéficie d’une garantie d’étanchéité à vie sur les conteneurs dry (selon les CGV). Pour un budget maîtrisé, le [20 pieds d’occasion](@occasion) est inspecté avant expédition."],
      ],
      usagesTitle: ["Les usages d’un", "conteneur 20 pieds"],
      usages: STD_USAGES,
      faq: [
        ["Quelles sont les dimensions d’un conteneur 20 pieds ?", [
          "À l’extérieur, un conteneur 20 pieds dry mesure 6,06 m de long, 2,44 m de large et 2,59 m de haut. À l’intérieur : 5,90 m × 2,35 m × 2,39 m, soit 33,2 m³. L’ouverture des portes mesure 2,34 m de large pour 2,28 m de haut.",
        ]],
        ["Combien de palettes dans un conteneur 20 pieds ?", [
          "Un conteneur 20 pieds dry ou High Cube accueille 11 palettes Europe au sol.",
        ]],
        ["Combien pèse un conteneur 20 pieds ?", [
          "Un conteneur 20 pieds dry pèse environ 2,2 tonnes à vide (poids à vide de 2 200 kg) et accepte une charge maximale de 28 280 kg.",
        ]],
        ["Quelle surface au sol pour un conteneur 20 pieds ?", [
          "Son emprise extérieure est d’environ 15 m² (6,06 m × 2,44 m), pour 13,87 m² de surface utile à l’intérieur. Au-delà de 5 m² d’emprise, une déclaration préalable de travaux peut être nécessaire : renseignez-vous auprès de votre mairie.",
        ]],
        ["Quelle différence entre un 20 pieds dry et un 20 pieds High Cube ?", [
          "Le High Cube mesure 30 cm de plus en hauteur (2,90 m contre 2,59 m à l’extérieur). Son volume passe de 33,2 m³ à 37,4 m³ ; la longueur, la largeur et le nombre de palettes restent identiques.",
        ]],
        FAQ_LIVRAISON,
      ],
      related: ["petits", "40-pieds", "occasion", "location-maritime"],
    },

    // ------------------------------------------------------------------ 40 PIEDS
    {
      id: "40-pieds", file: "conteneur-40-pieds.html", path: "conteneurs-maritimes/standards/40-pieds/", parent: "standards",
      nav: "40 pieds", range: "Standard",
      seoTitle: "Conteneur 40 pieds : dimensions, dry, HC, pallet wide",
      meta: "Conteneur maritime 40 pieds : 12,19 m de long, 67,7 m³ en dry, 76,4 m³ en High Cube, 25 palettes Europe. Pallet wide jusqu’à 33 palettes.",
      keywords: "conteneur 40 pieds, container 40 pieds, conteneur 40 pieds dimensions, conteneur 40 pieds high cube, conteneur 45 pieds, conteneur pallet wide, conteneur maritime 40 pieds",
      h1: ["Conteneurs", "40 pieds"],
      lead: "Le conteneur 40 pieds offre un volume de stockage maximal et très rentable.",
      intro: [
        "Ses **67 m³** répondent à vos plus grands besoins de logistique. Pour **stocker de gros volumes**, sécuriser du matériel encombrant ou **centraliser vos stocks** sur un même site.",
        "Conteneurs maritimes standards **CORTEN, étanches et sécurisés** — livraison possible partout en France.",
      ],
      hero: { lineup: true },
      productsTitle: ["Découvrez tous nos", "conteneurs 40 pieds"],
      products: ["conteneur-45-pieds-pallets-wide-hc", "conteneur-40-pieds-dry", "conteneur-40-pieds-dry-hc", "conteneur-40-pieds-hc-pallet-wide"],
      compareTitle: ["Dimensions d’un", "conteneur 40 pieds"],
      sheet: "conteneur-40-pieds-dry",
      guideTitle: ["Quel conteneur 40 pieds", "choisir ?"],
      guide: [
        ["40 pieds dry : le grand volume", "Avec 12,19 m de long, le 40 pieds dry offre **67,7 m³**, 28,3 m² au sol et **25 palettes Europe**. C’est le format le plus rentable au mètre cube pour stocker de gros volumes."],
        ["40 pieds High Cube : la hauteur en plus", "Le **High Cube** atteint 2,90 m de haut à l’extérieur (2,70 m à l’intérieur) pour **76,4 m³**. Il est très apprécié pour les marchandises légères mais encombrantes et le stockage en racks."],
        ["Pallet wide : optimisé pour les palettes", "Les modèles **pallet wide** sont conçus pour le chargement de palettes Europe. Le **45 pieds pallets wide High Cube**, long de 13,72 m et large de 2,50 m, accueille jusqu’à **33 palettes Europe** pour 89 m³."],
        ["Accès et livraison", "Un 40 pieds est livré par semi-remorque : vérifiez en amont la largeur d’accès, le rayon de braquage et la place nécessaire au déchargement. Pour un accès traversant ou latéral, voyez nos [conteneurs spécifiques](@specifiques) double door et open side."],
      ],
      usagesTitle: ["Les usages d’un", "conteneur 40 pieds"],
      usages: STD_USAGES,
      faq: [
        ["Quelles sont les dimensions d’un conteneur 40 pieds ?", [
          "À l’extérieur, un conteneur 40 pieds dry mesure 12,19 m de long, 2,44 m de large et 2,59 m de haut. À l’intérieur : 12,03 m × 2,35 m × 2,39 m, soit 67,7 m³. L’ouverture des portes mesure 2,34 m de large pour 2,28 m de haut.",
        ]],
        ["Combien de palettes dans un conteneur 40 pieds ?", [
          "Un conteneur 40 pieds dry ou High Cube accueille 25 palettes Europe. Le 45 pieds pallets wide High Cube monte jusqu’à 33 palettes Europe.",
        ]],
        ["Combien pèse un conteneur 40 pieds ?", [
          "Un conteneur 40 pieds dry pèse environ 3,8 tonnes à vide (3 800 kg) et accepte une charge maximale de 26 680 kg.",
        ]],
        ["Quelle différence entre un 40 pieds dry et un 40 pieds High Cube ?", [
          "Le High Cube mesure 30 cm de plus en hauteur : 2,90 m à l’extérieur contre 2,59 m. Le volume passe de 67,7 m³ à 76,4 m³, pour la même longueur et le même nombre de palettes.",
        ]],
        ["Faut-il un permis pour installer un conteneur 40 pieds ?", [
          "Un conteneur 40 pieds représente près de 30 m² d’emprise au sol. Au-delà de 20 m², un permis de construire peut être nécessaire selon l’usage et la durée d’installation. Les règles varient selon le PLU : rapprochez-vous du service urbanisme de votre mairie.",
        ]],
        FAQ_LIVRAISON,
      ],
      related: ["20-pieds", "petits", "specifiques", "location-maritime"],
    },

    // ------------------------------------------------------------------ LOCATION MARITIME
    {
      id: "location-maritime", file: "location-conteneur-maritime.html", path: "conteneurs-maritimes/standards/location/", parent: "standards",
      nav: "Location", range: "Standard",
      seoTitle: "Location de conteneur maritime 10, 20, 40 pieds | Cubner",
      meta: "Louez un conteneur maritime pour un chantier, une saison ou un projet ponctuel : formats 10, 20 et 40 pieds, livraison et déchargement sur site.",
      keywords: "location conteneur maritime, louer un conteneur, location container, location conteneur 20 pieds, location conteneur 40 pieds, location conteneur stockage",
      h1: ["Location de", "conteneur maritime"],
      lead: "Un conteneur sur votre site, le temps de votre projet.",
      intro: [
        "Chantier, stockage temporaire, déménagement d’activité, opération saisonnière : la **location de conteneur maritime** apporte un espace de stockage **sécurisé et étanche** sans immobiliser de budget.",
        "Cubner organise la livraison et le déchargement de votre conteneur sur site. Le tarif de location est établi **sur devis**.",
      ],
      hero: { lineup: true },
      productsTitle: ["Les conteneurs", "disponibles à la location"],
      productsNote: "La location est proposée selon les modèles et les disponibilités : l’état « Location » est indiqué sur chaque fiche.",
      products: ["conteneur-10-pieds-dry", "conteneur-20-pieds-dry", "conteneur-20-pieds-dry-hc", "conteneur-40-pieds-dry", "conteneur-40-pieds-dry-hc"],
      guideTitle: ["Louer, acheter", "ou financer ?"],
      guide: [
        ["La location", "Idéale pour un **besoin ponctuel** : chantier, période de forte activité, stockage le temps de travaux. Vous disposez du conteneur sans l’acheter, et le rendez à la fin du projet."],
        ["L’achat", "Pour un usage **durable** ou un stockage permanent, l’achat reste la solution la plus économique dans le temps. Les conteneurs dry premier voyage bénéficient d’une garantie d’étanchéité à vie (selon les CGV)."],
        ["La location avec option d’achat (LOA)", "Le **leasing avec option d’achat** étale le coût sur plusieurs années via un organisme financeur partenaire ; Cubner reste votre interlocuteur pour le matériel et la livraison."],
        ["Bien préparer l’emplacement", "Prévoyez une surface **plane et stable**, et un accès adapté au camion de livraison (largeur, hauteur libre, rayon de braquage). Nos équipes étudient ces contraintes avec vous avant la livraison."],
      ],
      usagesTitle: ["Pourquoi louer un", "conteneur maritime ?"],
      usages: [U.chantier, U.demenagement,
        { title: "Stockage temporaire", icon: "i-clock", paras: [
          "Travaux dans vos locaux, surstock saisonnier, archives, déménagement : le conteneur loué complète vos espaces **le temps nécessaire**.",
          "Structure acier, portes sécurisées et étanchéité : vos biens restent protégés, sur votre site.",
        ] }],
      faq: [
        ["Comment louer un conteneur maritime chez Cubner ?", [
          "Choisissez votre modèle, puis demandez un devis en précisant la durée souhaitée et le lieu de livraison. La location est proposée selon les modèles et les disponibilités : l’état « Location » est indiqué sur chaque fiche produit.",
        ]],
        ["Quel conteneur louer pour un chantier ?", [
          "Le 20 pieds est le format le plus courant : 33,2 m³ et 6,06 m de long, facile à positionner sur la plupart des chantiers. Pour de petits volumes ou un accès difficile, le 10 pieds (2,99 m) est plus maniable ; pour de gros volumes, le 40 pieds offre 67,7 m³.",
        ]],
        ["La livraison est-elle comprise dans la location ?", [
          "Le transport et le déchargement sont organisés par Cubner et chiffrés selon le mode de livraison (camion-plateau ou camion-grue) et la distance. Vous pouvez aussi retirer le conteneur dans l’un de nos dépôts.",
        ]],
        ["Peut-on acheter le conteneur à la fin de la location ?", [
          "Si vous souhaitez devenir propriétaire, la location avec option d’achat (LOA) via un organisme financeur partenaire est conçue pour cela. Contactez-nous pour étudier la solution la plus adaptée.",
        ]],
        FAQ_TERRAIN,
      ],
      related: ["20-pieds", "40-pieds", "location-frigorifique", "stockage"],
    },

    // ------------------------------------------------------------------ FRIGORIFIQUES
    {
      id: "frigorifiques", file: "conteneurs-frigorifiques.html", path: "conteneurs-maritimes/frigorifiques/", parent: null,
      nav: "Frigorifiques", range: "Frigorifique",
      seoTitle: "Conteneur frigorifique reefer : 10 à 45 pieds | Cubner",
      meta: "Conteneurs frigorifiques reefer de 10 à 45 pieds : chambre froide mobile en froid positif ou négatif, modèles High Cube, blast et ATEX.",
      keywords: "conteneur frigorifique, container frigorifique, conteneur reefer, chambre froide mobile, conteneur réfrigéré, conteneur frigorifique 20 pieds, conteneur frigorifique 40 pieds",
      h1: ["Conteneurs", "frigorifiques"],
      lead: "Découvrez la gamme complète de conteneurs frigorifiques Cubner.",
      intro: [
        "Les **conteneurs reefer**, ou conteneurs réfrigérés, sont essentiels pour le transport et le stockage de produits nécessitant un **contrôle strict de la température** et de l’humidité.",
        "Conçus pour maintenir des conditions froides, tempérées ou congelées, ces conteneurs garantissent le respect des **denrées alimentaires**, des produits pharmaceutiques et d’autres biens périssables. Ils sont équipés de systèmes de réfrigération avancés qui régulent la température, garantissant ainsi la conservation des produits stockés.",
      ],
      hero: { img: "familles/frigorifiques.jpg", alt: "Conteneurs frigorifiques reefer Cubner" },
      children: [
        ["location-frigorifique", "Une chambre froide mobile pour un **événement, une saison** ou un besoin ponctuel : louez votre conteneur frigorifique."],
      ],
      childrenTitle: ["Achat ou", "location"],
      productsTitle: ["Découvrez tous nos", "conteneurs frigorifiques"],
      products: ["conteneur-frigorifique-ice-max", "conteneur-frigorifique-45-pieds-pallets-wide", "conteneur-frigorifique-40-pieds-blast-hc", "conteneur-frigorifique-40-pieds-hc",
        "conteneur-frigorifique-20-pieds-atex", "conteneur-frigorifique-20-pieds", "conteneur-frigorifique-20-pieds-hc", "conteneur-frigorifique-10-pieds", "conteneur-frigorifique-10-pieds-hc", "conteneur-frigorifique-iso-sans-groupe"],
      compareTitle: ["Dimensions des", "conteneurs frigorifiques"],
      guideTitle: ["Comment choisir un", "conteneur frigorifique ?"],
      guide: [
        ["Le volume : de 12 à 81 m³", "Du **10 pieds** (12,5 m³, 4 palettes Europe) au **45 pieds pallets wide** (81,4 m³, 30 palettes Europe), choisissez le format selon la quantité de produits à conserver. Le **High Cube** ajoute 30 cm de hauteur pour un volume supérieur à longueur égale."],
        ["La température : froid positif ou négatif", "Selon les modèles, nos conteneurs frigorifiques fonctionnent **de –60 °C jusqu’à +35 °C**. Ils couvrent la conservation en froid positif comme la congélation et la surgélation."],
        ["Les modèles spécifiques", "Le **40 pieds blast HC** est conçu pour la surgélation, avec intérieur inox et isolation de 100 mm. Le **20 pieds ATEX** est équipé d’un groupe froid pour zone explosible. La caisse **ISO sans groupe froid** offre un caisson isolé à équiper selon votre installation."],
        ["L’alimentation électrique", "Le groupe froid fonctionne à l’électricité : prévoyez un raccordement adapté sur site. Pour une **autonomie totale** sur un site isolé, l’ajout d’un groupe électrogène est recommandé."],
      ],
      usagesTitle: ["Les usages d’un", "conteneur frigorifique"],
      usages: [
        { title: "Métiers de bouche", icon: "i-cutlery", paras: [
          "Restaurateurs, traiteurs, bouchers, glaciers ou grossistes : le conteneur frigorifique apporte une **capacité de stockage froid supplémentaire** pour vos matières premières et vos préparations, en froid positif comme négatif.",
          "Pour produire de la glace rapidement et en grande quantité, Cubner propose aussi une solution de production avec des conteneurs reefer, que nous appelons aussi **conteneurs de surgélation**.",
        ] },
        { title: "Agriculture", icon: "i-wheat", paras: [
          "Nos clients agriculteurs recherchent un **lieu de stockage sain et sécurisé** pour y entreposer leur production. Le leader mondial des plants truffiers travaille par exemple avec Cubner pour y stocker ses précieuses productions.",
          "Apiculture, horticulture, arboriculture, pisciculture, pépinières : autant de métiers susceptibles d’utiliser nos solutions **IceCubner**. Et votre conteneur frigorifique reste une solution mobile, surtout en 10 pieds.",
        ] },
        { title: "Métiers de la mer", icon: "i-ship", paras: [
          "Ostréiculteurs et marins-pêcheurs utilisent nos IceCubner pour stocker leurs denrées et leurs productions, avec des besoins en **froid positif et négatif**.",
          "Facile d’utilisation, robuste et modulable, cette **chambre froide mobile** se place à l’intérieur comme à l’extérieur.",
        ] },
        { title: "Industrie et pharmacie", icon: "i-flask", paras: [
          "Nos clients stockent déjà des **composants électroniques**, des appareils spécifiques, des œuvres d’art, des peintures, des produits chimiques et technologiques dans nos conteneurs frigorifiques.",
          "De 12 m³ à 84 m³ de stockage, et plus si nécessaire, **de –60 °C jusqu’à +35 °C** selon les modèles.",
        ] },
        { title: "Loisirs et événementiel", icon: "i-ticket", link: ["@location-frigorifique", "Louer une chambre froide mobile"], paras: [
          "Pour un événement ponctuel ou récurrent, une période de forte affluence, un salon ou un mariage, optez pour la **chambre froide mobile IceCubner**.",
          "Une solution **plug and play** robuste et facile d’utilisation, pour des besoins en température positive ou négative.",
        ] },
        { title: "Armée", icon: "i-shield", paras: [
          "Nos IceCubner sont déjà déployés dans les **zones extrêmes ou de conflits**, en Afrique et dans le cercle polaire, avec un groupe froid résistant aux climats hostiles et tropicaux.",
          "Équipée d’un groupe électrogène, la chambre froide devient totalement autonome et conserve munitions, missiles et équipements militaires à la **température optimale**.",
        ] },
      ],
      faq: [
        ["Qu’est-ce qu’un conteneur reefer ?", [
          "Un conteneur reefer (de l’anglais « refrigerated ») est un conteneur maritime isolé, équipé d’un groupe froid intégré qui régule la température et l’humidité. Il sert au transport comme au stockage de produits sensibles : denrées alimentaires, produits pharmaceutiques, biens périssables.",
        ]],
        ["Quelle température peut atteindre un conteneur frigorifique ?", [
          "Selon les modèles, nos conteneurs frigorifiques fonctionnent de –60 °C jusqu’à +35 °C. Ils couvrent ainsi le froid positif, la congélation et la surgélation.",
        ]],
        ["Quelle est la différence entre un conteneur frigorifique standard et un blast ?", [
          "Le conteneur blast est conçu pour la surgélation : notre 40 pieds blast HC associe un intérieur inox, une isolation polyuréthane de 100 mm et cinq groupes Thermo King Magnum Plus.",
        ]],
        ["Un conteneur frigorifique peut-il être autonome ?", [
          "Le groupe froid fonctionne à l’électricité. Raccordé au réseau, il est prêt à l’emploi ; sur un site isolé, l’ajout d’un groupe électrogène (recommandé) rend la chambre froide totalement autonome.",
        ]],
        ["Peut-on louer un conteneur frigorifique ?", [
          "Oui, pour un événement, une saison ou un besoin ponctuel. Découvrez notre offre de [location de conteneurs frigorifiques](@location-frigorifique).",
        ]],
        FAQ_LIVRAISON,
      ],
      related: ["location-frigorifique", "standards", "specifiques", "occasion"],
    },

    // ------------------------------------------------------------------ LOCATION FRIGORIFIQUE
    {
      id: "location-frigorifique", file: "location-conteneur-frigorifique.html", path: "conteneurs-maritimes/frigorifiques/location/", parent: "frigorifiques",
      nav: "Location frigorifique", range: "Frigorifique",
      seoTitle: "Location conteneur frigorifique, chambre froide | Cubner",
      meta: "Location de conteneur frigorifique : une chambre froide mobile de 10 à 45 pieds pour un événement, une saison ou un besoin ponctuel, livrée sur site.",
      keywords: "location conteneur frigorifique, location chambre froide, location chambre froide mobile, louer conteneur frigorifique, location container frigorifique, location reefer",
      h1: ["Location de", "conteneur frigorifique"],
      lead: "Une chambre froide mobile, livrée là où vous en avez besoin.",
      intro: [
        "Événement, saison touristique, pic d’activité, panne ou travaux de votre chambre froide : la **location de conteneur frigorifique** apporte une capacité de froid **immédiate et temporaire**.",
        "Une solution **plug and play**, robuste et facile d’utilisation, pour vos besoins en température positive ou négative. Le tarif de location est établi **sur devis**.",
      ],
      hero: { img: "familles/frigorifiques.jpg", alt: "Conteneur frigorifique en location livré sur site" },
      productsTitle: ["Les conteneurs frigorifiques", "à la location"],
      productsNote: "La location est proposée selon les modèles et les disponibilités : l’état « Location » est indiqué sur chaque fiche.",
      products: ["conteneur-frigorifique-10-pieds", "conteneur-frigorifique-10-pieds-hc", "conteneur-frigorifique-20-pieds", "conteneur-frigorifique-20-pieds-hc", "conteneur-frigorifique-20-pieds-atex",
        "conteneur-frigorifique-40-pieds-hc", "conteneur-frigorifique-40-pieds-blast-hc", "conteneur-frigorifique-45-pieds-pallets-wide", "conteneur-frigorifique-ice-max", "conteneur-frigorifique-iso-sans-groupe"],
      compareTitle: ["Dimensions des", "conteneurs frigorifiques"],
      guideTitle: ["Bien choisir votre", "location frigorifique"],
      guide: [
        ["Le bon volume", "Un **10 pieds** (12,5 m³) suffit pour un événement ou un commerce ; un **20 pieds** (28,3 m³, 10 palettes Europe) couvre la plupart des besoins professionnels ; le **40 pieds** et le 45 pieds pallets wide répondent aux gros volumes."],
        ["La bonne température", "Froid positif pour la conservation, négatif pour la congélation : selon les modèles, nos conteneurs fonctionnent **de –60 °C jusqu’à +35 °C**."],
        ["L’alimentation", "Prévoyez un **raccordement électrique** adapté au groupe froid. Sur un site isolé ou un événement en plein air, un groupe électrogène rend la chambre froide autonome."],
        ["L’emplacement", "Une surface **plane et stable**, un accès pour le camion de livraison et un dégagement devant le groupe froid pour sa ventilation."],
      ],
      usagesTitle: ["Pourquoi louer une", "chambre froide mobile ?"],
      usages: [
        { title: "Événements et saisons", icon: "i-ticket", paras: [
          "Salon, festival, mariage, période de forte affluence : la chambre froide mobile IceCubner s’installe pour la durée de l’**événement ponctuel ou récurrent**.",
        ] },
        { title: "Métiers de bouche", icon: "i-cutlery", paras: [
          "Saison estivale, traiteur, production de glace, hausse ponctuelle des commandes : un **complément de froid** sans investissement lourd.",
        ] },
        { title: "Relais de votre chambre froide", icon: "i-snow", paras: [
          "Travaux, rénovation ou panne de votre installation : le conteneur frigorifique loué **prend le relais** pour conserver vos produits à la bonne température.",
        ] },
      ],
      faq: [
        ["Comment louer un conteneur frigorifique ?", [
          "Choisissez votre modèle, puis demandez un devis en précisant la durée, la température souhaitée et le lieu de livraison. La location est proposée selon les modèles et les disponibilités.",
        ]],
        ["Quelle alimentation électrique faut-il prévoir ?", [
          "Le groupe froid fonctionne à l’électricité : un raccordement adapté est nécessaire sur site. Pour une installation autonome, l’ajout d’un groupe électrogène est recommandé.",
        ]],
        ["Quelle taille de conteneur frigorifique louer ?", [
          "À titre indicatif : 12,5 m³ et 4 palettes Europe pour un 10 pieds, 28,3 m³ et 10 palettes pour un 20 pieds, 67,8 m³ et 20 palettes pour un 40 pieds High Cube.",
        ]],
        ["Peut-on acheter un conteneur frigorifique plutôt que le louer ?", [
          "Oui : pour un usage durable, découvrez toute notre gamme de [conteneurs frigorifiques](@frigorifiques) à l’achat ou en leasing avec option d’achat.",
        ]],
        FAQ_LIVRAISON,
      ],
      related: ["frigorifiques", "location-maritime", "occasion"],
    },

    // ------------------------------------------------------------------ SPÉCIFIQUES
    {
      id: "specifiques", file: "conteneurs-specifiques.html", path: "conteneurs-maritimes/specifiques/", parent: null,
      nav: "Spécifiques", range: "Spécifique",
      seoTitle: "Conteneur open side, open top, double door | Cubner",
      meta: "Conteneurs spécifiques en acier CORTEN : open side, open top, double door, flat rack et ISOTANK en 20 et 40 pieds, pour les charges hors gabarit.",
      keywords: "conteneur open side, conteneur open top, conteneur double door, conteneur double porte, flat rack, isotank, conteneur spécifique, conteneur ouverture latérale",
      h1: ["Conteneurs", "spécifiques"],
      lead: "Découvrez la gamme complète de conteneurs spécifiques Cubner.",
      intro: [
        "Les conteneurs spécifiques répondent aux **contraintes de chargement, d’accès ou de transport** que les modèles standards ne couvrent pas : ouverture latérale complète, toit ouvrant, double porte, flat rack ou cuve ISOTANK.",
        "Conçus en **acier CORTEN**, ils restent adaptés au transport maritime et au stockage de longue durée, avec des configurations pensées pour les marchandises **volumineuses, indivisibles ou hors gabarit**. Cubner propose ces formats en premier voyage ou en occasion.",
      ],
      hero: { lineup: true },
      productsTitle: ["Découvrez tous nos", "conteneurs spécifiques"],
      products: ["conteneur-40-pieds-open-side-hc", "conteneur-40-pieds-open-top", "conteneur-40-pieds-double-door", "conteneur-20-pieds-open-top", "conteneur-20-pieds-double-door",
        "conteneur-20-pieds-open-side", "conteneur-isotank", "conteneur-flat-rack-20-pieds", "conteneur-flat-rack-40-pieds"],
      compareTitle: ["Dimensions des", "conteneurs spécifiques"],
      usagesTitle: ["Quel conteneur spécifique", "pour quel besoin ?"],
      usages: [
        { title: "Ouverture latérale (Open Side)", icon: "i-door", paras: [
          "Le conteneur open side est l’unité préférée des professionnels pour la manipulation de **marchandises volumineuses ou indivisibles**.",
          "Sa particularité : une absence de montant central permettant un **accès total sur toute sa longueur** (12 mètres sur le format 40 pieds), idéal pour le chargement au quai ou au sol avec chariot élévateur.",
        ] },
        { title: "Open Top", icon: "i-container", paras: [
          "Le conteneur open top possède une **grande ouverture sur sa toiture**, souvent sous forme de bâche amovible, qui facilite le chargement et le stockage d’équipements de grande longueur.",
          "Il convient aux projets industriels, au BTP ou à la logistique de pièces ne pouvant pas passer par les portes arrière standard.",
        ] },
        { title: "Double porte (Double Door)", icon: "i-locker", paras: [
          "Le conteneur double door se caractérise par une **ouverture complète à chaque extrémité**.",
          "Il offre un **accès traversant**, qui simplifie la gestion des flux de marchandises : chargement d’un côté, déchargement de l’autre.",
        ] },
        { title: "Flat Rack & ISOTANK", icon: "i-tank", paras: [
          "Le **flat rack**, à parois d’extrémité rabattables, permet le transport d’équipements encombrants dépassant les dimensions d’un conteneur dry.",
          "L’**ISOTANK** permet le stockage et le transport de produits liquides en vrac : notre modèle 22K2 dispose d’une cuve inox de 24 000 litres.",
        ] },
      ],
      faq: [
        ["Quelle est la différence entre un conteneur open side et un conteneur double door ?", [
          "L’open side s’ouvre sur l’un de ses grands côtés : tout le flanc devient accessible, sans montant central. Le double door s’ouvre à ses deux extrémités, pour un accès traversant de bout en bout.",
        ]],
        ["À quoi sert un conteneur open top ?", [
          "Son toit bâché amovible permet de charger par le dessus, à la grue ou au pont roulant, des pièces trop hautes ou trop longues pour passer par les portes : machines, structures métalliques, matériaux de grande longueur.",
        ]],
        ["Qu’est-ce qu’un flat rack ?", [
          "C’est un conteneur réduit à un plancher et à deux parois d’extrémité rabattables. Il transporte les charges hors gabarit, qui dépassent en largeur ou en hauteur. Notre flat rack 40 pieds accepte jusqu’à 40 000 kg de charge.",
        ]],
        ["Qu’est-ce qu’un conteneur ISOTANK ?", [
          "C’est une citerne inox insérée dans un cadre aux dimensions d’un conteneur 20 pieds, ce qui permet de la manutentionner comme un conteneur classique. Notre modèle 22K2 offre 24 000 litres, avec calorifugeage de 50 mm et réchauffeur vapeur.",
        ]],
        ["Les conteneurs spécifiques sont-ils disponibles d’occasion ?", [
          "Oui, Cubner propose ces formats en premier voyage ou en occasion. Découvrez aussi nos [conteneurs d’occasion](@occasion).",
        ]],
        FAQ_LIVRAISON,
      ],
      related: ["standards", "40-pieds", "frigorifiques", "offshore"],
    },

    // ------------------------------------------------------------------ OCCASION
    {
      id: "occasion", file: "conteneurs-occasion.html", path: "conteneurs-maritimes/occasion/", parent: null,
      nav: "Occasion", range: "Occasion",
      seoTitle: "Conteneur maritime d’occasion 10, 20, 40 pieds | Cubner",
      meta: "Conteneurs maritimes d’occasion en 10, 20 et 40 pieds : unités contrôlées avant expédition, prêtes à l’emploi, pour un budget maîtrisé.",
      keywords: "conteneur occasion, conteneur maritime occasion, container occasion, conteneur 20 pieds occasion, conteneur 40 pieds occasion, acheter conteneur occasion",
      h1: ["Conteneurs", "d’occasion"],
      lead: "Des conteneurs contrôlés, prêts à l’emploi, pour un budget maîtrisé.",
      intro: [
        "Le **conteneur maritime d’occasion** permet de **sécuriser rapidement un stockage**, de protéger du matériel sur un chantier ou de transporter des marchandises à moindre coût.",
        "Cubner propose des formats **10, 20 et 40 pieds**, avec livraison possible partout en France. Consultez nos [garanties occasions](https://www.cubner.com/garanties-cubner-occasions/) pour connaître le niveau de contrôle de chaque unité. Pour un conteneur neuf, découvrez la [gamme standards](@standards).",
      ],
      hero: { lineup: true },
      productsTitle: ["Nos conteneurs d’occasion", "par format"],
      products: [
        { name: "Conteneur 10 pieds occasion", href: "https://www.cubner.com/categorie-produit/conteneurs/occasion/", label: "10 pieds occasion", range: "Occasion", like: "conteneur-10-pieds-dry" },
        { name: "Conteneur 20 pieds occasion", href: "https://www.cubner.com/categorie-produit/conteneurs/occasion/", label: "20 pieds occasion", range: "Occasion", like: "conteneur-20-pieds-dry" },
        { name: "Conteneur 40 pieds occasion", href: "https://www.cubner.com/categorie-produit/conteneurs/occasion/", label: "40 pieds occasion", range: "Occasion", like: "conteneur-40-pieds-dry" },
      ],
      guideTitle: ["Occasion ou", "premier voyage ?"],
      guide: [
        ["Le conteneur d’occasion", "Il a déjà servi au transport maritime. Chaque unité est **inspectée avant expédition** ; les conditions de garantie applicables sont celles indiquées au devis et dans les CGV. C’est la solution la plus économique pour un stockage durable."],
        ["Le conteneur premier voyage", "Il n’a effectué qu’**une seule traversée** depuis sa fabrication. Les conteneurs dry premier voyage bénéficient d’une **garantie d’étanchéité à vie**, sous réserve des conditions générales de vente."],
        ["Mêmes dimensions", "Un 20 pieds d’occasion reprend les cotes d’un 20 pieds neuf : 6,06 m × 2,44 m × 2,59 m à l’extérieur pour 33,2 m³. Retrouvez toutes les dimensions sur nos pages [20 pieds](@20-pieds) et [40 pieds](@40-pieds)."],
        ["Pour quel projet ?", "Stockage sur chantier, site temporaire, réserve de matériel : l’occasion est idéale. Pour un conteneur installé en vue (devant un commerce, chez un particulier), le premier voyage offre un meilleur état de surface."],
      ],
      usagesTitle: ["Pourquoi choisir un", "conteneur d’occasion ?"],
      usages: [
        { title: "État & garantie", icon: "i-shield", link: ["https://www.cubner.com/garanties-cubner-occasions/", "Nos garanties occasions"], paras: [
          "Chaque conteneur d’occasion est présenté avec **transparence** sur son historique et son état général.",
          "Consultez la page Garanties Cubner occasions pour comprendre ce que nous contrôlons avant livraison et les engagements associés à votre achat.",
        ] },
        { title: "Stockage & chantier", icon: "i-barrier", paras: [
          "L’occasion est idéale pour **sécuriser rapidement du matériel** sur un chantier ou un site temporaire, à coût maîtrisé.",
          "Structure acier, étanchéité et portes sécurisées : vous obtenez un espace de rangement fiable sans attendre la fabrication d’un neuf.",
        ] },
        { title: "Agriculture & entreprises", icon: "i-wheat", paras: [
          "Matériel agricole, récoltes, surstock, archives ou pièces détachées : le **conteneur d’occasion** offre un volume de stockage étanche au **meilleur rapport qualité-prix**.",
          "Mêmes dimensions qu’un neuf : **11 palettes Europe** en 20 pieds, **25** en 40 pieds.",
        ] },
      ],
      faq: [
        ["Quelle différence entre un conteneur d’occasion et un premier voyage ?", [
          "Un conteneur premier voyage n’a effectué qu’une traversée depuis sa fabrication : il est quasiment neuf et, en version dry, bénéficie d’une garantie d’étanchéité à vie (selon les CGV). Un conteneur d’occasion a davantage servi ; il est inspecté avant expédition et garanti selon les conditions indiquées au devis.",
        ]],
        ["Un conteneur d’occasion est-il étanche ?", [
          "Chaque unité est inspectée avant expédition, notamment sur sa structure et son étanchéité. Le niveau de contrôle est détaillé sur notre page garanties occasions.",
        ]],
        ["Quels formats de conteneurs d’occasion proposez-vous ?", [
          "Cubner propose des conteneurs d’occasion en 10, 20 et 40 pieds, avec livraison possible partout en France.",
        ]],
        ["Quels sont les usages d’un conteneur maritime d’occasion ?", [
          "Le conteneur d’occasion sert principalement au stockage : matériel de chantier, outillage, récoltes et matériel agricole, surstock d’entreprise, archives ou garde-meubles. Il reste aussi apte au transport de marchandises lorsque son certificat CSC est valide.",
        ]],
        FAQ_LIVRAISON,
      ],
      related: ["standards", "20-pieds", "40-pieds", "stockage"],
    },

    // ------------------------------------------------------------------ STOCKAGE
    {
      id: "stockage", file: "conteneurs-stockage.html", path: "conteneurs-maritimes/stockage/", parent: null,
      nav: "Stockage", range: "Stockage",
      seoTitle: "Conteneur de stockage de 5 à 15 pieds | Cubner",
      meta: "Conteneurs de stockage de 5 à 15 pieds en acier CORTEN : un espace étanche et sécurisé sur une faible emprise, pour le jardin, le chantier ou l’entreprise.",
      keywords: "conteneur de stockage, container de stockage, conteneur stockage jardin, box de stockage, conteneur 5 pieds, conteneur 15 pieds, abri de stockage métallique",
      h1: ["Conteneurs", "de stockage"],
      lead: "Sécurisez vos biens sur une faible emprise au sol.",
      intro: [
        "Du **5 au 15 pieds**, nos conteneurs de stockage sont pensés pour un **usage statique** : jardin, entreprise, chantier ou site industriel.",
        "Structure **CORTEN**, étanchéité et portes sécurisées : même exigence de robustesse que le maritime, dans des formats plus compacts. Proposés en premier voyage, occasion ou location, avec livraison et déchargement possibles partout en France.",
      ],
      hero: { lineup: true },
      productsTitle: ["Découvrez tous nos", "conteneurs de stockage"],
      products: ["conteneur-stockage-5-pieds", "conteneur-stockage-6-pieds", "conteneur-stockage-7-pieds", "conteneur-stockage-8-pieds", "conteneur-stockage-10-pieds", "conteneur-stockage-15-pieds"],
      compareTitle: ["Dimensions des", "conteneurs de stockage"],
      guideTitle: ["Quelle taille de", "conteneur de stockage ?"],
      guide: [
        ["5 à 7 pieds : le rangement compact", "De **4,6 à 8,1 m³**, ces formats s’installent dans un jardin, une cour ou un local technique pour ranger outils, vélos ou matériel de loisirs. Le 5 pieds ne mesure que 1,52 m de long."],
        ["8 et 10 pieds : le polyvalent", "Avec **9,9 m³** (8 pieds) ou **15,9 m³** (10 pieds, 5 palettes Europe), ils accueillent le stock d’un artisan, d’un commerce ou d’une association."],
        ["15 pieds : le grand volume compact", "Long de 4,50 m pour **24,4 m³** et 8 palettes Europe, le 15 pieds offre une capacité proche d’un 20 pieds sur une emprise réduite."],
        ["Emplacement et accès", "Posez votre conteneur sur une surface **plane et stable**, en laissant le dégagement nécessaire à l’ouverture des portes et à l’accès du camion de livraison."],
      ],
      usagesTitle: ["Les usages d’un", "conteneur de stockage"],
      usages: [
        { title: "Particuliers & jardin", icon: "i-house", paras: [
          "Rangement outils, mobilier, vélo ou matériel de loisirs : le conteneur de stockage s’installe sur une **faible emprise au sol**.",
          "Structure acier **étanche**, porte sécurisée : un espace discret et durable à proximité de la maison.",
        ] },
        { title: "Artisans & chantiers", icon: "i-tools", paras: [
          "Sur un chantier, le conteneur protège l’**outillage et les matériaux de valeur** contre le vol et les intempéries.",
          "Formats compacts de 5 à 15 pieds : faciles à positionner, puis à déplacer vers le prochain site.",
        ] },
        { title: "Entreprises & commerces", icon: "i-shelves", paras: [
          "Surstock, archives, pièces détachées ou équipements saisonniers : le conteneur de stockage **complète vos locaux** sans travaux lourds.",
          "Une solution modulaire, évolutive et sécurisée en zone urbaine ou industrielle.",
        ] },
      ],
      faq: [
        ["Quelle est la différence entre un conteneur de stockage et un conteneur maritime ?", [
          "Le conteneur de stockage est pensé pour un usage statique : il reprend la robustesse du maritime (structure CORTEN, étanchéité, portes sécurisées) dans des formats plus compacts, de 5 à 15 pieds. Le conteneur maritime standard est conçu pour le transport intermodal comme pour le stockage.",
        ]],
        ["Quel est le plus petit conteneur de stockage ?", [
          "Le conteneur de stockage 5 pieds : 1,52 m de long, 1,96 m de large et 1,91 m de haut à l’extérieur, pour 4,6 m³ de volume.",
        ]],
        ["Peut-on installer un conteneur de stockage dans son jardin ?", [
          "Oui, c’est l’un de ses usages les plus courants. Vérifiez au préalable les règles d’urbanisme de votre commune : au-delà de 5 m² d’emprise au sol, une déclaration préalable de travaux peut être nécessaire.",
        ]],
        ["Peut-on louer un conteneur de stockage ?", [
          "Oui, nos conteneurs de stockage sont proposés en premier voyage, en occasion ou à la location. Découvrez aussi la [location de conteneurs maritimes](@location-maritime).",
        ]],
        FAQ_TERRAIN,
      ],
      related: ["petits", "location-maritime", "occasion", "standards"],
    },

    // ------------------------------------------------------------------ OFF-SHORE
    {
      id: "offshore", file: "conteneurs-offshore.html", path: "conteneurs-maritimes/offshores/", parent: null,
      nav: "Off-Shore", range: "Off-Shore",
      seoTitle: "Conteneur off-shore DNV 2.7-1 : 10 et 20 pieds | Cubner",
      meta: "Conteneurs off-shore 10 et 20 pieds en acier CORTEN, conformes DNV 2.7-1 / CSC : pour les plateformes, l’énergie offshore et les sites isolés.",
      keywords: "conteneur offshore, container offshore, conteneur DNV 2.7-1, conteneur off-shore 10 pieds, conteneur off-shore 20 pieds, conteneur plateforme pétrolière",
      h1: ["Conteneurs", "Off-Shore"],
      lead: "Des conteneurs conçus pour les conditions les plus exigeantes : mer, plateformes, sites isolés.",
      intro: [
        "Formats **10 et 20 pieds** en structure CORTEN, conformes **DNV 2.7-1 / CSC**, étanches, livrables en premier voyage, occasion ou location.",
        "Cubner vous accompagne sur le **choix du modèle**, la livraison et la mise en service sur site.",
      ],
      hero: { lineup: true },
      productsTitle: ["Découvrez nos", "conteneurs Off-Shore"],
      products: ["conteneur-offshore-10-pieds", "conteneur-offshore-20-pieds"],
      compareTitle: ["Dimensions des", "conteneurs Off-Shore"],
      guideTitle: ["Bien choisir un", "conteneur off-shore"],
      guide: [
        ["La norme DNV 2.7-1", "La norme **DNV 2.7-1** encadre la conception des conteneurs destinés aux opérations en mer, notamment leur levage depuis et vers les navires et les plateformes. Nos modèles off-shore sont conformes **DNV 2.7-1 / CSC**."],
        ["10 ou 20 pieds", "Le **10 pieds** (2,99 m, 15,9 m³) s’adapte aux espaces réduits et aux capacités de levage limitées ; le **20 pieds** (6,06 m, 33,2 m³) offre le double de volume pour le stockage d’équipements et de pièces de maintenance."],
        ["Charge et levage", "Charge maximale de **10 160 kg** pour le 10 pieds et **28 280 kg** pour le 20 pieds : tenez compte du poids de vos équipements et des capacités de levage disponibles sur site."],
      ],
      usagesTitle: ["Les usages d’un", "conteneur off-shore"],
      usages: [
        { title: "Plateformes & énergie offshore", icon: "i-ship", paras: [
          "Stockage d’équipements, maintenance et logistique mer : le conteneur off-shore accompagne les opérations en **environnement marin**.",
          "Formats 10 et 20 pieds pour s’adapter aux contraintes de manutention et d’emprise sur site.",
        ] },
        { title: "Industrie & défense", icon: "i-shield", paras: [
          "Sites sensibles, zones isolées ou industries lourdes : une **structure acier robuste**, pensée pour durer.",
          "Cubner vous conseille sur le modèle adapté à votre déploiement et à vos contraintes logistiques.",
        ] },
      ],
      faq: [
        ["Qu’est-ce qu’un conteneur off-shore ?", [
          "C’est un conteneur conçu pour les opérations en mer et les environnements exigeants : plateformes, navires, sites isolés. Il est construit et certifié pour être levé et manutentionné dans ces conditions.",
        ]],
        ["Que signifie la certification DNV 2.7-1 ?", [
          "DNV 2.7-1 est la norme de référence pour les conteneurs offshore : elle fixe les exigences de conception, de fabrication et d’essais, notamment pour le levage en mer. Nos conteneurs off-shore 10 et 20 pieds sont conformes DNV 2.7-1 / CSC.",
        ]],
        ["Quelles sont les dimensions d’un conteneur off-shore 20 pieds ?", [
          "À l’extérieur : 6,06 m × 2,44 m × 2,59 m. À l’intérieur : 5,90 m × 2,35 m × 2,39 m, soit 33,2 m³ et 11 palettes Europe, pour une charge maximale de 28 280 kg.",
        ]],
        ["Les conteneurs off-shore sont-ils disponibles à la location ?", [
          "Oui, ils sont livrables en premier voyage, en occasion ou à la location. Contactez-nous pour étudier votre déploiement.",
        ]],
      ],
      related: ["specifiques", "standards", "20-pieds", "stockage"],
    },
  ],
};
