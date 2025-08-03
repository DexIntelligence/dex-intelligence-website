// Voronoi Diagram Background Animation
class VoronoiBackground {
    constructor() {
        this.canvas = document.getElementById('voronoi-background');
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.numPoints = 12; // Fewer points for subtlety
        this.animationSpeed = 0.0008; // Very slow animation
        
        this.init();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.generatePoints();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    generatePoints() {
        this.points = [];
        for (let i = 0; i < this.numPoints; i++) {
            this.points.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3, // Very slow movement
                vy: (Math.random() - 0.5) * 0.3,
                originalX: 0,
                originalY: 0
            });
            this.points[i].originalX = this.points[i].x;
            this.points[i].originalY = this.points[i].y;
        }
    }
    
    updatePoints() {
        this.points.forEach(point => {
            point.x += point.vx;
            point.y += point.vy;
            
            // Gentle boundary bounce
            if (point.x < 0 || point.x > this.canvas.width) {
                point.vx *= -1;
                point.x = Math.max(0, Math.min(this.canvas.width, point.x));
            }
            if (point.y < 0 || point.y > this.canvas.height) {
                point.vy *= -1;
                point.y = Math.max(0, Math.min(this.canvas.height, point.y));
            }
        });
    }
    
    drawVoronoi() {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Very light grey colors for subtlety
        const colors = [
            [25, 25, 25],   // Very dark grey
            [30, 30, 30],   // Slightly lighter
            [20, 20, 20],   // Darker
            [35, 35, 35],   // Light grey
        ];
        
        for (let x = 0; x < this.canvas.width; x += 2) { // Skip pixels for performance
            for (let y = 0; y < this.canvas.height; y += 2) {
                let minDist = Infinity;
                let closestPointIndex = 0;
                
                // Find closest point
                this.points.forEach((point, index) => {
                    const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
                    if (dist < minDist) {
                        minDist = dist;
                        closestPointIndex = index;
                    }
                });
                
                const colorIndex = closestPointIndex % colors.length;
                const color = colors[colorIndex];
                
                // Set pixel color (with 2x2 blocks for performance)
                for (let dx = 0; dx < 2 && x + dx < this.canvas.width; dx++) {
                    for (let dy = 0; dy < 2 && y + dy < this.canvas.height; dy++) {
                        const pixelIndex = ((y + dy) * this.canvas.width + (x + dx)) * 4;
                        data[pixelIndex] = color[0];     // R
                        data[pixelIndex + 1] = color[1]; // G
                        data[pixelIndex + 2] = color[2]; // B
                        data[pixelIndex + 3] = 255;      // A
                    }
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    animate() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updatePoints();
        this.drawVoronoi();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VoronoiBackground();
});