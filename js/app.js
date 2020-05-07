//Prérequis et paramétrage pour communication avec l'API
param_API = () => {

    //Lien et clé API
    let APIURL = "https://api.airtable.com/v0/appI9Ujyv4E6roNx3/";
    const KeyAPI = "?api_key=keygHycxBbIn4H0c6";

    //Tableau des parametres pour le retour
    const paramAPI = [APIURL, KeyAPI]

    return paramAPI
}

//Vérification et création si nécessaire d'un panier pour l'utilisateur
const createPanier = () => {
    if (localStorage.getItem("PapyPanier")) {
        console.log("Administration : le panier de l'utilisateur existe dans le localStorage");
    } else {
        console.log("Administration : Le panier n'existe pas, il va être créer et l'envoyer dans le localStorage");
        //Le panier est un tableau de produits
        let panierInit = [];
        localStorage.setItem("PapyPanier", JSON.stringify(panierInit));
    };
};

//Identification du client
idClient = () => {
    let idClient = "";
    let select = document.getElementById('famille-select');
    select.addEventListener("change", function () {
        idClient = select.value;
        console.log('le choix à changé pour ' + idClient);
        let getPanier = localStorage.getItem('PapyPanier');
        let setPanier = JSON.parse(getPanier);
        setPanier.push(idClient);
        localStorage.setItem('PapyPanier', JSON.stringify(setPanier));
        allProductsList('', 'Produits')
    });
    return idClient;
};

/*Appel vers l'API
  @param id : string*/
let api_demande = (id, table) => {
    return new Promise((resolve) => {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                let response = JSON.parse(this.responseText);
                resolve(response);
                console.log("Administration : connection à " + param_API()[0] + table + "/" + id + param_API()[1] + " OK");
            }
        };
        request.open("GET", param_API()[0] + table + "/" + id + param_API()[1]);
        request.send();
    });
};




/*Création du HTML après appel identification
**********************************************/

//Build la liste des produits en vente sur la page index => Fonction appelée
async function allProductsList(id, table) {
    const produits = await api_demande(id, table);

    //Création de la section accueillant la liste des produits
    let section = document.getElementById('productsChoice');

    //Suppression du message de non identification
    //XXXXXXX
    //Suppression de l'ancienne liste de produit si elle existe de la précédente liste (éviter doublon)
    if (document.getElementById('productsChoiceList')) {
        let lastProduitBlock = document.getElementById('productsChoiceList');
        lastProduitBlock.remove();
        console.log('Administration : ancienne liste supprimée');
    }

    //Création de la div pour la nouvelle liste
    let list = document.createElement('div');
    list.setAttribute('id', 'productsChoiceList');
    section.appendChild(list);
    console.log('Administration: Création de la liste de produits');

    //Pour chaque produit de l'API on créé l'encadré HTML du produit
    produits.records.forEach((produit) => {
        //création du block contenant un produit + Ajout des class pour le css
        let produitBlock = document.createElement('div');
        let produitName = document.createElement('h4');
        let produitIllustration = document.createElement('div');
        let produitImage = document.createElement("img");
        let produitBtn = document.createElement("button");
        produitBtn.setAttribute('id', 'btnAddPanier');

        //Mise en place du HTML
        list.appendChild(produitBlock);
        produitBlock.appendChild(produitName);
        produitBlock.appendChild(produitIllustration);
        produitIllustration.appendChild(produitImage);
        produitBlock.appendChild(produitBtn).innerHTML;

        //Contenu des balises
        produitName.textContent = produit.fields.Name;
        produitImage.setAttribute("src", produit.fields.Images[0].url);
        produitBtn.textContent = "Mettre dans le panier";
    });
    //Activation des boutons d'ajout au panier
    addPanier()
};

/*Fonction ajouter le produit au panier de l'utilisateur
 **********************************************/
addPanier = () => {
    //Au clic de l'user pour mettre le produit dans le panier
    let btnPanier = document.getElementById('btnAddPanier');
    btnPanier.addEventListener("click", async function () {
        const produits = await api_demande("", "Produits");
        //Récupération du panier dans le localStorage et ajout du produit dans le panier avant revoit dans le localStorage
        userPanier = JSON.parse(localStorage.getItem('PapyPanier'));
        userPanier.push(produits);
        localStorage.setItem("PapyPanier", JSON.stringify(userPanier));
        console.log("Administration : le produit a été ajouté au panier");
        alert("Vous avez ajouté ce produit dans votre panier")
        //Génération du panier
        panier()
    });
};

/*Page panier
**********************************************/

panier = () => {
    //Vérifie si un prduit est dans le panier
    let panier = JSON.parse(localStorage.getItem("PapyPanier"));
    if (panier.length > 1) {
        //S'il n'est pas vide on supprime le message et on créé le tableau récapitulatif et le btn commander apparait
        document.getElementById("panierVide").remove();
        //document.getElementById('btn-order').style.display = 'block';

        //Création de la structure principale de l'affichage du panier 
        let section = document.getElementById('panier');

        let sectionHead = document.createElement('h3');
        let facture = document.createElement("div");


        //Placement de la structure dans la page
        section.appendChild(sectionHead);
        section.appendChild(facture);


        //Pour chaque produit du panier, on créé une image du produit avec son nom
        for (let i = 1; i < panier.length; i++) {

            //Création des éléments
            let produit = document.createElement("div");
            facture.appendChild(produit);
            let produitImg = document.createElement("img");
            produit.appendChild(produitImg);
            let produitNom = document.createElement("h4");
            produit.appendChild(produitNom);

            //Attributs pour le css

            //Contenu des éléments
            produitImg.setAttribute('src', panier[i].records[0].fields.Images[0].url)
        }
    }
};
/*
        //Dernière ligne du tableau : Total
        facture.appendChild(ligneTotal);
        ligneTotal.appendChild(colonneRefTotal);
        colonneRefTotal.textContent = "Total à payer"
        ligneTotal.appendChild(colonnePrixPaye);
        colonnePrixPaye.setAttribute("id", "sommeTotal")
 
        //Calcule de l'addition total
        let totalPaye = 0;
        JSON.parse(localStorage.getItem("userPanier")).forEach((produit) => {
            totalPaye += produit.price / 100;
        });
 
        //Affichage du prix total à payer dans l'addition
        console.log("Administration : " + totalPaye);
        document.getElementById("sommeTotal").textContent = totalPaye + " €";
    };
}
*/
//Supprimer un produit du panier
annulerProduit = (i) => {
    console.log("Administration : Enlever le produit à l'index " + i);
    //recupérer le array
    userPanier.splice(i, 1);
    console.log("Administration : " + userPanier);
    //vide le localstorage
    localStorage.clear();
    console.log("Administration : localStorage vidé");
    // mettre à jour le localStorage avec le nouveau panier
    localStorage.setItem('userPanier', JSON.stringify(userPanier));
    console.log("Administration : localStorage mis à jour");
    //relancer la création de l'addition
    window.location.reload();
};

//Création d'un exemple de commande pour test code

const objet = {
    "fields": {
        "Date": "2012-05-16",
        "Client": [
            "rec0P5lgLqp4yO3Z2"
        ],
        "Produits commandés": [
            "recp4LrlIQxr4kPRW",
            "rec4IxTeVGqw4Ous9"
        ]
    }
};

//créer un record
envoiDonnees = (objetRequest) => {
    return new Promise((resolve) => {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {

                console.log('commande envoyée')
                //Sauvegarde du retour de l'API dans la sessionStorage pour affichage dans order-confirm.html
                //sessionStorage.setItem("order", this.responseText);

                //Chargement de la page de confirmation
                //document.forms["form-panier"].action = './order-confirm.html';
                //document.forms["form-panier"].submit();

                resolve(JSON.parse(this.responseText));
            }
        };
        request.open("POST", "https://api.airtable.com/v0/appI9Ujyv4E6roNx3/Commandes/?api_key=keygHycxBbIn4H0c6");
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(objet));
    });
};

