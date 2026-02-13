# París Bohème - Site Web Touristique sur Paris

## Problem Statement Original
Créer un site web sur Paris avec des articles cliquables déjà rédigés sur le tourisme (monuments, musées, visites).
- Traduit en espagnol mexicain à la demande de l'utilisateur
- Système de newsletter ajouté

## Choix Utilisateur
1. Type de contenu: Tourisme (monuments, musées, visites)
2. Style visuel: Confiance au designer (thème "París Bohème" élégant)
3. Nombre d'articles: Plus de 10 (13 articles créés)
4. Fonctionnalités: Catégories/filtres + Newsletter

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn/UI
- **Backend**: FastAPI + MongoDB
- **Design**: Thème élégant "París Bohème" avec tons beige, bleu marine et or

## Ce qui a été implémenté
- Page d'accueil avec hero section et Tour Eiffel
- 13 articles complets sur Paris (Monuments, Musées, Barrios, Paseos)
- 4 catégories avec filtres
- Page listing articles avec recherche
- Page détail article avec partage social
- Traduction complète en espagnol mexicain
- Design responsive et animations
- **Sistema de Newsletter**: Formulaire sur la page principale + footer
  - Stockage des emails en MongoDB
  - Validation email duplicados
  - Messages de succès/erreur
  - Endpoint admin pour voir les suscripteurs

## Catégories
1. Monumentos (4 articles)
2. Museos (3 articles)
3. Barrios (3 articles)
4. Paseos (3 articles)

## Articles
1. La Torre Eiffel: Símbolo Eterno de París
2. El Museo del Louvre
3. Montmartre: El Pueblo Bohemio
4. El Arco del Triunfo
5. El Museo de Orsay
6. El Marais: Historia y Tendencias
7. Notre-Dame de París
8. Crucero por el Sena
9. El Centro Pompidou
10. Saint-Germain-des-Prés
11. Versalles: El Esplendor del Rey Sol
12. Las Catacumbas: El París Subterráneo
13. El Palacio Garnier

## API Endpoints
- GET /api/articles - Lista artículos
- GET /api/articles/{slug} - Detalle artículo
- GET /api/categories - Lista categorías
- GET /api/featured-articles - Artículos destacados
- POST /api/newsletter/subscribe - Suscribir email
- GET /api/newsletter/subscribers - Ver suscriptores (admin)

## Next Steps Potentiels
- Integración con servicio de email (SendGrid, Mailchimp)
- Version multilingue (français, anglais)
- Intégration maps pour localisation des lieux
- Panel admin para gestionar artículos
