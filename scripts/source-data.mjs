// Transcription des feuilles Excel « Régions », « Villes » et « Enseignes v2 ».

export const ALL_REGIONS = [
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  "Provence-Alpes-Côte d'Azur",
];

export const REGION_DRAW = [
  'Grand Est',
  'Bourgogne-Franche-Comté',
  'Nouvelle-Aquitaine',
  'Hauts-de-France',
  'Centre-Val de Loire',
];

/** Nom à envoyer au géocodeur quand il diffère du nom affiché. */
export const CITY_GEOCODE_ALIAS = {
  'Rochefort-sur-Mer': 'Rochefort',
  'Marmande-Nérac': 'Nérac',
};

export const CITIES = {
  'Grand Est': {
    prefRegion: 'Strasbourg',
    prefs: ['Bar-le-Duc', 'Châlons-en-Champagne', 'Charleville-Mézières', 'Chaumont', 'Colmar', 'Épinal', 'Metz', 'Nancy', 'Troyes'],
    sousPrefs: ['Altkirch', 'Bar-sur-Aube', 'Commercy', 'Épernay', 'Forbach', 'Haguenau', 'Langres', 'Lunéville', 'Molsheim', 'Mulhouse', 'Neufchâteau', 'Nogent-sur-Seine', 'Reims', 'Rethel', 'Saint-Dié-des-Vosges', 'Saint-Dizier', 'Sarrebourg', 'Sarreguemines', 'Saverne', 'Sedan', 'Sélestat', 'Thann', 'Thionville', 'Toul', 'Val de Briey', 'Verdun', 'Vitry-le-François', 'Vouziers'],
    draw: ['Épernay', 'Chaumont', 'Saint-Dié-des-Vosges', 'Molsheim', 'Langres', 'Châlons-en-Champagne', 'Bar-sur-Aube', 'Sedan', 'Toul', 'Thionville', 'Haguenau', 'Val de Briey', 'Verdun', 'Vouziers', 'Strasbourg', 'Colmar', 'Troyes', 'Forbach', 'Altkirch', 'Épinal', 'Neufchâteau', 'Mulhouse', 'Saint-Dizier', 'Sarreguemines', 'Thann', 'Charleville-Mézières', 'Nogent-sur-Seine', 'Rethel', 'Sélestat', 'Lunéville', 'Metz', 'Bar-le-Duc', 'Saverne', 'Commercy', 'Vitry-le-François', 'Sarrebourg', 'Nancy', 'Reims'],
  },
  'Bourgogne-Franche-Comté': {
    prefRegion: 'Dijon',
    prefs: ['Auxerre', 'Belfort', 'Besançon', 'Lons-le-Saunier', 'Mâcon', 'Nevers', 'Vesoul'],
    sousPrefs: ['Autun', 'Avallon', 'Beaune', 'Chalon-sur-Saône', 'Charolles', 'Château-Chinon', 'Clamecy', 'Cosne-Cours-sur-Loire', 'Dole', 'Louhans', 'Lure', 'Montbard', 'Montbéliard', 'Pontarlier', 'Saint-Claude', 'Sens'],
    draw: ['Beaune', 'Besançon', 'Charolles', 'Mâcon', 'Sens', 'Château-Chinon', 'Pontarlier', 'Cosne-Cours-sur-Loire', 'Autun', 'Belfort', 'Saint-Claude', 'Montbéliard', 'Dijon', 'Dole', 'Louhans', 'Lure', 'Chalon-sur-Saône', 'Clamecy', 'Lons-le-Saunier', 'Nevers', 'Avallon', 'Auxerre', 'Vesoul', 'Montbard'],
  },
  'Nouvelle-Aquitaine': {
    prefRegion: 'Bordeaux',
    prefs: ['Agen', 'Angoulême', 'Guéret', 'La Rochelle', 'Limoges', 'Mont-de-Marsan', 'Niort', 'Pau', 'Périgueux', 'Poitiers', 'Tulle'],
    sousPrefs: ['Arcachon', 'Aubusson', 'Bayonne', 'Bellac', 'Bergerac', 'Blaye', 'Bressuire', 'Brive-la-Gaillarde', 'Châtellerault', 'Cognac', 'Confolens', 'Dax', 'Jonzac', 'Langon', 'Lesparre-Médoc', 'Libourne', 'Marmande-Nérac', 'Montmorillon', 'Nontron', 'Oloron-Sainte-Marie', 'Parthenay', 'Rochechouart', 'Rochefort-sur-Mer', 'Saintes', "Saint-Jean-d'Angély", 'Sarlat-la-Canéda', 'Ussel', 'Villeneuve-sur-Lot'],
    draw: ['Montmorillon', 'Nontron', 'La Rochelle', "Saint-Jean-d'Angély", 'Confolens', 'Oloron-Sainte-Marie', 'Langon', 'Lesparre-Médoc', 'Parthenay', 'Libourne', 'Bressuire', 'Rochefort-sur-Mer', 'Jonzac', 'Brive-la-Gaillarde', 'Dax', 'Marmande-Nérac', 'Ussel', 'Rochechouart', 'Pau', 'Limoges', 'Bellac', 'Poitiers', 'Niort', 'Périgueux', 'Cognac', 'Blaye', 'Sarlat-la-Canéda', 'Bordeaux', 'Mont-de-Marsan', 'Bayonne', 'Arcachon', 'Agen', 'Tulle', 'Guéret', 'Villeneuve-sur-Lot', 'Aubusson', 'Angoulême', 'Bergerac', 'Saintes', 'Châtellerault'],
  },
  'Hauts-de-France': {
    prefRegion: 'Lille',
    prefs: ['Amiens', 'Arras', 'Beauvais', 'Laon'],
    sousPrefs: ['Abbeville', 'Avesnes-sur-Helpe', 'Béthune', 'Boulogne-sur-Mer', 'Calais', 'Cambrai', 'Château-Thierry', 'Clermont', 'Compiègne', 'Douai', 'Dunkerque', 'Lens', 'Montdidier', 'Montreuil-sur-Mer', 'Péronne', 'Saint-Omer', 'Saint-Quentin', 'Senlis', 'Soissons', 'Valenciennes', 'Vervins'],
    draw: ['Amiens', 'Valenciennes', 'Avesnes-sur-Helpe', 'Laon', 'Clermont', 'Péronne', 'Beauvais', 'Béthune', 'Saint-Quentin', 'Compiègne', 'Montreuil-sur-Mer', 'Lille', 'Douai', 'Boulogne-sur-Mer', 'Dunkerque', 'Calais', 'Montdidier', 'Cambrai', 'Abbeville', 'Vervins', 'Saint-Omer', 'Soissons', 'Arras', 'Lens', 'Senlis', 'Château-Thierry'],
  },
  'Centre-Val de Loire': {
    prefRegion: 'Orléans',
    prefs: ['Blois', 'Bourges', 'Chartres', 'Châteauroux', 'Tours'],
    sousPrefs: ['Châteaudun', 'Chinon', 'Dreux', 'Issoudun', 'La Châtre', 'Le Blanc', 'Loches', 'Montargis', 'Nogent-le-Rotrou', 'Pithiviers', 'Romorantin-Lanthenay', 'Saint-Amand-Montrond', 'Vendôme', 'Vierzon'],
    draw: ['Le Blanc', 'Vendôme', 'Saint-Amand-Montrond', 'Issoudun', 'Dreux', 'La Châtre', 'Tours', 'Loches', 'Bourges', 'Blois', 'Orléans', 'Chartres', 'Châteauroux', 'Nogent-le-Rotrou', 'Vierzon', 'Montargis', 'Chinon', 'Romorantin-Lanthenay', 'Châteaudun', 'Pithiviers'],
  },
};

/** Nombre de villes retenues par le tirage principal dans chaque région. */
export const CITIES_PER_REGION = 5;

/**
 * Magasins éligibles par région et par enseigne : [ville, adresse, type].
 * `drawn` = adresse sortie au tirage, `retained` = adresse finalement retenue.
 */
export const STORES = {
  'Grand Est': {
    Auchan: {
      candidates: [
        ['Strasbourg', '121 Rte des Romains', 'Auchan Supermarché'],
        ['Strasbourg', '9 Pl. Saint-Antoine', 'Auchan Supermarché'],
        ['Strasbourg', 'Pl. André Maurois', 'Auchan Drive'],
      ],
      drawn: '9 Pl. Saint-Antoine',
      retained: '9 Pl. Saint-Antoine',
    },
    Carrefour: {
      candidates: [
        ['Épernay', '13 Quai de Marne', 'Carrefour'],
        ['Saint-Dié-des-Vosges', '183 Rue Ernest Charlier', 'Carrefour'],
        ['Molsheim', '1 Rue Mercure', 'Carrefour'],
      ],
      drawn: '183 Rue Ernest Charlier',
      retained: '13 Quai de Marne',
    },
    'Coopérative U': {
      candidates: [['Molsheim', '33 A Rte de Dachstein', 'Super U']],
      drawn: '33 A Rte de Dachstein',
      retained: '33 A Rte de Dachstein',
    },
    'E.Leclerc': {
      candidates: [
        ['Épernay', '48 Rue Saint-Thibault', 'E.Leclerc Retrait piéton'],
        ['Chaumont', '13 Rue du Moulin Neuf', 'E.Leclerc Drive'],
        ['Saint-Dié-des-Vosges', '5 Rue Marcel Mauss', 'E.Leclerc Drive'],
      ],
      drawn: '5 Rue Marcel Mauss',
      retained: '48 Rue Saint-Thibault',
    },
    Intermarché: {
      candidates: [
        ['Saint-Dié-des-Vosges', "116 Rue d'Alsace", 'Intermarché Super'],
        ['Langres', 'Les Franchises', 'Intermarché Super'],
      ],
      drawn: 'Les Franchises',
      retained: 'Les Franchises',
    },
  },
  'Bourgogne-Franche-Comté': {
    Auchan: {
      candidates: [['Mâcon', 'D906', 'Auchan Drive']],
      drawn: 'D906',
      retained: 'D906',
    },
    Carrefour: {
      candidates: [
        ['Beaune', '9 Av. du Général de Gaulle', 'Carrefour'],
        ['Sens', '8 Rte de Voulx', 'Carrefour'],
        ['Sens', 'Rte de Maillot', 'Carrefour'],
      ],
      drawn: '8 Rte de Voulx',
      retained: '9 Av. du Général de Gaulle',
    },
    'Coopérative U': {
      candidates: [
        ['Besançon', "20 Rue de L'Amitié", 'Super U'],
        ['Sens', 'Rue Champbertrand', 'Hyper U'],
      ],
      drawn: 'Rue Champbertrand',
      retained: "20 Rue de L'Amitié",
    },
    'E.Leclerc': {
      candidates: [
        ['Beaune', '13 Rue Gustave Eiffel', 'E.Leclerc Drive'],
        ['Besançon', '2 Rue Albert Thomas', 'E.Leclerc Drive'],
        ['Mâcon', '26-28 Rue de la République', 'E.Leclerc Drive'],
        ['Sens', '106 Rue de la République', 'E.Leclerc Retrait piéton'],
      ],
      drawn: '13 Rue Gustave Eiffel',
      retained: '13 Rue Gustave Eiffel',
    },
    Intermarché: {
      candidates: [
        ['Beaune', '37 Rte de Seurre', 'Intermarché Super'],
        ['Besançon', '52 Rue de Belfort', 'Intermarché Super'],
        ['Besançon', '3 Pl. Pierre de Coubertin', 'Intermarché Super'],
        ['Besançon', '110 Rue de Dole', 'Intermarché Super'],
        ['Besançon', '73 Bd Léon Blum', 'Intermarché Super'],
        ['Besançon', '8 Pl. René Cassin', 'Intermarché Super'],
        ['Besançon', 'Rue Louis Aragon', 'Intermarché Hyper'],
        ['Charolles', '4 bis Av. du 8 Juin 1944', 'Intermarché Super'],
        ['Mâcon', 'Rue Frédéric Mistral', 'Intermarché Super'],
      ],
      drawn: '73 Bd Léon Blum',
      retained: '37 Rte de Seurre',
    },
  },
  'Nouvelle-Aquitaine': {
    Auchan: {
      candidates: [
        ['Bordeaux', '2 Sente Allée de Counord', 'Auchan Click&Collect Supermarché'],
        ['Bordeaux', '5 Rue du Professeur Darget', 'Auchan Drive'],
      ],
      drawn: '5 Rue du Professeur Darget',
      retained: '5 Rue du Professeur Darget',
    },
    Carrefour: {
      candidates: [['La Rochelle', '99 Bd de Cognehors', 'Carrefour Market']],
      drawn: '99 Bd de Cognehors',
      retained: '99 Bd de Cognehors',
    },
    'Coopérative U': {
      candidates: [
        ['Montmorillon', '106 Av. Victor Hugo', 'Super U'],
        ['Nontron', 'Av. Jules Ferry', 'Super U'],
      ],
      drawn: 'Av. Jules Ferry',
      retained: '106 Av. Victor Hugo',
    },
    'E.Leclerc': {
      candidates: [
        ['Montmorillon', '2 Av. de Provence', 'E.Leclerc Drive'],
        ["Saint-Jean-d'Angély", 'Rue de la Sacristinerie', 'E.Leclerc Drive'],
      ],
      drawn: '2 Av. de Provence',
      retained: '2 Av. de Provence',
    },
    Intermarché: {
      candidates: [
        ['Nontron', '2 Rte de la Maladrerie', 'Intermarché Super'],
        ['La Rochelle', 'Rue du Château', 'Intermarché Super'],
        ['La Rochelle', 'Av. du 14 Juillet', 'Intermarché Super'],
        ['La Rochelle', '21 Rue Eugène Dor', 'Intermarché Super'],
        ["Saint-Jean-d'Angély", 'Rue Alexandre Dumas', 'Intermarché Hyper'],
        ['Confolens', 'Avenue du 8 Mai 1945', 'Intermarché Super'],
      ],
      drawn: 'Rue du Château',
      retained: '21 Rue Eugène Dor',
    },
  },
  'Hauts-de-France': {
    Auchan: {
      candidates: [
        ['Valenciennes', 'Av. du Général Horne', 'Auchan Drive'],
        ['Valenciennes', '59 Av. de Verdun', 'Auchan Supermarché'],
      ],
      drawn: 'Av. du Général Horne',
      retained: '59 Av. de Verdun',
    },
    Carrefour: {
      candidates: [
        ['Amiens', '22 bis Rue du Général Leclerc', 'Carrefour Market'],
        ['Amiens', 'ZAC Vallée', 'Carrefour'],
        ['Valenciennes', '12 Rue de La Halle', 'Carrefour Market'],
        ['Avesnes-sur-Helpe', 'Rte de Landrecies', 'Carrefour Market'],
        ['Laon', '16 Rue Fernand Christ', 'Carrefour Market'],
        ['Laon', '42 Rue Romanette', 'Carrefour'],
      ],
      drawn: '16 Rue Fernand Christ',
      retained: '22 bis Rue du Général Leclerc',
    },
    'Coopérative U': {
      candidates: [['Amiens', '4 Rue Edouard Lucas', 'Super U']],
      drawn: '4 Rue Edouard Lucas',
      retained: '4 Rue Edouard Lucas',
    },
    'E.Leclerc': {
      candidates: [
        ['Amiens', '12 Rue Gresset', 'E.Leclerc Retrait piéton'],
        ['Valenciennes', 'Rue Ernest Macarez', 'E.Leclerc Drive'],
        ['Laon', '20 Rue Fernand Christ', 'E.Leclerc Drive'],
        ['Laon', '12 Rue du Bourg', 'E.Leclerc Retrait piéton'],
      ],
      drawn: 'Rue Ernest Macarez',
      retained: '12 Rue Gresset',
    },
    Intermarché: {
      candidates: [
        ['Amiens', '115 Rue Alexandre Dumas', 'Intermarché Super'],
        ['Amiens', "406 Rte d'Abbeville", 'Intermarché Super'],
        ['Laon', '167 Av. Pierre Mendès-France', 'Intermarché Super'],
        ['Clermont', 'Rue Gérard de Nerval', 'Intermarché Hyper'],
      ],
      drawn: '115 Rue Alexandre Dumas',
      retained: 'Rue Gérard de Nerval',
    },
  },
  'Centre-Val de Loire': {
    Auchan: {
      candidates: [
        ['Tours', 'Rue Frédéric Chopin', 'Auchan Supermarché'],
        ['Tours', '272 Av. André Maginot', 'Auchan Drive'],
        ['Tours', '19 Pl. Jean Jaurès', 'Auchan Click&Collect Supermarché'],
      ],
      drawn: '272 Av. André Maginot',
      retained: '19 Pl. Jean Jaurès',
    },
    Carrefour: {
      candidates: [
        ['Vendôme', 'N10', 'Carrefour Market'],
        ['Saint-Amand-Montrond', '93 Av. du Général de Gaulle', 'Carrefour Market'],
        ['Issoudun', '59 Rue Haute Saint-Paterne', 'Carrefour Market'],
        ['Dreux', 'Rue des Bas Buissons', 'Carrefour'],
      ],
      drawn: '93 Av. du Général de Gaulle',
      retained: '59 Rue Haute Saint-Paterne',
    },
    'Coopérative U': {
      candidates: [['La Châtre', "Avenue d'Auvergne", 'Super U']],
      drawn: "Avenue d'Auvergne",
      retained: "Avenue d'Auvergne",
    },
    'E.Leclerc': {
      candidates: [
        ['Le Blanc', '131 Av. Gambetta', 'E.Leclerc Drive'],
        ['Vendôme', "15 Bd de l'Industrie", 'E.Leclerc Drive'],
        ['Vendôme', '1 Rue Marc Seguin', 'E.Leclerc Drive'],
        ['Saint-Amand-Montrond', 'Rte de Charenton', 'E.Leclerc Drive'],
        ['Issoudun', 'Allée des Ajoncs Bleus', 'E.Leclerc Drive'],
        ['Dreux', "Bd de l'Europe", 'E.Leclerc Drive'],
        ['Dreux', '103 Av. du Général Leclerc', 'E.Leclerc Drive'],
      ],
      drawn: '103 Av. du Général Leclerc',
      retained: "Bd de l'Europe",
    },
    Intermarché: {
      candidates: [
        ['Vendôme', 'Rte de Blois', 'Intermarché Super'],
        ['Saint-Amand-Montrond', 'Av. du Général de Gaulle', 'Intermarché Hyper'],
        ['Issoudun', 'Rte de Bourges', 'Intermarché Hyper'],
      ],
      drawn: 'Rte de Bourges',
      retained: 'Av. du Général de Gaulle',
    },
  },
};
