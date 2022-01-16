class SinglePoint {
    constructor(minX, maxX, minY, maxY, group, color) {
        this.x = random(minX, maxX);
        this.y = random(minY, maxY);
        this.group = group;
        this.color = color;
        this.centroidDistance;
        this.groupGuess;
        this.guessedColor;
    }

    show() {
        // stroke(0);
        fill(this.color);
        ellipse(this.x, this.y, 20, 20);
    }   

    paintGuessedGroup(groupColor) {
        fill(groupColor);
        ellipse(this.x, this.y, 10, 10);
    }
}