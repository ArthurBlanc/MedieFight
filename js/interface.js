class Interface {
    constructor(joueur1, joueur2) {
        $("#nom_joueur1").html(joueur1.nom);
        $("#nom_joueur2").html(joueur2.nom);
    }

// Boutons attaque et défense
    interfaceCombat(joueurActuel) {
        var $combat = $("<div></div>"),
            $boutonAttaque = $("<button id='bouton_attaque'>Attaquer</button>"),
            $boutonDefense = $("<button id='bouton_defense'>Défendre</button>"),
            idJoueur = joueurActuel.id;

        $combat.attr("id", "boutons_combat");
        $combat.css("display", "none");
        $combat.append($boutonAttaque);
        $combat.append($boutonDefense);
        $("#profil_joueur_" + String(idJoueur)).append($combat);
        $combat.slideDown(200);
    }

// MAJ des PV, on envoie l'id de l'ennemi pour facilement retrouver les données
    majInterfaceCombat(ennemi, _callback) { 
        $("#barre_joueur" + String(ennemi.id)).animate({
            "value": ennemi.pv
        }, 800, "swing", function() {
            _callback();
        });
        $("#vie_joueur" + String(ennemi.id)).html("Point de vie : " + String(ennemi.pv) + " / 100");
    }

// MAJ du nom, des images et des degâts de l'arme dans l'interface
    majArme(joueur, arme) { 
        $(`#nom_arme_joueur${joueur.id}`).html(joueur.arme.nom);
        $(`#degats_arme_joueur${joueur.id}`).html(joueur.arme.degats);
        $(`#posture${joueur.id}`).html(joueur.posture);
        $(`.arme_joueur${joueur.id}`).attr("src", joueur.armeImage);
    }
}