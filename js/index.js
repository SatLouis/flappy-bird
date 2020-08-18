let game = {
    bgPosition: 0,
    isStart: false,
    bgSpeed: 2,
    birdStepY: 0,
    minTop: 0,
    maxTop: 570,
    pipeLength: 7,

    initData: function() {
        this.game = document.getElementById('game');
        this.bird = this.game.getElementsByClassName('bird')[0];
        this.start = this.game.getElementsByClassName('start')[0];
        this.score = this.game.getElementsByClassName('score')[0];
        this.birdTop = parseInt(getComputedStyle(this.bird).top);
        this.birdX = parseInt(getComputedStyle(this.bird).backgroundPositionX);
    },

    interface: function() {
        this.initData();
        this.animate();
        this.handleStart();
        this.handleClick();
    },

    animate: function() {
        let count = 0;
        this.timer = setInterval(() => {
            if (this.isStart) {
                this.birdDrop();
            }
            if (++count % 10 === 0) {
                this.birdFly();
                if (!this.isStart) {
                    this.birdJump();
                    this.startBound();
                }
            };
            this.bgMove();
        }, 30)
    },

    createPipe: function(x) {
        let topHeight = 50 + Math.floor(Math.random() * 175);
        let bottomHeight = 450- topHeight;
        console.log(bottomHeight)

        let topPipe = this.createEle('div', ['pipe', 'pipe-top'], {
            height: topHeight + 'px',
            left: x + 'px',
            top:0,
        });
        let bottomPipe = this.createEle('div', ['pipe', 'pipe-bottom'], {
            height: bottomHeight + 'px',
            left: x + 'px',
            bottom:0,
        });
        this.game.appendChild(topPipe);
        this.game.appendChild(bottomPipe);

    },

    createEle: function(ele, classArr, styleObj) {
        let newEle = document.createElement(ele);

        classArr.forEach(item => {
            newEle.classList.add(item);
        });
        for (let prop in styleObj) {
            newEle.style[prop] = styleObj[prop];
        }
        return newEle;
    },

    bgMove: function() {
        this.game.style.backgroundPositionX = `${this.bgPosition-=this.bgSpeed }px`;
    },

    birdJump: function() {
        this.bird.style.top = `${this.birdTop = this.birdTop === 260 ? 220 : 260}px`;
    },

    birdFly: function() {
        this.bird.style.backgroundPositionX = `${this.birdX = this.birdX - 30}px`;
    },

    startBound: function() {
        this.start.classList.toggle('start-blue')
    },

    birdDrop: function() {
        this.bird.style.top = `${this.birdTop += ++ this.birdStepY}px`;
        this.judegKnock();
    },

    judegKnock: function() {
        this.judegBoundary = function() {
            if (this.birdTop >= this.maxTop || this.birdTop <= this.minTop) {
                this.gameOver();
            }
        };
        this.judegBoundary();
    },


    gameOver: function() {
        clearInterval(this.timer);
    },

    handleClick: function() {
        this.game.onclick = () => {
            this.birdStepY = -10;
        }
    },

    handleStart: function() {
        this.start.onclick = (e) => {
            e.stopPropagation();
            this.score.style.display = 'block';
            this.start.style.display = 'none';
            this.bird.style.transition = 'none';
            this.bird.style.left = 80 + 'px';
            this.bgSpeed = 5;
            this.isStart = true;
            for (let i = 0; i < this.pipeLength; i++) {
                this.createPipe(300*(i + 1));
            }
        };
    }

}


game.interface();