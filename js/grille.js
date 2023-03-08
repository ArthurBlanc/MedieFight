class Grille {
    constructor(joueur1, joueur2) {
        this.grille = [];
        this.joueurs = [joueur1, joueur2];
        this.generationGrille();
        this.generationGrilleEcran();
    }

    generationGrille() {
        var x = 0,
            y = 0,
            ligne = [],
            casesInterdites,
            caseActuelle;
        for (y = 0; y < 11; y += 1) {
            ligne = [];
            for (x = 0; x < 11; x += 1) {
                ligne.push("O");
            }
            this.grille.push(ligne);
        }

        casesInterdites = this.generationCasesInterdites();
        for (caseActuelle of casesInterdites) {
            this.grille[caseActuelle[0]][caseActuelle[1]] = "X";
        }

        // Placement des joueurs
        var positionJoueurs = this.generationPositionJoueurs(),
            nombreJoueur = 0;
        for(nombreJoueur; nombreJoueur < 2; nombreJoueur += 1) {
            var xJoueur = positionJoueurs[nombreJoueur][0],
                yJoueur = positionJoueurs[nombreJoueur][1];
            this.grille[xJoueur][yJoueur] = String(nombreJoueur+1);
        }

        // Placement des armes
        var armes = this.generationPositionArmes(),
            nombreArme = 0;
        for(nombreArme; nombreArme < 3; nombreArme += 1) {
            var xArme = armes[nombreArme][0],
                yArme = armes[nombreArme][1];
            this.grille[xArme][yArme] = String.fromCharCode(66+nombreArme); // Renvoie B, C, D
        }
    }

// Génération des cases interdites
    generationCasesInterdites() {
        var nombreCase = 0,
            casesInterdites = [],
            verificationElementArray = false;
        for (nombreCase; nombreCase < 13; nombreCase += 1) {
            var coordonneesCasesInterdites = this.generationXY();
            verificationElementArray = false;
            while(!verificationElementArray) {
                if(!this.elementArray(casesInterdites, coordonneesCasesInterdites)) {
                        casesInterdites.push(coordonneesCasesInterdites);
                        verificationElementArray = true;
                } else {coordonneesCasesInterdites = this.generationXY();}
            }
        }
        return casesInterdites;
    }

// Génération de la position des joueurs
    generationPositionJoueurs() {
        var positionJoueurs = [],
            nombreJoueur = 0,
            verificationPositionJoueur2 = false;
        positionJoueurs.push(this.generationXY());
        this.joueurs[0].position = positionJoueurs[0];

// Regénération des positions si les joueurs sont sur la même ligne / colonne
        while(!verificationPositionJoueur2) { 
             var positionJoueur2 = this.generationXY(),
                 positionJoueur1 = positionJoueurs[0];
             if(Math.abs(positionJoueur2[0] - positionJoueur1[0]) >= 1 && Math.abs(positionJoueur2[1] - positionJoueur1[1]) >= 1) { // positionJoueur2[0] = x de j2, positionJoueur2[1] = y de j2
                    positionJoueurs.push(positionJoueur2);
                    verificationPositionJoueur2 = true;
             } else {
                 positionJoueur2 = this.generationXY();
             }
        }

        this.joueurs[1].position = positionJoueurs[1];
        return positionJoueurs;
    }

// Génération de la position des armes
    generationPositionArmes() {
        var positionArmes = [],
            nombreArme = 0;
        for(nombreArme; nombreArme < 3; nombreArme += 1) {
            positionArmes.push(this.generationXY());
        }
        return positionArmes;
    }

// Fonction vérifiant si la position est déjà occupée.
    generationXY() {
        var randomX = Math.floor((Math.random() * 10)),
            randomY = Math.floor((Math.random() * 10)),
            validationCaseVide = false;
        while(!validationCaseVide) {
            if(this.grille[randomX][randomY] === "O") {
                    validationCaseVide = true;
                }
                else {
                    randomX = Math.floor(Math.random() * 10);
                    randomY = Math.floor(Math.random() * 10);
                }
        }
        return [randomX, randomY];
    }

// Tableau contenant les déplacements possibles
    calculDeplacementPossible(position) {
        var casesDisponible = [],
            casesCourantes,
            caseCourante,
            direction = 1;

        for(direction; direction < 5; direction += 1) {
            casesCourantes = this.verificationDeplacementDirection(position, direction);
            for(caseCourante of casesCourantes) {
                casesDisponible.push(caseCourante);
            }
        }
        return casesDisponible;
    }

// Tableau contenant les déplacements possibles dans une direction donnée (1: haut, 2: gauche, 3: bas, 4: droite)
    verificationDeplacementDirection(positionDepart, direction) { 
        var continuerDeplacement = true,
            casesDisponible = [],
            caseActuelle,
// Si l'on cherche à voir les déplacements sur [gauche, droite], on met x comme index de référence, sinon y
            depart = (direction % 2 === 0) ? positionDepart[0] : positionDepart[1], 
            axeInverse = (direction % 2 === 0) ? positionDepart[1] : positionDepart[0],
// Si l'on veut décrémenter l'index de référence (haut et gauche) ou incrémenter (bas et droite), on cherche la case immédiatement suivante
            actuel = (direction <= 2) ? depart - 1 : depart + 1; 

        while(continuerDeplacement) {
            if(Math.abs(actuel - depart) === 4 || actuel < 0 || actuel > 10) {
                continuerDeplacement = false;
            } else {
                caseActuelle = (direction % 2 === 0) ? this.grille[actuel][axeInverse] : this.grille[axeInverse][actuel];
// Si la case sur laquelle on se trouve est interdite ou à un joueur
                if(["X", "1", "2"].indexOf(caseActuelle) >= 0) { 
                    continuerDeplacement = false;
                } 
// Même principe que pour l'initialisation de caseActuelle
                else {casesDisponible.push((direction % 2 === 0) ? [actuel, axeInverse] : [axeInverse, actuel]);}
            }
            actuel = (direction <= 2) ? actuel - 1 : actuel + 1;
        }
        return casesDisponible;
    }

// Mise à jour de la position du joueur sur la grille back, retour : arme (int, -1 si on n'est pas sur une arme, le niveau de l'arme sinon)
    majPosition(joueur, position) { 
        var positionActuelle = joueur.position,
            arme = -1;
        joueur.position = [parseInt(position[0]), parseInt(position[1])];
// Si on est sur une arme, on modifie la variable arme pour permettre au programme de savoir sur laquelle on a cliqué
        if(this.grille[position[0]][position[1]] !== "O") { 
            arme = this.transformerValeur(this.grille[position[0]][position[1]]);
        }
// Si le joueur avait ramassé une arme au tour précédent
        if(joueur.ancienneArme !== -1) { 
            this.grille[positionActuelle[0]][positionActuelle[1]] = this.transformerValeur(joueur.ancienneArme); // Donne [A, B, C, D]
            joueur.ancienneArme = -1;
        } else {
            this.grille[positionActuelle[0]][positionActuelle[1]] = "O"; // On efface la trace du joueur sur son ancienne position
        }
        this.grille[position[0]][position[1]] = String(joueur.id); // On affiche la trace du joueur sur sa nouvelle
        return arme;
    }

    generationGrilleEcran() {
        var grilleEcran = $("tbody"),
            x = 0,
            y = 0,
            grilleBack = this.grille,
            armes = ["B", "C", "D"];
        for (y; y < 10; y += 1) {
            var ligne = $("<tr></tr>");
            x = 0;
            for(x; x < 10; x++) {
                var caseJeu = $("<td></td>"),
                    caseActuelle = grilleBack[x][y];
                caseJeu.attr("id", String(x)+ "-"+ String(y));
// On applique la classe case_interdite qui inversera les couleurs
                if(caseActuelle == "X") { 
                    caseJeu.addClass("case_interdite");
                }
// Ajout image joueur 1
                if(caseActuelle === "1") { 
                    var imageJoueur = $("<img></img>"),
                        nombreJoueur = grilleBack[x][y];
                    imageJoueur.attr("src", "./img/joueur1.png");
                    imageJoueur.addClass("joueur"+ nombreJoueur);
                    caseJeu.append(imageJoueur);
// Ajout image joueur 2
                } else if(caseActuelle === "2") { 
                    var imageJoueur = $("<img></img>"),
                        nombreJoueur = grilleBack[x][y];
                    imageJoueur.attr("src", "./img/joueur2.png");
                    imageJoueur.addClass("joueur"+ nombreJoueur);
                    caseJeu.append(imageJoueur);
                } 
// Si on tombe sur une arme
                else if(armes.indexOf(caseActuelle) >= 0) { 
                    var nombreArme = caseActuelle.charCodeAt(0) - 63, // Donnera [65, 66, 67, 68] - 63 = 1, 2,3,4, permet de trouver facilement l'arme4
                       image_arme = $("<img></img>");
                    image_arme.attr("src", "./img/arme"+String(nombreArme-1)+".png");
                    image_arme.addClass("image_arme");
                    caseJeu.append(image_arme);
                }
                ligne.append(caseJeu);
            }
            grilleEcran.append(ligne);
        }
    }

    majGrilleEcran(joueurActuel, anciennePosition, position) {
        var imageJoueur = $("<img></img>"),
            ancienneCase = $("#"+anciennePosition.join("-")),
            nouvelleCase = $("#"+ position.join("-"));
        imageJoueur.attr("src", joueurActuel.image);
// On applique la classe au joueur (permettant le changement de couleur)
        imageJoueur.addClass("joueur"+ String(joueurActuel.id)); 
// On efface la case actuelle
        ancienneCase.html(""); 
        var ancienneCaseBack = this.grille[anciennePosition[0]][anciennePosition[1]];
        if(ancienneCaseBack !== "O") {
            var image_arme = $("<img></img>");
            image_arme.attr("src", "./img/arme"+ String(this.transformerValeur(ancienneCaseBack))+ ".png");
            image_arme.addClass("image_arme");
            ancienneCase.html(image_arme);
       }
// On applique l'image à la nouvelle case
       nouvelleCase.html(imageJoueur); 
// On efface les déplacements possibles
        $(".deplacement_possible").removeClass("deplacement_possible"); 
    }

// Fonction ajoutant les déplacements possibles sur la grille à l'écran
    afficherDeplacementPossible(position, _callback) { 
        var deplacementsPossibles = this.calculDeplacementPossible(position),
            deplacementPossible = [];
        for(deplacementPossible of deplacementsPossibles) {
            var caseDeplacement = $("#"+ deplacementPossible.join("-")),
// Enfants potentiels de la case (joueur ou arme)
                enfants = []; 
            caseDeplacement.addClass("deplacement_possible");
// Si l'utilisateur clique sur une case contenant une arme
            if(caseDeplacement.children().length > 0) { 
// Si un des déplacements disponibles contient une arme ...
                if(caseDeplacement.find("img.image_arme").length !== 0) { 
// On permet à l'utilisateur de cliquer dessus
                    caseDeplacement.children("img.image_arme").addClass("deplacement_possible"); 
                }
            }
        }

        $(".deplacement_possible").on("click", _callback);
    }

// Workaround de indexOf dans un tableau 2d
    elementArray(array, element) { 
        var indexElement = 0;
        for(indexElement; indexElement < array.length; indexElement += 1) {
            var arrayElement = array[indexElement];
            if(arrayElement[0] == element[0] && arrayElement[1] == element[1]) {
                return true;
            }
        }
        return false;
    }

// Fonction transformant un caractère en nombre ou inversement
    transformerValeur(val) { 
        if(typeof(val) === "string") {
            return val.charCodeAt(0) - 64;
        } else {
            return String.fromCharCode(val + 64);
        }
    }

    enCombat() {
        var positionJoueur1 = this.joueurs[0].position,
            positionJoueur2 = this.joueurs[1].position;
        return Math.abs(positionJoueur1[0] - positionJoueur2[0]) === 0 &&  Math.abs(positionJoueur1[1] - positionJoueur2[1]) === 1 || Math.abs(positionJoueur1[0] - positionJoueur2[0]) === 1 &&  Math.abs(positionJoueur1[1] - positionJoueur2[1]) === 0;
    }
}
