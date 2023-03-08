$(document).ready(function() {
    "use strict";
    if ("filter" in document.body.style) {
        console.log("Filter compatible");
        console.log(document.body.style.filter);
    } else {
        console.log("Filter non compatible");
    }

// Demande des pseudo des joueurs 1 et 2
    $("h1").css("display", "block"); // Pour éviter que le titre soit affiché avant de charger la grille & l'interface
    var nomJoueur1 = prompt("Pseudo du Joueur 1 : "),
        nomJoueur2 = prompt("Pseudo du Joueur 2 : ");
    if (!nomJoueur1) {
        nomJoueur1 = "Joueur 1";
    }
    if (!nomJoueur2) {
        nomJoueur2 = "Joueur 2";
    }

// Génération de la grille et initialisation de la position des joueurs
    var joueur1 = new Joueur(1, nomJoueur1),
        joueur2 = new Joueur(2, nomJoueur2),
        joueurActuel,
        combat = false,
        grille = new Grille(joueur1, joueur2),
        interfaceJeu = new Interface(joueur1, joueur2),
        nbTours = 0; 

// Affichage de toute la page en même temps
    $("body").fadeIn(500);

// Commencement du jeu
    gestionTour();

    function deplacerJoueur(e) {
        $(".deplacement_possible").off("click", deplacerJoueur);
        var position = e.target.id.split("-"),
            anciennePosition = joueurActuel.position;
// Recherche de l'id du parent lors du clique sur l'image d'une arme 
        if (position.length !== 2) { 
            position = $(e.target).parent().attr("id").split("-");
        }

// MAJ de la position du joueur sur la grille back
        var arme = grille.majPosition(joueurActuel, position); 
// Si le joueur tombe sur une nouvelle arme
        if (arme !== -1) { 
            joueurActuel.majArme(arme);
            interfaceJeu.majArme(joueurActuel);
        }

// MAJ de la grille front
        grille.majGrilleEcran(joueurActuel, anciennePosition, position, arme); 
        gestionTour();
    }

    function gestionTour() {
        joueurActuel = grille.joueurs[nbTours % 2];
        if (!combat) { 
            if (grille.enCombat()) {
                combat = true;
                alert(`Le combat à mort commence !`);
// Fonction pour passer dans combat === true
                gestionTour(); 
            } else {
                var position = joueurActuel.position;
// Affichage des déplacements possibles du joueur
                grille.afficherDeplacementPossible(position, deplacerJoueur);
                nbTours += 1;
            }
        } else {
// Verification des PV des joueurs
            if (joueurActuel.pv === 0) { 
                var vainqueur = grille.joueurs[(nbTours + 1) % 2];
                alert(`${vainqueur.nom} a gagné !`);
            } 
// Si les joueurs ont encore des PV, le combat continue
            else { 
                interfaceJeu.interfaceCombat(joueurActuel);

                $("#bouton_attaque").on("click", gestionCombat);
                $("#bouton_defense").on("click", gestionCombat);
            }
        }
    }

// Fonction callback de gestionTour en cas de combat
    function gestionCombat(e) { 
        $("button").off("click", gestionCombat);
        $("#boutons_combat").remove();
        nbTours += 1;
        var decision = e.target.id.replace("bouton_", "");
        if (decision === "defense") {
            joueurActuel.majPosture(false);
            gestionTour();
        } else {
            var ennemi = (joueurActuel === joueur1) ? joueur2 : joueur1;
            ennemi.degatsRecu(joueurActuel.arme);
// Passage en posture offensif lors d'une attaque
            joueurActuel.majPosture(true); 
            interfaceJeu.majInterfaceCombat(ennemi, gestionTour);
        }
    }
});
