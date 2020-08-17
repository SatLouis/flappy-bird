let game = {
    bgPosition: 0,

    initData: function() {
        this.game = document.getElementById('game');
        this.bird = this.game.getElementsByClassName('bird')[0];
        this.start = this.game.getElementsByClassName('start')[0];
        this.birdTop = parseInt(getComputedStyle(this.bird).top);
        this.birdX = parseInt(getComputedStyle(this.bird).backgroundPositionX);
    },

    interface: function() {
        this.initData();
        let count = 0;
        setInterval(() => {
            if (++count % 10 === 0) {
                this.birdJump();
                this.birdFly();
                this.startBound();
            };
            this.bgMove();
        }, 30)
    },

    bgMove: function() {
        this.game.style.backgroundPositionX = `${this.bgPosition-=2 }px`;
    },

    birdJump: function() {
        this.bird.style.top = `${this.birdTop = this.birdTop === 260 ? 220 : 260}px`;
    },

    birdFly: function() {
        this.bird.style.backgroundPositionX = `${this.birdX = this.birdX - 30}px`;
    },

    startBound: function() {
        this.start.classList.toggle('start-blue')
    }

}


game.interface();