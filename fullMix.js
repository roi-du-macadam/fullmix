/**
 FULL MIX CHECK
*/
function FullMix() {
	var that = this;
	var idUser = window.localStorage.getItem('userId');
    var storeUser = window.localStorage.getItem('userstore-'+idUser);
    var isMobile = (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent))
    
    /**
     * initialise
     */
	this.initialize = function() {
		//Ok ca a marché
		if(document.querySelector('.navbar-brand.icon > span')){
			document.querySelector('.navbar-brand.icon > span').innerHTML = ":)";
		}
        	this.addBtDebloque();
	};
	
    /**
     * Bouton qui s'affiche si la recette est bloqué
     */
	this.addBtDebloque = function() {
        //Référence de la recette
        var idRecipe = window.dataLayer[0].contentId;
         
	    //On cache le BT de déblocage 
        if(document.querySelector('#deblokRecipe')){
            document.querySelector('#deblokRecipe').style.display = "none";
        }
        
        if(document.querySelector('.qv-view-recipe-btn') == null && typeof(idRecipe) != 'undefined'){
            //Ajout du bt
            var content = document.querySelector('.quickview')
            var btDeblok = document.createElement("a");
            btDeblok.innerHTML = "Débloquer";
            btDeblok.id = "deblokRecipe";
            btDeblok.className = "qv-view-recipe-btn btn btn-defaut";
            btDeblok.setAttribute('role','button');
            btDeblok.onclick = function(){that.addRecipe(idRecipe)}
            if(content){
                content.appendChild(btDeblok);
            }
        }
	};
	
    /**
     * Ajoute une recette
     */
    this.addRecipe = function(idRecipe) {
        //il faut le mettre dans le LocalStorage
        // Mais forcer angular a rafraichir ses datas
        
        //Decode
        var tabRecipe = JSON.parse(storeUser);
        var MyRecipe =  JSON.parse(tabRecipe['TreasureCacheStoreKey']);
        
        //Ajout de la recette
        MyRecipe['Recipe'].insert(MyRecipe['Recipe'].length,idRecipe);
        
        //Encodage
        tabRecipe['TreasureCacheStoreKey'] = JSON.stringify(MyRecipe);
        window.localStorage.setItem('userstore-'+idUser,JSON.stringify(tabRecipe));        
        
        //On l'active
        angular.element(document.body).injector().get('TreasureCache').loadItemsFromLocalStorage();
        angular.element(document.body).injector().get('DateRangeStorage').restoreStoredDateRange();

        angular.element(document.body).injector().get('Db').get('recipes',idRecipe).isOwned = true;
        
        //On recharge la page
        angular.element(document.querySelector('.qv-back')).click();
        setTimeout(function(){ window.location.href = "#/recipe/"+idRecipe; }, 200);
    }
    
	return this;
}
var object = new FullMix();
object.initialize();



//En cas de changement dans le dom
//On verifie si le DOM change
//Contenu principal de la page
function onChangeHandler(event) {
   //console.log('Page reload');    
   setTimeout(function(){ object.initialize(); }, 500);
};

//Mieux que DOMSubtreeModified, execute 1 fois
this.observer = new MutationObserver(onChangeHandler);
var config = { attributes: false, childList: true, characterData: true, subtree: false};
this.observer.observe(document.body, config); //starts the actual observing of the element.
