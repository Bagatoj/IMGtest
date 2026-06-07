# IronMarkGear — V54 Next.js

Première migration propre vers Next.js, basée sur la V53 migration-ready.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Ce qui est migré

- Structure Next.js App Router.
- Composants centralisés : Header, Footer, Logo, ToastProvider, ProductCard, ProductDetail.
- Thèmes logo : bleu, jaune, vert.
- Données produits dans `lib/products.ts`.
- Panier compatible avec la clé `localStorage` existante : `img_cart`.
- Formulaire devis encore en `mailto:`, mais avec intégration du panier.
- Pages principales recréées dans `app/`.

## Important

Cette V54 est une base Next.js propre. Elle ne remplace pas encore le backend réel.
Les contenus visuels détaillés de certaines galeries V53 pourront être réintégrés ensuite sous forme de données propres.

## Prochaines étapes recommandées

1. Réintégrer toutes les galeries/réalisations depuis la V53 sous forme de tableaux de données.
2. Migrer le calendrier produit inline vers un composant `RentalCalendar`.
3. Ajouter variables d’environnement pour téléphone, email, TVA.
4. Créer une API backend pour demandes de devis.
5. Préparer base de données et espace admin.
