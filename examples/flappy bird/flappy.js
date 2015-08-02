Chill.out(new Chill.App('./flappy-app.json'), 'wrapper', function(scene) {
	var layer = scene.getLayer('main');
	var pipes = layer.getElementByID('pipes');
	var bird = layer.getElementByID('bird');
	var score = layer.getElementByID('score');
	var fg = layer.getElementByID('fg1');
	var detector = scene.watch(bird, []);
	
	scene.on('preloadComplete', scene.start);
	
	scene.on('keypress', function(e) {
		if (e.keyCode === 32/* space */) window.location.reload();
	});
	
	scene.on('mousedown', function() {
		if (scene.run) {
			bird.vY = -bird.get('jumpSpeed');
			scene.playAudio('#wing', 50, true);
		}
	});
	
	scene.on('tick', function() {
		var firstPipe = pipes.first();
		
		if (firstPipe !== null && bird.screenX === firstPipe.screenX) {
			score.text = 'score: ' + scene.set('score', scene.get('score') + 1);
			scene.playAudio('#point', 100);
		}
		
		bird.vY += bird.get('gravity');
		
		if (bird.vY >= bird.get('jumpSpeed')) {
			bird.currentFrame = 1;
			bird.angle = Math.min(90, bird.angle + 15);
		} else {
			bird.angle = -15;
		}
		
		if (bird.screenYE > fg.screenY) {
			scene.playAudio('#die', 80);
			scene.stop();
		}
		
		pipes.each(removePipe);
	});
	
	bird.on('collision', function(e) {
		scene.playAudio('#hit', 70);
		scene.stop();
	});
	
	scene.addTask(function() {
		var offset = Math.random() * 100 | 0;
		
		detector.addTarget(layer.insert('#pipe', {
			y: -offset,
			sourceX: 554
		}, 'pipes'));
		
		detector.addTarget(layer.insert('#pipe', {
			y: scene.screen.height - offset,
			offsetY: "-100%",
			sourceX: 502
		}, 'pipes'));
	}, 2000);
	
	function removePipe(pipe) {
		if (pipe.screenXE < 0) {
			layer.remove(pipe);
			detector.removeTarget(pipe);
		}
	}
});
