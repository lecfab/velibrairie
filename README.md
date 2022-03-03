# :bicyclist: Vélib'rairie

Analysez vos trajets à Vélib' sans aucune atteinte à votre vie privée. La librairie va lire l'historique de vos trajets et les résumer dans de jolis graphiques.

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)
![Plotly](https://img.shields.io/badge/Plotly-%233F4F75.svg?style=flat&logo=plotly&logoColor=white)

![Firefox](https://img.shields.io/badge/Firefox-FF7139?style=flat&logo=Firefox-Browser&logoColor=white)
![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=flat&logo=GoogleChrome&logoColor=white)
![Brave](https://img.shields.io/badge/Brave-FB542B?style=flat-not-for-the-badge&logo=Brave&logoColor=white)

## :dart: Résultat

Voici un exemple de graphique que vous obtiendrez :

![Image du nombre de trajets par heure de la journée](trips-per-hour.png)


## :white_check_mark: Utilisation

C'est assez simple :
1. :computer: Sur un ordinateur, ouvrir le navigateur internet de votre choix (fonctionne sur Firefox, Chrome, Brave ; plus compliqué sur Safari).
1. :bust_in_silhouette: Aller sur le site https://www.velib-metropole.fr, se connecter et aller dans « Mon compte ».
1. :wrench: Faire clic droit > inspecter. Un panneau compliqué s'ouvre sur un côté de l'écran.
 Aller dans l'onglet "Console" de ce panneau.
1. :clipboard: Dans la zone indiquée par `>` ou `>>`, coller le code ci-dessous. Il peut y avoir un avertissement du type « ne collez que des codes de confiance dans cette zone ».
```javascript
$.getScript("https://lstu.fr/velibrairie")
```
<!-- https://cdn.jsdelivr.net/gh/lecfab/velibrairie/velibrairie.js -->
5. :hourglass_flowing_sand: Appuyer sur Entrée et attendre quelques secondes pendant que les données sont récupérées. Le panneau peut être fermé.
6. :bar_chart: Contempler les graphiques.

## :lock: Vie privée et sécurité

Le script est entièrement local :
il n'envoie rien à personne,
vos données restent sur votre ordinateur.
Il n'inclut ni cookies ni trackers, et
ne peut pas accéder à votre mot de passe ni extraire vos informations personnelles.
Pour vous en assurer, vérifiez que le code source ([`velibrairie.js`](velibrairie.js)) n'appelle aucune URL hormis celle de l'outil graphique Plotly (https://plot.ly).



## :busts_in_silhouette: Contributions

Fabrice Lécuyer, 2022

Ce projet n'est pas officiel et n'est lié ni à Vélib-métropole ni à Smovengo.

#### :bulb: Idées pour participer
- [ ] rapporter un bug dans les [issues](./issues) (il faut créer un compte github).
- [ ] suggérer une amélioration dans les [issues](./issues).
- [ ] tester de nouveaux navigateurs (Opéra, Safari, Edge, etc).
- [ ] proposer une pull request avec de nouveaux graphiques Plotly.
