let game = {
  bgPosition: 0,
  isStart: false,
  bgSpeed: 2,
  skyStep: 2,
  birdStepY: 0,
  minTop: 0,
  maxTop: 570,
  pipeLength: 7,
  pipeArr: [],
  pipeLastIndex: 6,
  scoreArr: [],

  initData: function() {
    this.game = document.getElementById('game');
    this.bird = this.game.getElementsByClassName('bird')[0];
    this.birdTop = parseInt(getComputedStyle(this.bird).top);
    this.birdX = parseInt(getComputedStyle(this.bird).backgroundPositionX);
    this.start = this.game.getElementsByClassName('start')[0];
    this.score = this.game.getElementsByClassName('score')[0];
    this.finalScore = this.game.getElementsByClassName('final-score')[0];
    this.mask = this.game.getElementsByClassName('mask')[0];
    this.end = this.game.getElementsByClassName('end')[0];
    this.rankList = this.game.getElementsByClassName('rank-list')[0];
    this.reStart = this.game.getElementsByClassName('restart')[0];
    this.scoreArr = this.getScore();
  },
  getScore: function() {
    let scoreArr = getLocal('score');
    return scoreArr ? scoreArr : [];
  },

  interface: function() {
    this.initData();
    this.animate();
    this.handleStart();
    this.handleClick();
    this.handleReStart();
    if (sessionStorage.getItem('play')) {
      this.startPlay();
    }
  },

  animate: function() {
    let count = 0;
    this.timer = setInterval(() => {
      if (this.isStart) {
        this.birdDrop();
        this.pipeMove();
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

  pipeMove: function() {
    for (let i = 0; i < this.pipeLength; i++) {
      let topPipe = this.pipeArr[i].top,
        bottomPipe = this.pipeArr[i].bottom;
      let x = topPipe.offsetLeft - this.skyStep;

      if (x < -52) {
        let lastPipeLeft = this.pipeArr[this.pipeLastIndex].top.offsetLeft;
        topPipe.style.left = lastPipeLeft + 300 + 'px';
        bottomPipe.style.left = lastPipeLeft + 300 + 'px';

        this.pipeLastIndex = i;

        continue
      }
      topPipe.style.left = x + 'px';
      bottomPipe.style.left = x + 'px';
    }

  },
  createPipe: function(x) {
    let topHeight = 50 + Math.floor(Math.random() * 175);
    let bottomHeight = 450 - topHeight;

    let topPipe = createEle('div', ['pipe', 'pipe-top'], {
      height: topHeight + 'px',
      left: x + 'px',
      top: 0,
    });
    let bottomPipe = createEle('div', ['pipe', 'pipe-bottom'], {
      height: bottomHeight + 'px',
      left: x + 'px',
      bottom: 0,
    });
    this.game.appendChild(topPipe);
    this.game.appendChild(bottomPipe);

    this.pipeArr.push({
      top: topPipe,
      bottom: bottomPipe,
      y: [topHeight, topHeight + 150],
    })
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
    this.addScore();
  },

  addScore: function() {
    let index = this.score.innerText % this.pipeLength;
    let pipeX = this.pipeArr[index].top.offsetLeft;
    if (pipeX < 13) {
      this.score.innerText++;
    }
  },

  judegKnock: function() {
    this.judegBoundary = function() {
      if (this.birdTop >= this.maxTop || this.birdTop <= this.minTop) {
        this.gameOver();
      }
    };
    this.judegBoundary();

    this.judgePipe = function() {
      let index = this.score.innerText % this.pipeLength;
      let pipeX = this.pipeArr[index].top.offsetLeft;
      let pipeY = this.pipeArr[index].y;
      let birdY = this.birdTop;

      if ((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
        this.gameOver();
      }
    };
    this.judgePipe();
  },

  gameOver: function() {
    clearInterval(this.timer);
    this.setScore();

    this.end.style.display = 'block';
    this.mask.style.display = 'block';
    this.bird.style.display = 'none';
    this.score.style.display = 'none';
    this.finalScore.innerText = this.score.innerText;

    this.readerRankList();
  },

  setScore: function() {
    this.scoreArr.push({
      score: this.score.innerText,
      time: this.getDate(),
    });

    this.scoreArr.sort((a, b) => b.score - a.score);

    this.scoreArr.length = this.scoreArr.length > 8 ? 8 : this.scoreArr.length;

    setLocal('score', this.scoreArr);
  },

  getDate: function() {
    let d = new Date(),
      year = d.getFullYear(),
      month = d.getMonth(),
      day = d.getDate(),
      hour = d.getHours(),
      minute = d.getMinutes(),
      second = d.getSeconds();
    second = second.toString().length < 2 ? second = 0 + second.toString() : second;

    return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
  },

  readerRankList: function() {
    let template = '';
    for (let i = 0; i < this.scoreArr.length; i++) {
      switch (i) {
        case 0:
          degreeClass = 'first';
          break;
        case 1:
          degreeClass = 'second';
          break;
        case 2:
          degreeClass = 'third';
          break;
      }

      template += `
           <li class = 'rank-item'>
               <span class='rank-degree ${degreeClass}'>${i + 1}</span>
               <span class='rank-score'>${this.scoreArr[i].score}</span>
               <span class='rank-time'>${this.scoreArr[i].time}</span>
           </li>
           `;
    }
    this.rankList.innerHTML = template;
  },

  handleClick: function() {
    this.game.onclick = () => {
      this.birdStepY = -10;
    }
  },

  handleReStart: function() {
    this.reStart.onclick = () => {
      this.score.style.display = 'block';
      sessionStorage.setItem('play', true);
      window.location.reload();
    }
  },

  handleStart: function() {
    this.start.onclick = (e) => {
      e.stopPropagation();
      this.startPlay();
    };
  },

  startPlay: function() {
    this.score.style.display = 'block';
    this.start.style.display = 'none';
    this.bird.style.transition = 'none';
    this.bird.style.left = 80 + 'px';
    this.bgSpeed = 5;
    this.skyStep = 5;
    this.isStart = true;
    for (let i = 0; i < this.pipeLength; i++) {
      this.createPipe(300 * (i + 1));
    }
  },

}

game.interface();