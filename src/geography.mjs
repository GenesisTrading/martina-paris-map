export const checkedDate = "2026-07-24";

export const origin = {
  id: "gare_du_nord",
  name: "Gare du Nord",
  label: "Gare du Nord",
  coordinates: [2.3562878, 48.8819585],
  source: {
    provider: "Nominatim / OpenStreetMap",
    query: "Gare du Nord, Paris, France",
    osmType: "way",
    osmId: 736530618,
    displayName:
      "Paris Gare du Nord, Boulevard de la Chapelle, Quartier Saint-Vincent-de-Paul, 10th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75010, France"
  }
};

export const namedPlaces = [
  origin,
  {
    id: "gare_de_lest",
    name: "Gare de l'Est",
    label: "Gare de l'Est",
    coordinates: [2.3594905, 48.8770979],
    source: {
      provider: "Nominatim / OpenStreetMap",
      query: "Gare de l'Est, Paris, France",
      osmType: "node",
      osmId: 2506241285,
      displayName:
        "Paris-East Station, Place du 11 Novembre 1918, Quartier Saint-Vincent-de-Paul, 10th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75010, France"
    }
  },
  {
    id: "avenue_trudaine",
    name: "Avenue Trudaine",
    label: "Trudaine",
    coordinates: [2.3423161, 48.8811577],
    source: {
      provider: "Nominatim / OpenStreetMap",
      query: "Avenue Trudaine, Paris, France",
      osmType: "way",
      osmId: 107612538,
      displayName:
        "Avenue Trudaine, Quartier de Rochechouart, 9th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75009, France"
    }
  },
  {
    id: "rue_des_martyrs",
    name: "Rue des Martyrs",
    label: "Rue des Martyrs",
    coordinates: [2.3400276, 48.8811569],
    source: {
      provider: "Nominatim / OpenStreetMap",
      query: "Rue des Martyrs, Paris, France",
      osmType: "way",
      osmId: 36893345,
      displayName:
        "Rue des Martyrs, Quartier Saint-Georges, 9th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75009, France"
    },
    note:
      "The named street was geocoded as a full street. The map label for the approved lower section is manually placed inside the lower rue des Martyrs polygon."
  },
  {
    id: "rue_cadet",
    name: "Rue Cadet",
    label: "Rue Cadet",
    coordinates: [2.3440609, 48.8762375],
    source: {
      provider: "Nominatim / OpenStreetMap",
      query: "Rue Cadet, Paris, France",
      osmType: "way",
      osmId: 120519181,
      displayName:
        "Rue Cadet, Quartier du Faubourg-Montmartre, 9th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75009, France"
    }
  },
  {
    id: "porte_saint_martin",
    name: "Porte Saint-Martin",
    label: "Porte Saint-Martin",
    coordinates: [2.3556515, 48.8691459],
    source: {
      provider: "Nominatim / OpenStreetMap",
      query: "Porte Saint-Martin, Paris, France",
      osmType: "relation",
      osmId: 3178897,
      displayName:
        "Porte Saint-Martin, Boulevard Saint-Martin, Quartier de la Porte-Saint-Martin, 10th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75010, France"
    }
  },
  {
    id: "canal_saint_martin",
    name: "Canal Saint-Martin",
    label: "Canal Saint-Martin",
    coordinates: [2.3671691, 48.8689561],
    source: {
      provider: "Nominatim / OpenStreetMap",
      query: "Canal Saint-Martin, Paris, France",
      osmType: "relation",
      osmId: 1164565,
      displayName:
        "Canal Saint-Martin, Paris, Ile-de-France, Metropolitan France, France"
    },
    note:
      "The named canal was geocoded as a full linear feature. The map label is manually placed inside the approved central canal-side polygon."
  },
  {
    id: "place_jacques_bonsergent",
    name: "Place Jacques Bonsergent",
    label: "Jacques Bonsergent",
    coordinates: [2.3610301, 48.8710142],
    source: {
      provider: "Nominatim / OpenStreetMap",
      query: "Place Jacques Bonsergent, Paris, France",
      osmType: "relation",
      osmId: 14358328,
      displayName:
        "Place Jacques Bonsergent, Quartier de la Porte-Saint-Martin, 10th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75010, France"
    }
  },
  {
    id: "place_de_la_republique",
    name: "Place de la République",
    label: "République",
    coordinates: [2.3639583, 48.8675421],
    source: {
      provider: "Nominatim / OpenStreetMap",
      query: "Place de la République, Paris, France",
      osmType: "way",
      osmId: 450130138,
      displayName:
        "Place de la République, Quartier de la Folie-Méricourt, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France"
    }
  }
];

export const categoryStyles = {
  red: {
    label: "Not recommended",
    color: "#c3312f",
    fillColor: "#e24d42"
  },
  green: {
    label: "Recommended",
    color: "#18794e",
    fillColor: "#2fb36d"
  },
  blue: {
    label: "Acceptable compromise — check the exact street",
    color: "#1f5faa",
    fillColor: "#3d86d9"
  }
};

export const recommendationZones = [
  {
    id: "red_gare_du_nord_frontage",
    name: "Gare du Nord frontage",
    category: "red",
    boundaryDescription:
      "Compact station-frontage polygon using Rue de Maubeuge, Rue Ambroise-Paré, Rue de Compiègne, Rue du Faubourg Saint-Denis, Rue de Dunkerque, Rue de Saint-Quentin and Rue La Fayette.",
    boundaryStreets: [
      "Rue de Maubeuge",
      "Rue Ambroise-Paré",
      "Rue de Compiègne",
      "Rue du Faubourg Saint-Denis",
      "Rue de Dunkerque",
      "Rue de Saint-Quentin",
      "Rue La Fayette"
    ],
    labelPoint: [2.35535, 48.88035],
    label: "Gare du Nord frontage",
    vertices: [
      {
        coordinates: [2.3523043, 48.8804947],
        note: "Rue de Dunkerque x Rue de Maubeuge",
        osmNode: 361103
      },
      {
        coordinates: [2.3540711, 48.8817523],
        note: "Rue de Maubeuge x Rue Ambroise-Paré",
        osmNode: 429581498
      },
      {
        coordinates: [2.35719, 48.88202],
        note: "Manual station-front vertex near the north-east Gare du Nord approach"
      },
      {
        coordinates: [2.3571878, 48.879524],
        note: "Rue de Dunkerque x Rue du Faubourg Saint-Denis",
        osmNode: 577328474
      },
      {
        coordinates: [2.3570708, 48.8792848],
        note: "Rue du Faubourg Saint-Denis x Rue La Fayette",
        osmNode: 367937
      },
      {
        coordinates: [2.3557547, 48.8789429],
        note: "Rue La Fayette x Rue de Saint-Quentin",
        osmNode: 94181306
      },
      {
        coordinates: [2.3539474, 48.8784786],
        note: "Boulevard de Magenta x Rue La Fayette",
        osmNode: 674091974
      }
    ]
  },
  {
    id: "red_interstation_corridor",
    name: "Inter-station streets",
    category: "red",
    boundaryDescription:
      "Selected corridor between Gare du Nord and Gare de l'Est, bounded by Rue La Fayette / Rue de Dunkerque to the north and Rue du 8-Mai-1945 / Boulevard de Strasbourg to the south.",
    boundaryStreets: [
      "Boulevard de Magenta",
      "Rue du Faubourg Saint-Denis",
      "Rue La Fayette",
      "Rue du Faubourg Saint-Martin",
      "Rue du 8-Mai-1945",
      "Boulevard de Strasbourg"
    ],
    labelPoint: [2.35785, 48.8777],
    label: "Inter-station streets",
    vertices: [
      {
        coordinates: [2.3570708, 48.8792848],
        note: "Rue du Faubourg Saint-Denis x Rue La Fayette",
        osmNode: 367937
      },
      {
        coordinates: [2.35935, 48.87915],
        note: "Manual north-east corridor vertex near Rue La Fayette / Rue du Faubourg Saint-Martin"
      },
      {
        coordinates: [2.3601587, 48.8759218],
        note: "Rue du 8-Mai-1945 x Rue du Faubourg Saint-Martin",
        osmNode: 6368984239
      },
      {
        coordinates: [2.3578416, 48.8761806],
        note: "Rue du 8-Mai-1945 x Boulevard de Strasbourg",
        osmNode: 583023060
      },
      {
        coordinates: [2.3565333, 48.8757979],
        note: "Rue du Faubourg Saint-Denis x Boulevard de Magenta",
        osmNode: 94156557
      },
      {
        coordinates: [2.3539474, 48.8784786],
        note: "Boulevard de Magenta x Rue La Fayette",
        osmNode: 674091974
      }
    ]
  },
  {
    id: "red_gare_de_lest_frontage",
    name: "Gare de l'Est frontage",
    category: "red",
    boundaryDescription:
      "Compact Gare de l'Est frontage around Rue d'Alsace, Rue du 8-Mai-1945, Boulevard de Strasbourg, Place du 11-Novembre-1918 and Rue du Faubourg Saint-Martin.",
    boundaryStreets: [
      "Rue d'Alsace",
      "Rue du 8-Mai-1945",
      "Boulevard de Strasbourg",
      "Place du 11-Novembre-1918",
      "Rue du Faubourg Saint-Martin"
    ],
    labelPoint: [2.35945, 48.87695],
    label: "Gare de l'Est frontage",
    vertices: [
      {
        coordinates: [2.3578416, 48.8761806],
        note: "Rue du 8-Mai-1945 x Boulevard de Strasbourg",
        osmNode: 583023060
      },
      {
        coordinates: [2.3601587, 48.8759218],
        note: "Rue du 8-Mai-1945 x Rue du Faubourg Saint-Martin",
        osmNode: 6368984239
      },
      {
        coordinates: [2.36105, 48.87672],
        note: "Manual east frontage vertex on the Rue d'Alsace side"
      },
      {
        coordinates: [2.36065, 48.87795],
        note: "Manual north-east Gare de l'Est frontage vertex"
      },
      {
        coordinates: [2.35835, 48.8782],
        note: "Manual north-west Gare de l'Est frontage vertex"
      }
    ]
  },
  {
    id: "green_avenue_trudaine",
    name: "Avenue Trudaine",
    category: "green",
    boundaryDescription:
      "Avenue Trudaine immediate surroundings from Rue des Martyrs to Rue Marguerite-de-Rochechouart / Place d'Anvers, bounded by Boulevard Marguerite-de-Rochechouart to the north and Avenue Trudaine frontage to the south.",
    boundaryStreets: [
      "Avenue Trudaine",
      "Boulevard Marguerite-de-Rochechouart",
      "Rue des Martyrs",
      "Rue Marguerite-de-Rochechouart",
      "Place d'Anvers",
      "Rue Bochart-de-Saron"
    ],
    labelPoint: [2.3426, 48.88175],
    label: "Avenue Trudaine",
    vertices: [
      {
        coordinates: [2.339665, 48.8819055],
        note: "Boulevard Marguerite-de-Rochechouart x Rue des Martyrs",
        osmNode: 583011680
      },
      {
        coordinates: [2.3445259, 48.8827966],
        note: "Boulevard Marguerite-de-Rochechouart x Place d'Anvers",
        osmNode: 94210394
      },
      {
        coordinates: [2.3466024, 48.8819948],
        note: "Avenue Trudaine x Rue Marguerite-de-Rochechouart",
        osmNode: 19715146
      },
      {
        coordinates: [2.3425309, 48.8811236],
        note: "Avenue Trudaine x Rue Bochart-de-Saron",
        osmNode: 299271453
      },
      {
        coordinates: [2.3402436, 48.8807224],
        note: "Avenue Trudaine x Rue des Martyrs",
        osmNode: 94178357
      }
    ]
  },
  {
    id: "green_lower_rue_des_martyrs",
    name: "Lower rue des Martyrs",
    category: "green",
    boundaryDescription:
      "Lower rue des Martyrs from Rue Notre-Dame-de-Lorette / Rue Saint-Lazare to Rue Clauzel / Rue de Navarin, with immediate side-street frontage only.",
    boundaryStreets: [
      "Rue des Martyrs",
      "Rue Notre-Dame-de-Lorette",
      "Rue Saint-Lazare",
      "Rue Clauzel",
      "Rue de Navarin",
      "Rue Henry-Monnier",
      "Rue Choron",
      "Rue Manuel"
    ],
    labelPoint: [2.33935, 48.87785],
    label: "Lower rue des Martyrs",
    vertices: [
      {
        coordinates: [2.3392274, 48.8767703],
        note: "Rue des Martyrs x Rue Notre-Dame-de-Lorette / Rue Saint-Lazare",
        osmNode: 8296960601
      },
      {
        coordinates: [2.3401, 48.87686],
        note: "Manual east-side lower rue des Martyrs frontage vertex"
      },
      {
        coordinates: [2.34065, 48.87875],
        note: "Manual east-side vertex near Rue Manuel / Rue Clauzel"
      },
      {
        coordinates: [2.3398288, 48.878916],
        note: "Rue des Martyrs x Rue Clauzel",
        osmNode: 94220177
      },
      {
        coordinates: [2.33765, 48.87918],
        note: "Manual west-side vertex near Rue Henry-Monnier / Rue Clauzel"
      },
      {
        coordinates: [2.33795, 48.87725],
        note: "Manual west-side lower rue des Martyrs frontage vertex"
      }
    ]
  },
  {
    id: "green_rue_cadet",
    name: "Rue Cadet",
    category: "green",
    boundaryDescription:
      "Rue Cadet and pleasant immediate surroundings bounded by Rue La Fayette, Rue Richer, Rue du Faubourg-Montmartre, Rue Bleue and Rue de Trévise.",
    boundaryStreets: [
      "Rue Cadet",
      "Rue La Fayette",
      "Rue Richer",
      "Rue du Faubourg-Montmartre",
      "Rue Bleue",
      "Rue de Trévise",
      "Rue Saulnier"
    ],
    labelPoint: [2.34335, 48.8749],
    label: "Rue Cadet",
    vertices: [
      {
        coordinates: [2.3410134, 48.8750946],
        note: "Rue La Fayette x Rue du Faubourg-Montmartre",
        osmNode: 94172435
      },
      {
        coordinates: [2.3436186, 48.8757784],
        note: "Rue Cadet x Rue La Fayette",
        osmNode: 13361133305
      },
      {
        coordinates: [2.3446491, 48.8760412],
        note: "Rue Bleue x Rue La Fayette",
        osmNode: 13932131988
      },
      {
        coordinates: [2.3453266, 48.8740337],
        note: "Rue de Trévise x Rue Richer",
        osmNode: 94159488
      },
      {
        coordinates: [2.3423548, 48.8740484],
        note: "Rue Cadet x Rue Richer",
        osmNode: 94171698
      }
    ]
  },
  {
    id: "green_saint_georges_lorette_edge",
    name: "Saint-Georges / Lorette edge",
    category: "green",
    boundaryDescription:
      "Selected Saint-Georges / Notre-Dame-de-Lorette edge bounded by Rue Saint-Georges, Rue de Châteaudun, Rue Notre-Dame-de-Lorette and the lower Rue des Martyrs / Rue Henry-Monnier side.",
    boundaryStreets: [
      "Rue Saint-Georges",
      "Rue Notre-Dame-de-Lorette",
      "Rue de Châteaudun",
      "Rue des Martyrs",
      "Rue Henry-Monnier",
      "Rue de Navarin"
    ],
    labelPoint: [2.33745, 48.8768],
    label: "Saint-Georges",
    vertices: [
      {
        coordinates: [2.3371321, 48.8760607],
        note: "Rue de Châteaudun x Rue Saint-Georges",
        osmNode: 25207350
      },
      {
        coordinates: [2.3392274, 48.8767703],
        note: "Rue des Martyrs x Rue Notre-Dame-de-Lorette / Rue Saint-Lazare",
        osmNode: 8296960601
      },
      {
        coordinates: [2.33765, 48.87918],
        note: "Manual north-east boundary near Rue Henry-Monnier / Rue Clauzel"
      },
      {
        coordinates: [2.3368475, 48.8790016],
        note: "Rue Notre-Dame-de-Lorette x Rue Henry Monnier",
        osmNode: 94174914
      },
      {
        coordinates: [2.3375301, 48.878325],
        note: "Manual Rue Saint-Georges northern frontage vertex"
      },
      {
        coordinates: [2.337098, 48.8767169],
        note: "Manual Rue Saint-Georges mid-block boundary vertex"
      }
    ]
  },
  {
    id: "green_chabrol_hauteville_edge",
    name: "Chabrol / Hauteville edge",
    category: "green",
    boundaryDescription:
      "Tight Chabrol / Hauteville slice south of Square Montholon, bounded by Rue de Paradis, Rue du Faubourg Poissonnière, Rue d'Hauteville and a selected north edge kept outside the 10-minute red contour.",
    boundaryStreets: [
      "Rue de Paradis",
      "Rue du Faubourg Poissonnière",
      "Rue d'Hauteville",
      "Rue de Chabrol",
      "Rue La Fayette"
    ],
    labelPoint: [2.34955, 48.87625],
    label: "Chabrol-Hauteville",
    vertices: [
      {
        coordinates: [2.3482432, 48.8757887],
        note: "Rue de Paradis x Rue du Faubourg Poissonnière",
        osmNode: 5077513433
      },
      {
        coordinates: [2.3509072, 48.8753256],
        note: "Rue de Paradis x Rue d'Hauteville",
        osmNode: 94157219
      },
      {
        coordinates: [2.3511, 48.87635],
        note: "Manual north-east boundary below Rue de Chabrol / Square Montholon"
      },
      {
        coordinates: [2.34878, 48.87678],
        note: "Manual north-west boundary below Rue La Fayette / Square Montholon"
      }
    ]
  },
  {
    id: "blue_porte_saint_martin",
    name: "Porte Saint-Martin",
    category: "blue",
    boundaryDescription:
      "Porte Saint-Martin compromise polygon around Boulevard Saint-Denis / Boulevard Saint-Martin, Rue du Faubourg Saint-Denis, Rue du Faubourg Saint-Martin and Rue René-Boulanger / Rue Meslay.",
    boundaryStreets: [
      "Boulevard Saint-Denis",
      "Boulevard Saint-Martin",
      "Rue du Faubourg Saint-Denis",
      "Rue du Faubourg Saint-Martin",
      "Rue René-Boulanger",
      "Rue Meslay"
    ],
    labelPoint: [2.35565, 48.86915],
    label: "Porte St-Martin",
    vertices: [
      {
        coordinates: [2.35295, 48.86974],
        note: "Manual west boundary vertex near Boulevard Saint-Denis / Rue du Faubourg Saint-Denis"
      },
      {
        coordinates: [2.35635, 48.87023],
        note: "Manual Boulevard Saint-Martin north edge vertex"
      },
      {
        coordinates: [2.35875, 48.87015],
        note: "Manual east boundary vertex near Boulevard Saint-Martin / Rue du Faubourg Saint-Martin"
      },
      {
        coordinates: [2.3587875, 48.8689332],
        note: "Rue René-Boulanger x Rue Taylor",
        osmNode: 289568129
      },
      {
        coordinates: [2.35405, 48.86815],
        note: "Manual south-west vertex on the Rue René-Boulanger / Rue Meslay side"
      }
    ]
  },
  {
    id: "blue_faubourg_poissonniere_enghien",
    name: "Faubourg Poissonnière / Enghien",
    category: "blue",
    boundaryDescription:
      "Faubourg Poissonnière compromise block bounded by Rue des Petites-Écuries, Rue d'Enghien, Rue d'Hauteville and Rue du Faubourg Poissonnière.",
    boundaryStreets: [
      "Rue du Faubourg Poissonnière",
      "Rue des Petites-Écuries",
      "Rue d'Enghien",
      "Rue d'Hauteville"
    ],
    labelPoint: [2.34915, 48.87325],
    label: "Fbg Poissonnière",
    vertices: [
      {
        coordinates: [2.3479115, 48.8740226],
        note: "Rue des Petites-Écuries x Rue du Faubourg Poissonnière",
        osmNode: 94158188
      },
      {
        coordinates: [2.3505169, 48.8738168],
        note: "Rue des Petites-Écuries x Rue d'Hauteville",
        osmNode: 94161169
      },
      {
        coordinates: [2.350047, 48.8721309],
        note: "Rue d'Enghien x Rue d'Hauteville",
        osmNode: 94164241
      },
      {
        coordinates: [2.3479039, 48.8724568],
        note: "Rue d'Enghien x Rue du Faubourg Poissonnière",
        osmNode: 94158189
      }
    ]
  },
  {
    id: "blue_canal_saint_martin_central",
    name: "Canal Saint-Martin central",
    category: "blue",
    boundaryDescription:
      "Pleasant western and central canal-side section bounded by Quai de Valmy and Quai de Jemmapes between Rue des Récollets / Rue Lucien-Sampaix and Rue de Lancry / Rue Bichat.",
    boundaryStreets: [
      "Quai de Valmy",
      "Quai de Jemmapes",
      "Rue des Récollets",
      "Rue Lucien-Sampaix",
      "Rue de Lancry",
      "Rue Bichat"
    ],
    labelPoint: [2.36355, 48.8736],
    label: "Canal St-Martin",
    vertices: [
      {
        coordinates: [2.3628097, 48.8744529],
        note: "Rue Lucien-Sampaix x Quai de Valmy",
        osmNode: 5851342227
      },
      {
        coordinates: [2.3635398, 48.8740589],
        note: "Quai de Jemmapes x Rue Bichat",
        osmNode: 367947
      },
      {
        coordinates: [2.36435, 48.87278],
        note: "Manual east-bank vertex near Rue de Lancry / Quai de Jemmapes"
      },
      {
        coordinates: [2.3637458, 48.8729141],
        note: "Quai de Valmy x Rue de Lancry",
        osmNode: 94142445
      }
    ]
  },
  {
    id: "blue_northern_temple_vertbois",
    name: "Northern Temple / Vertbois",
    category: "blue",
    boundaryDescription:
      "Northern Temple compromise edge south of Porte Saint-Martin, bounded by Rue René Boulanger / Rue Meslay, Rue du Temple, Rue de Turbigo, Rue du Vertbois and Rue Volta.",
    boundaryStreets: [
      "Rue René Boulanger",
      "Rue Meslay",
      "Rue du Temple",
      "Rue de Turbigo",
      "Rue du Vertbois",
      "Rue Volta"
    ],
    labelPoint: [2.3604, 48.86735],
    label: "Temple Nord",
    vertices: [
      {
        coordinates: [2.3587875, 48.8689332],
        note: "Rue René-Boulanger x Rue Taylor",
        osmNode: 289568129
      },
      {
        coordinates: [2.3628564, 48.8683533],
        note: "Manual east boundary on the Rue René Boulanger / Rue Meslay side"
      },
      {
        coordinates: [2.3628642, 48.8671948],
        note: "Rue Meslay x Rue du Temple",
        osmNode: 175033386
      },
      {
        coordinates: [2.360296, 48.8664388],
        note: "Rue du Vertbois x Rue de Turbigo",
        osmNode: 13452859254
      },
      {
        coordinates: [2.3582667, 48.8669626],
        note: "Rue Volta x Rue du Vertbois",
        osmNode: 175038101
      },
      {
        coordinates: [2.3585214, 48.8674092],
        note: "Manual north-west Rue Volta / Rue Meslay edge vertex"
      }
    ]
  },
  {
    id: "blue_jacques_bonsergent_republique_edge",
    name: "Jacques Bonsergent / République edge",
    category: "blue",
    boundaryDescription:
      "Selected realistically accessible parts toward République, bounded by Boulevard de Magenta, Rue de Lancry, Quai de Valmy / Rue Beaurepaire and Rue Yves-Toudic / Rue de Marseille.",
    boundaryStreets: [
      "Boulevard de Magenta",
      "Rue de Lancry",
      "Quai de Valmy",
      "Rue Beaurepaire",
      "Rue Yves-Toudic",
      "Rue de Marseille"
    ],
    labelPoint: [2.3618, 48.871],
    label: "République edge",
    vertices: [
      {
        coordinates: [2.3612095, 48.8705348],
        note: "Rue de Lancry x Boulevard de Magenta",
        osmNode: 243635109
      },
      {
        coordinates: [2.3637458, 48.8729141],
        note: "Quai de Valmy x Rue de Lancry",
        osmNode: 94142445
      },
      {
        coordinates: [2.36425, 48.8716],
        note: "Manual east boundary vertex on the Quai de Valmy / Rue Beaurepaire side"
      },
      {
        coordinates: [2.3637672, 48.8699297],
        note: "Rue Beaurepaire x Rue Yves-Toudic",
        osmNode: 94141550
      },
      {
        coordinates: [2.3626499, 48.8712258],
        note: "Rue Yves-Toudic x Rue de Marseille",
        osmNode: 94141551
      }
    ]
  }
];

export const mapView = {
  center: [48.8755, 2.3545],
  zoom: 15,
  bounds: [
    [48.8666, 2.335],
    [48.8847, 2.3678]
  ]
};

export const serviceSources = {
  nominatim:
    "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=...",
  overpass: "https://overpass.openstreetmap.fr/api/interpreter",
  osrm: "https://routing.openstreetmap.de/routed-foot",
  openRouteService: "https://api.openrouteservice.org/v2/isochrones/foot-walking",
  osmCopyright: "https://www.openstreetmap.org/copyright"
};
