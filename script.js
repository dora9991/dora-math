let hero = { name: "勇者", hp: 100, attackPower: 50 };
let monster = { name: "ゾーマ", hp: 200, attackPower: 40 };
let correctAnswer;

window.onload = function() {
const screen = document.getElementById('screen');
const game = document.getElementById('game');
const heroHPLabel = document.getElementById("heroHP");
const monsterHPLabel = document.getElementById("monsterHP");
const battleLog = document.getElementById("battleLog");
const answersDiv = document.getElementById("answers");
const monsterImage = document.getElementById("monsterImage");
const restartButton = document.getElementById("restartButton");
const logContainer = document.getElementById('log');


function generateQuestion() {
    const num1 = Math.floor(Math.random() * 20) - 10;
    const num2 = Math.floor(Math.random() * 20) - 10;
    correctAnswer = num1 + num2;

    battleLog.innerHTML += `次の計算の答えは？<br>${num1} + ${num2}?<br>`;
    const correctIndex = Math.floor(Math.random() * 4);
    answersDiv.innerHTML = '';

    for (let i = 0; i < 4; i++) {
        const button = document.createElement("button");
        if (i === correctIndex) {
            button.textContent = correctAnswer;
        } else {
            let wrongAnswer;
            do {
                wrongAnswer = Math.floor(Math.random() * 40) - 10;
            } while (wrongAnswer === correctAnswer);
            button.textContent = wrongAnswer;
        }
        button.onclick = () => checkAnswer(parseInt(button.textContent));
        answersDiv.appendChild(button);
    }
}

function checkAnswer(selectedAnswer) {
    document.getElementById('battleLog').textContent = '';
    document.getElementById('answers').textContent = '';
    if (selectedAnswer === correctAnswer) {
        battleLog.innerHTML += "正解！ " + monster.name + "に"+ hero.attackPower +"のダメージ！<br>";
        monster.hp -= hero.attackPower;
    } else {
        battleLog.innerHTML += "ミス！ " + hero.name + "は"+ monster.attackPower +"のダメージを受けた！<br>";
        hero.hp -= monster.attackPower;
    }

    updateHPLabels();
    checkGameOver();
}

function updateHPLabels() {
    heroHPLabel.textContent = "HP: " + hero.hp;
    monsterHPLabel.textContent = "HP: " + monster.hp;
}

function checkGameOver() {
    if (hero.hp <= 0) {
        battleLog.innerHTML += hero.name + "は" + monster.name + "にやられてしまった！<br>";
        disableButtons(true);
        setHeroHP(0);
        updateHPLabels(); // HPの表示を更新
    } else if (monster.hp <= 0) {
        battleLog.innerHTML += hero.name + "は" + monster.name + "を倒した！<br>";
        document.getElementById("monsterImage").style.display = "none";
        disableButtons(true);
        setMonsterHP(0);
        updateHPLabels();
    } else {
        generateQuestion(); // 新しい問題を生成
    }
}

function disableButtons() {
    const buttons = answersDiv.getElementsByTagName("button");
    for (let button of buttons) {
        button.disabled = true;
    }
}

// HPを代入する関数
function setHeroHP(newHP) {
    hero.hp = newHP; // 新しいHPを代入
}

function setMonsterHP(newHP) {
    monster.hp = newHP; // 新しいHPを代入

}

function isFirstRun(){
    battleLog.innerHTML += monster.name + "が現れた！<br>";
}
;

// ゲーム開始
 // 1秒後にアニメーションを開始
        screen.style.transition = 'opacity 1s ease-in-out'; // トランジションを適用
        screen.style.opacity = "0";
        setTimeout(() => {
            screen.style.display = 'none';
        }, 1000); // 1000ミリ秒 = 1秒
        // 1秒後にゲーム画面を表示
updateHPLabels();
isFirstRun();
generateQuestion();
}

