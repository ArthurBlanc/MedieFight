class Joueur {
    constructor(id, nom) {
        this.nom = nom;
        this.id = id;
        this.arme = new Arme(1);
        this.image = "./img/joueur" + String(this.id)+ ".png";
        this.armeImage = this.arme.imageArmeJoueur();
        this.posture = false; // Attaque : true, Défense : false
        this.pv = 100;
        this.position = [-1, -1],
        this.ancienneArme = -1; // En cas de ramassage d'une arme, elle sera remis à son emplacement d'origine
    }

    majArme(id_arme) {
        this.ancienneArme = this.arme.id; // On met ici le niveau de l'ancienne arme
        this.arme = new Arme(id_arme); // On maj l'objet arme
        this.armeImage = this.arme.imageArmeJoueur(); // On maj l'image de l'arme
    }

    majPosture(bool_posture) {
        this.posture = bool_posture;
    }

    degatsRecu(arme_ennemi) {
        var degats = arme_ennemi.degats;
        if(!this.posture) {
            degats = Math.round(degats/2);
        }
        if(this.pv < degats) 
            this.pv = 0;
         else 
            this.pv -= degats;
    }
}