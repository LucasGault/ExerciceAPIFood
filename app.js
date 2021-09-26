//Fonction qui permet de créer un élément html
function createNode(element) {
    return document.createElement(element)
}

//Fonction qui permet d'ajouter un élément fils à un élément père
function append(parent, el){
    return parent.appendChild(el)
}

//Url de récupération des catégories de repas de l'API TheMealDB
const listCategories = document.getElementById('listCategories')
const urlCategories = "https://www.themealdb.com/api/json/v1/1/categories.php"
var tableauCategories = []

//Récupération des données sous format json grâce à la fonction fetch qui prend en paramètre un URL 
fetch(urlCategories)
.then((resp) => resp.json())
.then(data => {
    let categories = data.categories
    //On return notre tableau rempli des catégories récupérées
    return categories.map(function(categorie) {
        tableauCategories.push(categorie.strCategory)
    })
})
.catch(function(error) {
    console.log(error)
})

//Url de récupération d'un repas aléatoire de l'API TheMealDB
const urlRandomMeal = "https://www.themealdb.com/api/json/v1/1/random.php"
var tableauRandomMeals = []
//Variable qui va nous servir plus tard, (va nous permettre de marquer un temps de pause)
var stop = false

//Condition qui prévient l'utilisateur du chargement des données
//Si nos 50 random repas n'ont pas été chargé alors créer une div qui écrit 'Chargement en cours'
if(tableauRandomMeals.length == 0) {
    divChargement = createNode('div')
    divChargement.innerHTML = 'Chargement en cours...'
    append(listCategories, divChargement)
} 
else {}

var tableauTemp = [] //tableau temporaire qui va nous permettre de stocker l'id d'un repas récupéré pour check si celui-ci est déjà dans notre tableau de repas
//Fonction qui retourne un tableau de 50 random repas différents sous AJAX grâce à l'url de la webservice qui permet de générer un repas aléatoirement
//Le problème d'asynchronité est réglé plus tard grâce à la fonction setInterval()
//Le tableau de données n'a pas le temps d'être traiter en entier, ce qui pose un problème pour le traitement de ses données après
function randomMeal(){
    $.ajax({
        url: urlRandomMeal,
        dataType: 'json',
        
        success: function(data){
            const mealAllData = data.meals[0]

            //Si l'id que l'on récupère à l'appel de la webservice n'est pas dans notre tableau temporaire alors on push ses données dans notre tableau qui contiendra les 50 random repas
            if(!tableauTemp.includes(data.meals[0].idMeal)){
                tableauTemp.push(data.meals[0].idMeal)
                tableauRandomMeals.push(mealAllData)
            }
            //Si notre tableau n'est tjr pas de taille 50 car on a croisé des doublons alors on appelle récursivement la fonction jusqu'à qu'on en est 50
            if(tableauRandomMeals.length < 50  ) {
                randomMeal()
            }
            //Quand le tableau est bien de taille 50, nous pouvons donner le feu vert aux traitements des données car le tableau est prêt à être utilisé
            //Pour ceci on met notre variable stop à true
            else {
                stop = true
            }
        }
    });
    return tableauRandomMeals
}
randomMeal()

const divMsgChargement = document.getElementById('divMsgChargement')
//Tout le traitement et affichage des données se passent ici car le tableau est fin prêt à être utilisé
var loop = setInterval(() =>{ //check toutes les 1 secondes si stop est passé à true.
    if(stop) {
        console.log('continue')
        clearInterval(loop) //stop le checking de l'interval qui est effectué toutes les 1 seconde

        //On cache le msg de chargement en cours car le chargement est fini
        divChargement.setAttribute('id', 'chargementHidden')
        append(divMsgChargement, divChargement)

        //Tableau à 2 dimensions qui nous servira plus tard à regarder si certaines catégories n'ont pas de repas
        var tableauTestableauTEmptyCategorie = [[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0]]

        //Pour chaque catégorie, effectué ce qu'il y a dans cette boucle
        for(var i = 0; i < tableauCategories.length; i++) {

            //Création de la balise et affichage de la catégorie
            var pCategorie = createNode('p')
            pCategorie.innerHTML = tableauCategories[i]
            pCategorie.setAttribute('id', `pCategorie-${i+1}`)
            append(listCategories, pCategorie)
            var hr = createNode('hr')
            append(pCategorie, hr)

            //Parcours du tableau des 50 repas aléatoires
            tableauRandomMeals.map((meal) => {
                //Si la catégorie du repas actuel est égale à la catégorie actuelle (boucle for ligne 92) alors...
                if(meal.strCategory == tableauCategories[i]) {

                    //On incrémente de 1, la valeur du nombre de repas de la catégorie en question (va nous permettre de savoir les catégories vides)
                    tableauTestableauTEmptyCategorie[i][1] = tableauTestableauTEmptyCategorie[i][1] + 1

                    //Création et Affichage du nom du repas
                    var divMeal = createNode('div')
                    var buttonMeal = createNode('button')
                    buttonMeal.innerHTML = meal.strMeal
                    buttonMeal.setAttribute('id', `meal-${meal.idMeal}`)
                    buttonMeal.setAttribute('class', 'button')
                    append(divMeal, buttonMeal)
                    append(pCategorie, divMeal)
                    var br = createNode('br')
                    append(pCategorie, br)

                    //Création et affichage des informations du repas
                    var divContenuMeal = createNode('p')
                    divContenuMeal.setAttribute('class', 'hidden') //Cacher les informations des repas par défaut
                    divContenuMeal.setAttribute('id', `id-${meal.idMeal}`)
                    buttonMeal.setAttribute('data-id', `${meal.idMeal}`)
                    append(divMeal, divContenuMeal)

                    divContenuMealPrinc = createNode('div')
                    divContenuMealPrinc.setAttribute('class', 'contenuMealPrinc')
                    append(divContenuMeal, divContenuMealPrinc)
                    divContenuMealSecond = createNode('div')
                    divContenuMealPrinc.setAttribute('class', 'contenuMealSecond')
                    append(divContenuMeal, divContenuMealSecond)
                    
                    var pays = meal.strArea
                    var instructions = meal.strInstructions
                    var thumb = meal.strMealThumb
                    var nomMeal = meal.strMeal
                    
                    var imgMeal = createNode('img')
                    imgMeal.src = thumb
                    append(divContenuMealPrinc, imgMeal)

                    //on ajoute les informations du repas (nom, pays, ingrédients)
                    var divInfosMeal = createNode('div')
                    divInfosMeal.innerHTML = 'Nom du repas : <b>' + nomMeal + '</b><br /> Pays d\'origine : <b>' + pays + '</b><br /><br />Ingrédients :'
                    divInfosMeal.setAttribute('style', 'margin-left: 10px; text-align: start;')
                    append(divContenuMealPrinc, divInfosMeal)

                    //on ajoute les instructions pour faire le repas
                    var divInstruMeal = createNode('div')
                    divInstruMeal.innerHTML = '<b>Instructions</b> : '+instructions
                    divInstruMeal.setAttribute('class', 'instruMeal')
                    append(divContenuMealSecond, divInstruMeal)

                    //boucle for qui permet de créer une balise div pour chaque ingrédient récupéré (car pour les ingrédients, l'api ne retourne pas de tableau mais une variable pour chaque ingrédient)
                    for(let i = 1; meal[`strIngredient${i}`]; i++){

                        const ingredients = `🥢 ${meal[`strIngredient${i}`]}`
                        const mealIngredient = createNode('div')
                        mealIngredient.innerText = ingredients;
                        mealIngredient.className = 'mealIngredient'
                        append(divInfosMeal, mealIngredient)
                    }
                }
                })
                
        }

        //boucle for qui permet de check s'il y a des catégories vides et d'ajouter un msg en front si oui
        for(var c = 0; c < tableauTestableauTEmptyCategorie.length; c++){
            if(tableauTestableauTEmptyCategorie[c][1] == 0){
                divNoMealInCategorie = createNode('div')
                divNoMealInCategorie.innerHTML = "Pas de repas trouvé dans cette catégorie."
                categorieVide = document.getElementById(`pCategorie-${c+1}`)
                append(categorieVide, divNoMealInCategorie)
            }
        }
    }

    //fonction jquery d'apparition/disparition des infos d'un repas par le biais d'un click button
    $(function () {
        $('.button').click(function () {

            var id = $(this).attr("data-id")
            var divMealClick = document.getElementById('id-'+id)

            $('.button#meal-'+id).css("color", "#714A0A")

            if($(divMealClick).is(':hidden')){
                $(divMealClick).css("display", "block")
                divMealClick.className += " active";
            }
            else if($(divMealClick).is(':visible')){
                $(divMealClick).css("display", "none")
                $('.button#meal-'+id).css("color", "black")
            }
        });
    });
}, 1000)