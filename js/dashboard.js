//Prérequis et paramétrage pour communication avec l'API
param_API = () => {

    //Lien et clé API
    let APIURL = "https://api.airtable.com/v0/appI9Ujyv4E6roNx3/";
    const KeyAPI = "?api_key=keygHycxBbIn4H0c6";

    //Tableau des parametres pour le retour
    const paramAPI = [APIURL, KeyAPI]

    return paramAPI
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

//Build de la liste des order en cours
async function listOrder() {
    let listOrder = document.getElementById('list-order')
    let commandes = await api_demande("", "Commandes");
    console.log('Administration : il y a ' + commandes.records.length + ' commande(s) en cours');
    for (let commande of commandes.records) {
        //Création des éléments - Une ligne par commande
        let lineOrder = document.createElement('div');
        lineOrder.setAttribute('class', 'line-order')
        listOrder.appendChild(lineOrder);
        let orderDate = document.createElement('div');
        orderDate.setAttribute('class', 'orderDate');
        let orderProducts = document.createElement('div');
        orderProducts.setAttribute('class', 'orderProducts');
        let orderClient = document.createElement('div');
        orderClient.setAttribute('class', 'orderArea');

        //Placement des éléments créés
        lineOrder.appendChild(orderDate);
        lineOrder.appendChild(orderProducts);
        lineOrder.appendChild(orderClient);

        //Contenu des éléments
        orderDate.innerHTML = commande.fields.Date;
        listProduit = await returnId(commande.fields['Produits commandés'], 'Produits');
        orderProducts.innerHTML = listProduit;
        user = await returnUser(commande.fields.Client,'Client')
        orderClient.innerHTML = user;
        console.log('Administration : commande id : ' + commande.id + ' à traiter');

        //Création et placement du bouton de livraison
        let btnValidOrder = document.createElement('button');
        btnValidOrder.setAttribute('id', 'btn--valid-delivery')
        btnValidOrder.innerHTML = 'Valider la livraison';
        lineOrder.appendChild(btnValidOrder);
    };
};


//Fonction appelée pour récupérer le nom d'un produit depuis son id
async function returnId(listId, table) {
    let listName = '';
    for (let id of listId) {
        let refId = await api_demande(id, table);
        listName += ' ' + refId.fields.Name;
    }
    return listName;
}

//Fonction appelée pour récupérer le nom d'un client depuis son id
async function returnUser(refUser, table) {
    let user = '';
    for (let id of refUser) {
        let refUser = await api_demande(id, table);
        user += refUser.fields.Name;
    }
    return user;
}