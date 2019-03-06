function getIngredients (zutatenJSON, recipeNum, portions){
	let ingredientsArray = 
		{
			type: "section",
			text: {
			type: "mrkdwn",
			text: "",
		}
	}
	if (portions == 1 ){
		ingredientsArray.text.text = `*Zutaten (für ${portions} Person):* \n`;
	}
	else {
		ingredientsArray.text.text = `*Zutaten (für ${portions} Personen):* \n`;
	}
	
	for (i = 0; i < zutatenJSON[recipeNum].length; i++){
		if(zutatenJSON[recipeNum][i].Menge != "")
		zutatenJSON[recipeNum][i].Menge *= portions;
		ingredientsArray.text.text += `- ${zutatenJSON[recipeNum][i].Menge} ${zutatenJSON[recipeNum][i].Einheit} ${zutatenJSON[recipeNum][i].Zutat} \n`;
	}
	return ingredientsArray;
}


module.exports.getIngredients = getIngredients;



