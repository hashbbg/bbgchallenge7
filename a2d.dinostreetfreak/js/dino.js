var game = {
	init: function() {
		a2d.root.push(new a2d.Tile(a2d.resources["dino"], {position: new a2d.Position(100, 100)}));
		a2d.root[0].frameLoop(new a2d.Vector(0, 2));
	}
};

window.onload = function() {
	a2d.forceClear = true;
	a2d.on("load", function() {
		game.init();
	});
	a2d.load({"dino" : "images/dinosaur.png"});
}
