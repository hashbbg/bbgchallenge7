game.Player = function(pos) {
	a2d.Tile.apply(this, [a2d.resources["dino"]]);
	var fixDef = new Box2D.Dynamics.b2FixtureDef,
		bodyDef = new Box2D.Dynamics.b2BodyDef,
		body = null,
		$draw = this.draw.bind(this);

	//constructor body
	this.position = pos;
	pPos = new Box2D.Common.Math.b2Vec2(0, 0);
	pPos.X = pos.X;
	pPos.Y = pos.Y;
	fixDef.density = 1.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;	
	bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
	fixDef.shape.SetAsBox(3.2, 3.2);
	bodyDef.position.Set(pPos.x, pPos.y);
	bodyDef.allowSleep = false;
	body = game.world.CreateBody(bodyDef);
	body.CreateFixture(fixDef);

	this.draw = function() {
		var pPos = body.GetPosition();
		this.position.X = pPos.X;
		this.position.Y = pPos.Y;
		this.angle = body.GetAngle();
		$draw();
	};

	this.right = function() {
		var f = new Box2D.Common.Math.b2Vec2(500, 0);
		//body.SetLinearVelocity(f);
		body.ApplyImpulse(f, body.GetPosition());
	};
};