# Statut migration V54

## Décisions conservées

- Logo HTML/CSS, pas image importée.
- `.logo-icon` 46x46px, coins 10px, texte IMG blanc/gras/centré.
- Bleu pour pages communes.
- Jaune pour location, produits, panier.
- Vert pour espaces verts.
- Panier `localStorage` clé `img_cart`.
- Notifications intégrées via ToastProvider.

## Limites volontaires de cette version

- Pas de backend réel.
- Pas de gestion de stock réelle.
- Pas d’auth admin.
- Pas de Stripe.
- Calendrier produit non finalisé : prochaine étape dédiée.
- Certaines galeries détaillées doivent être remigrées depuis les anciens HTML si besoin.

## Pourquoi cette base est meilleure

Le projet est maintenant découpé en composants réutilisables au lieu de HTML dupliqué.
Les styles globaux sont dans `app/globals.css`.
Les produits sont dans `lib/products.ts`.
Le panier est dans `lib/cart.ts`.


## V58 - Réservation / stock location

- Le panier est visuellement jaune sur toutes les pages.
- Les fiches produits location ont un bouton retour catalogue.
- Les filtres du catalogue location sont persistés via `localStorage` (`img_location_filters`) et URL params.
- Le générateur est déclaré en location jusqu'au 01/06/2026 : dates antérieures bloquées dans le calendrier.
- Une préinscription d'alerte retour stock est enregistrée localement dans `img_stock_alerts`.
- Envoi réel des emails à brancher côté backend avec tâche planifiée : J-1 et jour J.
