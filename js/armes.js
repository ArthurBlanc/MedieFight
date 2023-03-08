class Arme {
    constructor(id, position) {
        this.id = id;
        this.position = position;
        switch(this.id) {
            case 1:
                this.degats = 10;
                this.nom = "Dague";
            break;
            case 2:
                this.degats = 15;
                this.nom = "Epée simple";
            break;
            case 3:
                this.degats = 20;
                this.nom = "Hache";
            break;
            case 4:
                this.degats = 25;
                this.nom = "Douple épée";
            break;
        }
    }
    
// Récupère le chemin vers les images des differentes armes
    imageArmeJoueur() {
            return "./img/arme"+ String(this.id)+ ".png";
    }
}
