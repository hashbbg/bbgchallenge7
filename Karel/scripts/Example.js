// dit zijn uw #include's, elke parameter (Compose, Logger) komt overeen met een class die ge include, en met de Compse.js, Logger.js files
// compose include ge altijd en is iets speciaal - dit is een library die OO-achtige dingen toelaat in JS
define(["Compose", "Logger"], function(Compose, Logger) {
	
	// maak het object aan - conventie: zelfde naam als file
	var Example = Compose(function (parameter1) {
		// dit is de constructor - hier doet ge vanalles en da wordt opgeroepen als het object aangemaakt wordt met new
		
		// member variables setten in de constructor
		this.x = parameter1;
	},
	// einde constructor
	
	// hier begint de declaratie van member functies
	{
		
		// let op ':' ipv '=', JS whoopwhoop :()
		add: function(a) { // geen int ofzo voor parameternaam :P
			this.x += a;
		},
		
		print: function() {
			
			// Logger is een static helper class van mij om data naar het scherm te printen, handig voor debugging
			//Logger.log(this);
			
			// console.log logt een object naar de browser console - laat u toe om live te volgen wat er mee gebeurt
			console.log(this);
		}
	})
	
	
	// stuur de class terug - conventie: class objects/prototypes beginnen met een hoofdletter, instances met een kleine letter,
	// want in JS zijn zowel classes als objects hetzelfde, het is dus uw verantwoordelijkheid om ze uit elkaar te houden :)
	return Example;
});