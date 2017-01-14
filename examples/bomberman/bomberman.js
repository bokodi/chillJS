Chill.out(new Chill.App('./bomberman-app.json'), 'wrapper', function(scene) {
	var staticLayer = scene.getLayer('static');
	var mainLayer = scene.getLayer('main');
	var hero = mainLayer.getElementByID('hero');
	var bomb = mainLayer.getElementByID('bomb');
	var brickSize = scene.get('brickSize');

	var heroDirections = [];
	var collisionTargets = [];

	// fill the map
	for (var x = 0, xl = scene.screen.width / brickSize; x < xl; x++) {
		for (var y = 0, yl = scene.screen.height / brickSize; y < yl; y++) {
			if (x % 2 && y % 2) {
				collisionTargets.push(staticLayer.insert('#concrete', {
					x: x * brickSize,
					y: y * brickSize
				}, 'concretes'));
			} else if (x && y && Math.random() > 0.7) {
				collisionTargets.push(mainLayer.insert('#brick', {
					x: x * brickSize,
					y: y * brickSize
				}, 'bricks'));
			}
		}
	}

	scene.on('preloadComplete', function() {
		scene.start();
		staticLayer.render();
	});

	scene.on('tick', function() {
		var heroDirection = last(heroDirections);
		var dx = 0;
		var dy = 0;
		var ox, oy, heroSpeed;
		var target, i, il;
		var hitTargetRight, hitTargetLeft, hitTargetBottom, hitTargetTop;

		hero.stop();

		if (heroDirection) {
			heroSpeed = hero.get('speed');

			switch(heroDirection) {
				case 'up': dy = -heroSpeed; break;
				case 'left': dx = -heroSpeed; break;
				case 'down': dy = heroSpeed; break;
				case 'right': dx = heroSpeed; break;
			}

			hero.start();
		}

		ox = hero.x;
		oy = hero.y;

		hero.x += dx;
		hero.y += dy;

		// movement helper
		for (i = 0, il = collisionTargets.length; i < il; i++) {
			target = collisionTargets[i];

			hitTargetRight = hero.x >= target.screenXE;
			hitTargetLeft = hero.x + hero.width <= target.screenX;
			hitTargetBottom = hero.y >= target.screenYE;
			hitTargetTop = hero.y + hero.height <= target.screenY;

			if (!(hitTargetRight || hitTargetLeft || hitTargetBottom || hitTargetTop)) {
				hero.x = ox;
				hero.y = oy;

				if ((dx > 0 && !hitTargetLeft && dy === 0) || (dx < 0 && !hitTargetRight && dy === 0)) {
					if (hero.y + hero.height < target.screenYC) {
						hero.y -= heroSpeed;
					} else if (hero.y > target.screenYC) {
						hero.y += heroSpeed;
					}
				}

				if ((dy > 0 && !hitTargetTop && dx === 0) || (dy < 0 && !hitTargetBottom && dx === 0)) {
					if (hero.x + hero.width < target.screenXC) {
						hero.x -= heroSpeed;
					} else if (hero.x > target.screenXC) {
						hero.x += heroSpeed;
					}
				}

				break;
			}
		}

		hero.currentAnimation = heroDirection;
	});

	scene.on('keydown', function(e) {
		switch(e.keyCode) {
			case 38: addUnique(heroDirections, 'up'); break;
			case 37: addUnique(heroDirections, 'left'); break;
			case 40: addUnique(heroDirections, 'down'); break;
			case 39: addUnique(heroDirections, 'right'); break;
		}
	});

	scene.on('keyup', function(e) {
		switch(e.keyCode) {
			case 38: remove(heroDirections, 'up'); break;
			case 37: remove(heroDirections, 'left'); break;
			case 40: remove(heroDirections, 'down'); break;
			case 39: remove(heroDirections, 'right'); break;
		}
	});

	// setting bomb
	scene.on('keydown', function(e) {
		var heroPosition;

		if (e.keyCode !== 17 || bomb.opacity > 0) return void 0;

		heroPosition = getPosition(hero);

		bomb.edit({
			x: heroPosition.x * brickSize,
			y: heroPosition.y * brickSize,
			opacity: 1
		});

		setTimeout(function() {
			var removeBricks = [];

			mainLayer.getElementByID('bricks').each(function(brick) {
				var bombPosition = getPosition(bomb);
				var brickPosition = getPosition(brick);

				if (
					(bombPosition.x === brickPosition.x && bombPosition.y - 1 === brickPosition.y) ||
					(bombPosition.x === brickPosition.x && bombPosition.y + 1 === brickPosition.y) ||
					(bombPosition.y === brickPosition.y && bombPosition.x - 1 === brickPosition.x) ||
					(bombPosition.y === brickPosition.y && bombPosition.x + 1 === brickPosition.x)
				) {
					removeBricks.push(brick);
				}
			});

			removeBricks.forEach(function(brick) {
				brick.parentElement.remove(brick);
				remove(collisionTargets, brick);
			});

			bomb.opacity = 0;
		}, 4000);
	});

	function getPosition(element) {
		return {
			x: element.screenXC / brickSize | 0,
			y: element.screenYC / brickSize | 0
		};
	}

	function addUnique(arr, item) {
		if (!inArray(arr, item)) arr.push(item);

		return arr;
	}

	function inArray(arr, searchItem) {
		return arr.indexOf(searchItem) !== -1;
	}

	function remove(arr, removeItem, limit) {
		var removedCount = 0,
			index;

		if (limit === undefined) limit = 1;

		while ((index = arr.indexOf(removeItem)) !== -1) {
			arr.splice(index, 1);

			if (++removedCount >= limit) break;
		}

		return removedCount;
	}

	function last(arr) {
		return arr.slice(-1)[0];
	}
});
