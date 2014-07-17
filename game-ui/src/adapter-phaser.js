var Adapter = {};

Adapter.init = function() {
	Adapter.engine = Phaser;

	Adapter.loadAssets = function(srcs) {
		for(var i = 0; i < srcs.length; i++) {
			var iter = srcs[i];
			game.load.image(iter, iter)
		}

		return;
	}
	
	Adapter.createTextureFromCanvas = function(canvas) {
		return new Phaser.RenderTexture(game, canvas.width, canvas.height);
	}

	Adapter.createSpriteFromImage = function(src, x, y, w, h) {
		var sprite = new Adapter.engine.Image(game, x, y, src);

		sprite.width = w;
		sprite.height = h;
		
		sprite.setVisible = function(visible) {
			this.visible = visible;

			return;
		}

		sprite.isVisible = function() {
			return this.visible;
		}

		return sprite;
	}
	
	Adapter.createTextureFromImage = function (src) {
		return src;
	}
	
	Adapter.setTexture = function(sprite, texture) {
		sprite.loadTexture(texture);

		return;
	}
	
	Adapter.setBeforePaintCallback= function(sprite, onBeforePaint) {
		sprite.orgUpdateTransform = sprite.updateTransform;
		sprite.updateTransform = function() {
			if(this.isVisible()) {
				onBeforePaint.call(this);
				this.orgUpdateTransform();
			}

			return;
		}

		return;
	}

	Adapter.createSprite = function(texture, x, y, w, h) {
		if(texture instanceof HTMLCanvasElement) {
			texture = Adapter.createTextureFromCanvas(texture);
		}
		else if(texture instanceof HTMLImageElement) {
			texture = Adapter.createTextureFromImage(texture);
		}

		var sprite = new Adapter.engine.Sprite(game, x, y, texture);
	
		sprite.getX = function() {
			return this.x;
		}
		
		sprite.setX = function(x) {
			this.x = x;

			return;
		}
		
		sprite.getY = function() {
			return this.y;
		}
		
		sprite.setY = function(y) {
			this.y = y;

			return;
		}
		
		sprite.getAnchorX = function() {
			return this.anchor.x;
		}
		
		sprite.setAnchorX = function(anchorX) {
			this.anchor.x = anchorX;

			return;
		}
		
		sprite.getAnchorY = function() {
			return this.anchor.y;
		}
		
		sprite.setAnchorY = function(anchorY) {
			this.anchor.y = anchorY;

			return;
		}

		sprite.getPivotX = function() {
			return this.pivot.x;
		}
		
		sprite.setPivotX = function(pivotX) {
			this.pivot.x = pivotX;

			return;
		}
		
		sprite.getPivotY = function() {
			return this.pivot.y;
		}
		
		sprite.setPivotY = function(pivotY) {
			this.pivot.y = pivotY;

			return;
		}
		
		sprite.getScale = function() {
			return this.scale;
		}
		
		sprite.setScale = function(scale) {
			this.scale.x = scale;
			this.scale.y = scale;

			return;
		}
		
		sprite.getAlpha = function() {
			return this.alpha;
		}
		
		sprite.setAlpha = function(alpha) {
			this.alpha = alpha;

			return;
		}
		
		sprite.rotationFromRadian = function(radian) {
			return radian;
		}

		sprite.getRotation = function() {
			return this.rotation;
		}
		
		sprite.setRotation = function(rotation) {
			this.rotation = rotation;

			return;
		}

		sprite.setVisible = function(visible) {
			this.visible = visible;

			return;
		}

		sprite.isVisible = function() {
			return this.visible;
		}

		sprite.movePivotToCenter = function() {
			var pivotX = sprite.getWidth() >> 1;
			var pivotY = sprite.getHeight() >> 1;
			
			var x = sprite.getX() + pivotX;
			var y = sprite.getY() + pivotY;

			this.setPivotX(pivotX);
			this.setPivotY(pivotY);

			this.setX(x);
			this.setY(y);

			return;
		}

		sprite.enableInput = function() {
			this.inputEnabled = true;
			this.input.start(0, true);
			
			this.events.onInputOver.add(this.onPointerMove, this);
			this.events.onInputDown.add(this.onPointerDown, this);
			this.events.onInputUp.add(this.onPointerUp, this);

			return true;
		}

		sprite.orgUpdateTransform= sprite.updateTransform;
		sprite.updateTransform = function() {
			if(this.isVisible()) {
				this.updateWidgetIfDirty();
				this.orgUpdateTransform();
			}

			return;
		}

		sprite.updateTexture = function() {
			this.texture.baseTexture.width = this.canvas.width;
			this.texture.baseTexture.height = this.canvas.height;
			this.texture.baseTexture.source = this.canvas;
			this.texture.frame.width = this.canvas.width;
			this.texture.frame.height = this.canvas.height;

			this._width = this.canvas.width;
			this._height = this.canvas.height;

			this.requiresUpdate =  true;
		};

		sprite._renderWebGL = Adapter.engine.Text.prototype._renderWebGL;
		sprite.onPointerDown = function(sprite, pointer) {
			var point = {};
			point.x = pointer.x - this.position.x;
			point.y = pointer.y - this.position.y;

			this.handlePointerDown(point);

			return false;
		}
		
		sprite.onPointerMove = function(sprite, pointer) {
			var point = {};
			point.x = pointer.x - this.position.x;
			point.y = pointer.y - this.position.y;

			return this.handlePointerMove(point);
		}
		
		sprite.onPointerUp = function(sprite, pointer) {
			var point = {};
			point.x = pointer.x - this.position.x;
			point.y = pointer.y - this.position.y;

			return this.handlePointerUp(point);
		}

		sprite.setX(x);
		sprite.setY(y);
		sprite.width = w;
		sprite.height = h;

		return sprite;
	}
};

