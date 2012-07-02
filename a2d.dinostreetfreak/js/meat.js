game.Meat = function(pos) {
	a2d.Tile.apply(this, [a2d.resources["meat"]]);

	var self = this,
		fixDef = new Box2D.Dynamics.b2FixtureDef,
		bodyDef = new Box2D.Dynamics.b2BodyDef,
		body = null,
		$draw = this.draw.bind(this),
		lastAttack = 0,
		walkcycle = new a2d.Vector(0, 2);
	//constructor body
	this.position = pos;
	pPos = new Box2D.Common.Math.b2Vec2(0, 0);
	pPos.X = pos.X;
	pPos.Y = pos.Y;
	fixDef.density = 1.0;
	fixDef.friction = 5.0;
	fixDef.restitution = 0.2;	
	fixDef.userData = this;
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
	fixDef.shape.SetAsBox(1.5, 1.5);	
	bodyDef.position.Set(pPos.x, pPos.y);
	bodyDef.allowSleep = false;
	body = game.world.CreateBody(bodyDef);
	body.CreateFixture(fixDef);

	this.position = pos;

	this.meat = true;

	this.attack = function() {
		var now = (new Date()).getTime();
		if(game.player.position.distanceTo(self.position) < 200 && now - lastAttack > 1000) {
			game.level.push(new game.Grenade(self.position, false));
			lastAttack = now;
			a2d.resources.shoot.play();
		}
	};

	this.draw = function() {
		this.position = body.GetPosition();
		$draw();
		self.attack();
	};

	this.die = function () {
		game.world.DestroyBody(body);
		var explosion = new a2d.Tile(a2d.resources.explosion);
		explosion.frameLoop(new a2d.Vector(0, 7));
		explosion.on("animationend", function() {
			game.level.remove(game.level.indexOf(explosion));
		});
		game.level.push(explosion);
		return self;
	};
};