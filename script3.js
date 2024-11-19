// JavaScriptコード（積分計算版）

// 変数の定義
let hero = { name: "勇者", hp: 100, attackPower: 50 };
let monster = { name: "魔王", hp: 200, attackPower: 40 };
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
        const functions = [
            { question: '∫ x dx', answer: '1/2 x^2 + C' },
            { question: '∫ x^2 dx', answer: '1/3 x^3 + C' },
            { question: '∫ sin(x) dx', answer: '-cos(x) + C' },
            { question: '∫ cos(x) dx', answer: 'sin(x) + C' },
            { question: '∫ e^x dx', answer: 'e^x + C' },
            { question: '∫ 1/x dx', answer: 'log|x| + C' },
            { question: '∫ 2x dx', answer: 'x^2 + C' },
            { question: '∫ sec^2(x) dx', answer: 'tan(x) + C' },
            { question: '∫ csc^2(x) dx', answer: '-cot(x) + C' },
            { question: '∫ 0 dx', answer: 'C' }
        ];

        // ランダムに問題を選択
        const index = Math.floor(Math.random() * functions.length);
        const selectedFunction = functions[index];
        correctAnswer = selectedFunction.answer;

        battleLog.innerHTML += `次の不定積分の答えは？：<br>${selectedFunction.question}<br>`;
        const correctIndex = Math.floor(Math.random() * 4);
        answersDiv.innerHTML = '';

        // 選択肢を2行2列で表示するためのコンテナを作成
        const optionsContainer = document.createElement('div');
        optionsContainer.style.display = 'flex';
        optionsContainer.style.flexWrap = 'wrap';
        optionsContainer.style.justifyContent = 'center';
        optionsContainer.style.width = '100%';

        let answers = [];

        for (let i = 0; i < 4; i++) {
            const button = document.createElement("button");
            button.style.margin = '5px';
            button.style.padding = '20px';
            button.style.fontSize = '24px';
            button.style.width = '45%';
            button.style.boxSizing = 'border-box';

            if (i === correctIndex) {
                button.textContent = correctAnswer;
            } else {
                let wrongAnswer;
                do {
                    wrongAnswer = generateWrongAnswer();
                } while (wrongAnswer === correctAnswer || answers.includes(wrongAnswer));
                button.textContent = wrongAnswer;
            }
            button.onclick = () => checkAnswer(button.textContent);
            optionsContainer.appendChild(button);
            answers.push(button.textContent);
        }

        answersDiv.innerHTML = '';
        answersDiv.appendChild(optionsContainer);
    }

    function generateWrongAnswer() {
        const wrongAnswers = [
            'x + C',
            '-x + C',
            '1/x + C',
            'log(x) + C',
            '-log|x| + C',
            '-1/2 x^2 + C',
            'e^{-x} + C',
            '-e^x + C',
            'cos(x) + C',
            'sin(x) + C',
            'tan(x) + C',
            '-cot(x) + C',
            'C',
            '1/2 x + C',
            'x^2 + C',
            'x^3 + C'
        ];
        const index = Math.floor(Math.random() * wrongAnswers.length);
        return wrongAnswers[index];
    }

    function checkAnswer(selectedAnswer) {
        document.getElementById('battleLog').textContent = '';
        document.getElementById('answers').textContent = '';
        if (selectedAnswer === correctAnswer) {
            battleLog.innerHTML += "正解！ " + monster.name + "に" + hero.attackPower + "のダメージ！<br>";
            monster.hp -= hero.attackPower;
        } else {
            battleLog.innerHTML += "ミス！ " + hero.name + "は" + monster.attackPower + "のダメージを受けた！<br>";
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
            disableButtons();
            setHeroHP(0);
            updateHPLabels();
        } else if (monster.hp <= 0) {
            battleLog.innerHTML += hero.name + "は" + monster.name + "を倒した！<br>";
            document.getElementById("monsterImage").style.display = "none";
            disableButtons();
            setMonsterHP(0);
            updateHPLabels();
        } else {
            generateQuestion();
        }
    }

    function disableButtons() {
        const buttons = answersDiv.getElementsByTagName("button");
        for (let button of buttons) {
            button.disabled = true;
        }
    }

    function setHeroHP(newHP) {
        hero.hp = newHP;
    }

    function setMonsterHP(newHP) {
        monster.hp = newHP;
    }

    function isFirstRun() {
        battleLog.innerHTML += monster.name + "が現れた！<br>";
    }

    // ゲーム開始
    screen.style.transition = 'opacity 1s ease-in-out';
    screen.style.opacity = "0";
    setTimeout(() => {
        screen.style.display = 'none';
    }, 1000);

    updateHPLabels();
    isFirstRun();
    generateQuestion();
}
