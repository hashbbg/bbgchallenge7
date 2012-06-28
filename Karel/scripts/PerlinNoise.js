define(["Compose", "Random"], function(Compose, Random) {
	
	var PerlinNoise = Compose(function constructor(width, height) {
		
		// the actual noise
		this.perlinNoise = [];
		
		function generateWhiteNoise(w, h) {
			var noise = [];
			for (var x = 0; x < width; ++x) {
				noise[i] = [];
				for (var y = 0; y < height; ++y) {
					noise[x][y] = Random.getDouble();
				}
			}
			return noise;
		}
		
		function interpolate(x0, x1, alpha) {
			return x0 * (1 - alpha) + alpha * x1;
		}
		
		function generateSmoothNoise(baseNoise, octave) {
			
			var smoothNoise = [];

			var samplePeriod = 1 << octave; // calculates 2 ^ k
			var sampleFrequency = 1.0 / samplePeriod;

			for (var i = 0; i < width; i++) {
				smoothNoise[i] = [];
				
				// calculate the horizontal sampling indices
				var sample_i0 = Math.floor(i / samplePeriod) * samplePeriod;
				var sample_i1 = (sample_i0 + samplePeriod) % width; // wrap around
				var horizontal_blend = (i - sample_i0) * sampleFrequency;

				for (var j = 0; j < height; j++) {
					
					// calculate the vertical sampling indices
					var sample_j0 = Math.floor(j / samplePeriod) * samplePeriod;
					var sample_j1 = (sample_j0 + samplePeriod) % height; // wrap around
					var vertical_blend = (j - sample_j0) * sampleFrequency;
					
					// blend the top two corners
					var top = interpolate(baseNoise[sample_i0][sample_j0], baseNoise[sample_i1][sample_j0], horizontal_blend);
					
					// blend the bottom two corners
					var bottom = interpolate(baseNoise[sample_i0][sample_j1], baseNoise[sample_i1][sample_j1], horizontal_blend);
					
					// final blend
					smoothNoise[i][j] = interpolate(top, bottom, vertical_blend);
				}
			}

			return smoothNoise;
		}
		
		function generatePerlinNoise(baseNoise, int octaveCount) {

			var smoothNoise = []; // an array of 2D arrays containing different octave data

			var persistence = 0.5;

			// generate smooth noise
			for (int i = 0; i < octaveCount; i++) {
				smoothNoise[i] = henerateSmoothNoise(baseNoise, i);
			}

			var perlinNoise = [];
			var amplitude = 1.0;
			var totalAmplitude = 0.0;

			// blend noise together
			for (var octave = octaveCount - 1; octave >= 0; octave--) {
				amplitude *= persistence;
				totalAmplitude += amplitude;
				for (var i = 0; i < width; i++) {
					perlinNoise[i] = [];
					for (var j = 0; j < height; j++) {
						perlinNoise[i][j] += smoothNoise[octave][i][j] * amplitude;
					}
				}
			}

			// normalisation
			for (var i = 0; i < width; i++) {
				for (var j = 0; j < height; j++) {
					perlinNoise[i][j] /= totalAmplitude;
				}
			}
			
			return perlinNoise;
		}
		
		// generate the noise
		this.perlinNoise = generatePerlinNoise(width, height);
	},
	{
		getNoise: function() {
			return this.perlinNoise;
		}
	});
	
	return PerlinNoise;
});