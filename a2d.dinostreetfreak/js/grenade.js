game.Grenade = function(pos, direction) {
	a2d.Tile.apply(this, [a2d.resources["grenade"]]);

	var self = this,
		fixDef = new Box2D.Dynamics.b2FixtureDef,
		bodyDef = new Box2D.Dynamics.b2BodyDef,
		body = null,
		$draw = this.draw.bind(this),
		launched = (new Date()).getTime(),
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
	fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(0.7);
	bodyDef.position.Set(pPos.x, pPos.y);
	bodyDef.allowSleep = false;
	body = game.world.CreateBody(bodyDef);
	body.CreateFixture(fixDef);

	this.position = pos;

	this.grenade = true;
	
	this.draw = function() {
		this.position = body.GetPosition();
		this.angle = body.GetAngle();
		$draw();
		if((new Date()).getTime() - launched > 2000) {
			self.die();
		}
	};

	this.die = function () {
		game.world.DestroyBody(body);
		game.level.remove(game.level.indexOf(self));
		var explosion = new a2d.Tile(a2d.resources.explosion);
		explosion.position = self.position;
		explosion.frameLoop(new a2d.Vector(0, 7));
		explosion.on("animationend", function() {
			game.level.remove(game.level.indexOf(explosion));
		});
		game.level.push(explosion);
		a2d.resources.explode.play();		
	};

	body.ApplyImpulse(body.GetPosition(), new Box2D.Common.Math.b2Vec2(direction ? -10 : 10, -4));
};