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
//Création de la liste des utilisateurs
async function listUser() {
    let user = await api_demande("", "Client");
    let listUser = document.getElementById('famille-select');
    user.records.forEach((user) => {
        let option = document.createElement('option');
        option.setAttribute('value', user.id);
        listUser.appendChild(option);
        option.innerHTML = user.fields.Name
    });


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
    list.setAttribute('class', 'flex-grid');
    list.setAttribute('id', 'productsChoiceList');
    section.appendChild(list);
    console.log('Administration: Création de la liste de produits');

    //Pour chaque produit de l'API on créé l'encadré HTML du produit
    produits.records.forEach((produit) => {
        //création du block contenant un produit + Ajout des class pour le css
        let produitBlock = document.createElement('div');
        produitBlock.setAttribute('class', 'block-list');
        let produitName = document.createElement('h4');
        produitName.setAttribute('class', 'block-list__name')
        let produitIllustration = document.createElement('div');
        produitIllustration.setAttribute('class', 'block-list__illustration')
        let produitImage = document.createElement("img");
        produitImage.setAttribute('class', 'produit-image');
        let produitBtn = document.createElement("button");
        produitBtn.setAttribute('class', 'block-list__btn' + ' ' + produit.id);
        produitBtn.setAttribute('id', 'btnAddPanier');

        //Attribut pour CSS

        //Mise en place du HTML
        list.appendChild(produitBlock);
        produitBlock.appendChild(produitIllustration);
        produitIllustration.appendChild(produitImage);
        produitBlock.appendChild(produitName);
        produitBlock.appendChild(produitBtn).innerHTML;

        //Contenu des balises
        produitName.textContent = produit.fields.Name;
        produitImage.setAttribute("src", produit.fields.Images[0].url);
        produitBtn.textContent = "Mettre dans le vélo";
    });
    //Activation des boutons d'ajout au panier
    addPanier()
};

/*Fonction ajouter le produit au panier de l'utilisateur
 **********************************************/
addPanier = () => {
    //Au clic de l'user pour mettre le produit dans le panier
    let btnPanier = document.querySelectorAll('#btnAddPanier');
    for (let btn of btnPanier) {
        btn.addEventListener("click", async function () {
            const produits = await api_demande(btn.getAttribute('class').split(' ')[1], "Produits");
            //Récupération du panier dans le localStorage et ajout du produit dans le panier avant revoit dans le localStorage
            userPanier = JSON.parse(localStorage.getItem('PapyPanier'));
            userPanier.push(produits);
            localStorage.setItem("PapyPanier", JSON.stringify(userPanier));
            console.log("Administration : le produit a été ajouté au panier");
            alert("Vous avez ajouté ce produit dans votre panier")
            //Génération du panier
            panier();
            window.location.reload()
        });
    };
};

/*Page panier
**********************************************/
panier = () => {
    //Vérifie si un prduit est dans le panier
    let panier = JSON.parse(localStorage.getItem("PapyPanier"));
    if (panier.length > 0) {
        //S'il n'est pas vide on supprime le message et on créé le tableau récapitulatif et le btn commander apparait
        if (document.getElementById("panierVide")) {
            document.getElementById("panierVide").remove();
        }
        //document.getElementById('btn-order').style.display = 'block';

        //Création de la structure principale de l'affichage du panier 
        let section = document.getElementById('panier');

        let sectionHead = document.createElement('h3');
        let facture = document.createElement("div");
        facture.setAttribute('class', 'panierResume');
        //Placement de la structure dans la page
        section.appendChild(sectionHead);
        section.appendChild(facture);

        //Titre
        sectionHead.innerHTML = 'Les produits chargés dans le vélo de Papy'

        //Pour chaque produit du panier, on créé une image du produit avec son nom
        for (let i = 0; i < panier.length; i++) {

            //Création des éléments
            let produit = document.createElement("div");
            facture.appendChild(produit);
            produit.setAttribute('class', 'line');
            let produitImg = document.createElement("img");
            produitImg.setAttribute('class', 'lineImg');
            produit.appendChild(produitImg);
            let produitNom = document.createElement("h4");
            produitNom.setAttribute('class', 'lineName')
            produit.appendChild(produitNom);
            let corbeille = document.createElement('i');
            corbeille.setAttribute('class', "fas fa-trash-alt annulerProduit");
            produit.appendChild(corbeille);

            //Contenu des éléments
            produitImg.setAttribute('src', panier[i].fields.Images[0].url);
            produitNom.innerHTML = panier[i].fields.Name;
            corbeille.addEventListener('click', annulerProduit.bind(i));
        };

        //Création du bouton de commande à la fin du pannier si celui-ci non vide
        let btnOrder = document.createElement('button');
        btnOrder.setAttribute('id', 'btn-order');
        btnOrder.innerHTML = 'Envoyer la commande';
        document.getElementById('blockPanier').appendChild(btnOrder);

    }
};

//Supprimer un produit du panier
annulerProduit = (i) => {
    console.log("Administration : Enlever le produit à l'index " + i);
    //recupérer le array
    let panier = JSON.parse(localStorage.getItem('PapyPanier'));
    panier.splice(i, 1);
    console.log("Administration : " + 'voici le nouveau panier ' + panier);
    //vide le localstorage
    localStorage.clear();
    console.log("Administration : localStorage vidé");
    // mettre à jour le localStorage avec le nouveau panier
    localStorage.setItem('PapyPanier', JSON.stringify(panier));
    console.log("Administration : localStorage mis à jour");
    //relancer la création de l'addition
    window.location.reload();
};

/*Vérification des informations sur le client et du panier
*********************************************************/
verifClientId = () => {
    let idClient = document.getElementById('famille-select').value;
    if (idClient === "") {
        alert("Vous n'avez pas séléctionner où vous livrer");
    } else {
        return true
    }
};

//Une vérification du panier est quand même effectué en cas de suppression du localStorage par l'user
verifPanier = () => {
    if (localStorage.getItem('PapyPanier') === null) {
        alert('Votre panier est vide');
    } else {
        return true
    }
};
/*A Supprimer
**************/
const objetTest = {
    "fields": {
        "Date": "2012-5-16",
        "Client": [
            "rec0P5lgLqp4yO3Z2"
        ],
        "Produits commandés": [
            "recp4LrlIQxr4kPRW",
            "rec4IxTeVGqw4Ous9"
        ]
    }
};
btnOrder = () => {
    let btnOrder = document.getElementById('btn-order');
    //Le bouton n'existe pas si le panier est vide - Permet d'éviter les erreurs
    if (btnOrder) {
        btnOrder.addEventListener('click', function () {
            if (verifClientId() == true && verifPanier() == true) {
                console.log('Administration : Tout est Ok, la commande peut être envoyée');
                //Création de l'objet de la commande
                envoiDonnees(createRequestObject());
                //Vider le localStorage une fois la commande passée
                localStorage.clear();
                //Message de remerciement
                alert('Merci de votre commande')
                //Rechargement de la page
                window.location.reload();
            } else {
                console.log('Administration : il y a eu un problème pour l\'envoi de la commande')
            }
        })
    }
}

//Création d'un exemple de commande pour test code
createRequestObject = () => {
    //class du fields de la requete
    class RequestFields {
        constructor(date, client, produit) {
            this.date = date;
            this.client = client;
            this.produits = produit;
        }
    }

    //Préparation des éléments du fields
    let dateCommande = aujourdhui();
    let client = [document.getElementById('famille-select').value];
    let produits = ProduitInPanier();

    //Création du fields
    let commande = new RequestFields(dateCommande, client, produits);
    console.log(commande);
    //Finalisation de l'objet de la requete
    let test = { "fields": { "Date": commande.date, "Client": commande.client, "Produits commandés": commande.produits } }
    console.log(test)
    return test;
};



//créer un record
envoiDonnees = (objetRequest) => {
    return new Promise((resolve) => {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {

                //resolve(JSON.parse(this.responseText));
            }
        };
        request.open("POST", "https://api.airtable.com/v0/appI9Ujyv4E6roNx3/Commandes/?api_key=keygHycxBbIn4H0c6");
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(objetRequest));
    });
};

//Fonction pour extraire la date du jour
aujourdhui = () => {
    let now = new Date();
    let annee = now.getFullYear();
    let mois = now.getMonth() + 1;
    let jour = now.getDate();

    return annee + '-' + mois + '-' + jour;
};

//Fonction pour extraire la liste de produit dans le panier
ProduitInPanier = () => {
    let idProduit = [];
    JSON.parse(localStorage.getItem('PapyPanier')).forEach((produit) => {
        idProduit.push(produit.id);
    })
    return idProduit;
}