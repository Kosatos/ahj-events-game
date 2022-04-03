import enemyImg from '../img/bensolo.png';

export default class GamePlay {
  constructor(field, cell) {
    this.field = document.getElementById(`${field}`);
    this.boxes = [...this.field.querySelectorAll(`.${cell}`)];
    this.activeBox = null;
    this.score = 0;
    this.scoreCounter = document.querySelector('#score');
    this.skips = 0;
    this.skipCounter = document.querySelector('#skip');
    this.hit = false;
    this.gameTimer = null;

    this.boxes.forEach((box) => {
      box.addEventListener('click', (e) => {
        this.addScore(e);
      });
    });

    document.getElementById('btn-start').addEventListener('click', () => {
      this.startGame();
    });
  }

  startGame() {
    this.activeBox = null;
    this.score = 0;
    this.scoreCounter.textContent = this.score;
    this.skips = 0;
    this.skipCounter.textContent = this.skips;
    this.hit = false;
    this.gameTimer = null;

    clearInterval(this.gameTimer);
    this.showEnemyInterval(1000);
  }

  // getRandom выбирает рандомную ячейку для появления врага, исключая предыдущую ячейку

  getRandom() {
    const random = Math.floor(Math.random() * this.boxes.length);
    if (random === this.activeBox) {
      this.getRandom();
    } else {
      this.activeBox = random;
      this.boxes[this.activeBox].classList.toggle('active-box');
    }
  }

  // showEnemy удаляет из игрового поля врага, если он там был,
  // ищет случайнную ячейку и добавляет в нее врага

  showEnemy() {
    if (document.getElementById('enemy')) {
      document.getElementById('enemy').remove();
      this.boxes[this.activeBox].classList.toggle('active-box');
      this.hit = false;
    }

    this.getRandom();
    const enemy = new Image();
    enemy.src = enemyImg;
    enemy.id = 'enemy';
    enemy.classList.add('enemy');
    this.boxes[this.activeBox].appendChild(enemy);
  }

  // showEnemyInterval добавляет интервал со скоростью speed,
  // по которому будет показывать врага в случайных ячейках,
  // по окончании интервала проверяет состояние врага hits,
  // и если был пропуск увеличивает количество пропусков skips,
  // после 5 пропусков заканчивает игру

  showEnemyInterval(speed) {
    this.gameTimer = setInterval(() => {
      this.showEnemy();
      setTimeout(() => {
        if (this.hit === false) {
          this.skips += 1;
          this.skipCounter.textContent = this.skips;

          if (this.skips === 5) {
            clearInterval(this.gameTimer);
            alert('Игра окончена! Силы тьмы победили...'); // eslint-disable-line no-alert
          }
        }
      }, speed);
    }, speed);
  }

  // addScore проверяет состояние ячейки при клике, если в ней есть враг,
  // прибавляет очки score и меняет состояние врага hit, после 10 попададаний заканчивает игру

  addScore(e) {
    if (e.currentTarget.classList.contains('active-box')) {
      this.score += 1;
      this.scoreCounter.textContent = this.score;

      if (this.score === 10) {
        clearInterval(this.gameTimer);
        alert('Игра окончена! Силы тьмы уничтожены...'); // eslint-disable-line no-alert
      }

      this.boxes[this.activeBox].classList.toggle('active-box');
      document.getElementById('enemy').remove();

      this.hit = true;
    }
  }
}
