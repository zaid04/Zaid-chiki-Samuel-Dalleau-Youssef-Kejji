# Zaid-chiki-Samuel-Dalleau-Youssef-Kejji

# Project Health – Rapport de conception

## 1. Contexte et objectif

Dans le cadre de notre cours d’Interface, nous avons développé pour notre Project Health, un prototype de tableau de bord personnel destiné à agréger des données physiologiques, d’activité et d’humeur. Le projet explore des formes de restitution visuelle et narrative accessibles à un public non spécialiste.

## 2. Architecture logicielle

Le front‑end repose sur React 18 accompagné de TypeScript 5, combinaison qui offre la sécurité d’un typage statique tout en restant en phase avec les compétences acquises durant le semestre. L’état global est géré par Zustand grâce à son empreinte réduite et à la clarté de son API, ce qui facilite la lecture du code et sa maintenance. Pour le style nous avons choisi Tailwind CSS : le framework garantit une cohérence visuelle immédiate, propose un passage automatique en mode sombre et évite la prolifération de feuilles personnalisées. Côté serveur, Node.js associé à Express permet de mettre rapidement en place une API REST sans quitter l’écosystème JavaScript. Les données sont stockées dans une base SQLite locale, solution légère qui suffit à la démonstration et dispense de configuration serveur.

## 3. Pipeline de données

Chaque flux – poids, activité ou humeur – arrive au format JSON et reçoit un horodatage. Les valeurs sont ensuite converties dans des unités homogènes : kilogrammes, nombre de pas et score compris entre zéro et dix pour l’humeur. 

## 4. Conception de l’interface

Le tableau de bord s’articule autour de trois zones fonctionnelles. Un en‑tête présente le profil de l’utilisateur – nom, âge, taille et indice de masse corporelle – afin de contextualiser aussitôt les indicateurs. Immédiatement en dessous, trois cartes synthétisent le nombre total de pas, la durée d’effort et les calories brûlées pour offrir un résumé instantané sans surcharge visuelle. La zone centrale accueille un graphique combiné qui superpose poids et activité sur une échelle normalisée ; cette représentation rend perceptible, en un coup d’œil, l’existence éventuelle d’une corrélation. La bibliothèque Recharts a été retenue pour sa prise en main rapide et son fonctionnement responsive.

## 5. Interprétation et suggestions

Pour valider le principe de coaching sans recourir immédiatement à un modèle d’apprentissage, nous avons introduit deux règles déterministes. Lorsque le nombre de pas diminue de dix pour cent sur quatorze jours, l’application propose à l’utilisateur un défi consistant à marcher sept mille pas pendant trois jours. Si le poids augmente de deux pour cent sur la même période, un conseil invite à réduire les sucres simples. Ces règles, définies constituent une base qu’il sera possible d’enrichir ultérieurement par un modèle statistique.

## 6. Visualisations secondaires

La vue principale est complétée par des sparklines qui illustrent les tendances récentes sans saturer l’écran. Un graphique radar à cinq axes situe l’utilisateur par rapport à ses objectifs globaux.

## 7. Gamification modérée

Afin de vérifier l’hypothèse selon laquelle un retour positif encourage la persévérance, un système de badges a été intégré : l’utilisateur obtient par exemple le badge « Marathonien » après cent mille pas cumulés ou « Positivité » lorsque son humeur moyenne dépasse huit sur dix. 

## 8. Journal émotionnel et ChatBot

Un journal, présenté sous la forme d’une zone de saisie, permet à l’utilisateur de consigner librement son ressenti quotidien. La librairie Compromise analyse le texte et attribue un score de sentiment réinjecté dans le calcul d’humeur global. Un ChatBot sert en parallèle de prototype pour un futur assistant conversationnel ; il se contente pour l’heure de répéter les messages, l’intégration d’un vrai modèle de conversation peut être faite.

## 9. Perspectives

Plusieurs évolutions sont envisagées : l’intégration d’une balance connectée en Bluetooth Low Energy, le développement d’un modèle de prédiction pondérale fondé sur une forêt aléatoire et la mise en œuvre d’une authentification OAuth 2.0 pour gérer plusieurs comptes.

## 10. Conclusion

Ce projet illustre la faisabilité d’un agrégateur de données santé centré sur la lisibilité. Les choix technologiques  répondent à la contrainte académique de temps tout en ouvrant la voie à des enrichissements ultérieurs. Le prototype démontre la transformation d’une donnée brute en récit intelligible et la manière dont cette narration peut nourrir la motivation de l’utilisateur, objectif essentiel à la réussite d’un suivi santé.