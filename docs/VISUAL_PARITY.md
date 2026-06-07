# V55 — Parité visuelle stricte

Cette version Next.js charge le rendu HTML validé en V53 dans des routes Next.js afin de conserver le rendu visuel exact pendant la migration.

Objectif : ne plus perdre le design validé pendant la conversion.

Étapes suivantes recommandées :
1. valider visuellement chaque page ;
2. convertir ensuite page par page en composants React natifs ;
3. garder le HTML V53 comme référence de comparaison pixel à pixel ;
4. ne supprimer le mode parité qu'une fois chaque page React validée.
