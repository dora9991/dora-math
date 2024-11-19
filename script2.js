// 変数の定義
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
        const variables = ['x', 'y'];
        const operators = ['+', '-'];
        const numTerms = Math.floor(Math.random() * 2) + 3; // 3または4

        let expression = '';
        let terms = [];
        let operatorsUsed = [];

        for (let i = 0; i < numTerms; i++) {
            let coeff = Math.floor(Math.random() * 11) - 5; // -5から5
            if (coeff === 0) coeff = 1; // 係数が0にならないように
            let variable = variables[Math.floor(Math.random() * variables.length)];

            let term = formatTerm(coeff, variable);
            terms.push({ coeff: coeff, variable: variable });

            if (i === 0) {
                expression += term;
            } else {
                let operator = operators[Math.floor(Math.random() * operators.length)];
                operatorsUsed.push(operator);
                expression += ` ${operator} ${term}`;
            }
        }

        correctAnswer = simplifyExpression(terms, operatorsUsed);

        battleLog.innerHTML += `次の式を簡単にしてください：<br>${expression}<br>`;
        const correctIndex = Math.floor(Math.random() * 4);
        answersDiv.innerHTML = '';

        // 選択肢を2行2列で表示するためのコンテナを作成
        const optionsContainer = document.createElement('div');
        optionsContainer.style.display = 'flex';
        optionsContainer.style.flexWrap = 'wrap';
        optionsContainer.style.justifyContent = 'center';

        let answers = [];

        for (let i = 0; i < 4; i++) {
            const button = document.createElement("button");
            button.style.margin = '5px'; // ボタン間の間隔を設定

            if (i === correctIndex) {
                button.textContent = correctAnswer;
            } else {
                let wrongAnswer;
                do {
                    wrongAnswer = generateWrongAnswer(correctAnswer);
                } while (wrongAnswer === correctAnswer || answers.includes(wrongAnswer));
                button.textContent = wrongAnswer;
            }
            button.onclick = () => checkAnswer(button.textContent);
            optionsContainer.appendChild(button);
            answers.push(button.textContent);
        }

        answersDiv.appendChild(optionsContainer);
    }

    function formatTerm(coeff, variable) {
        if (coeff === 1) return variable;
        if (coeff === -1) return '-' + variable;
        return coeff + variable;
    }

    function simplifyExpression(terms, operatorsUsed) {
        let combinedTerms = { 'x': 0, 'y': 0 };

        // 最初の項を追加
        combinedTerms[terms[0].variable] += terms[0].coeff;

        // 残りの項を処理
        for (let i = 0; i < operatorsUsed.length; i++) {
            let operator = operatorsUsed[i];
            let term = terms[i + 1];

            if (operator === '+') {
                combinedTerms[term.variable] += term.coeff;
            } else if (operator === '-') {
                combinedTerms[term.variable] -= term.coeff;
            }
        }

        // 簡単化された式を構築
        let resultParts = [];

        for (let varName of ['x', 'y']) {
            let coeff = combinedTerms[varName];
            if (coeff === 0) continue;

            let termStr = '';

            if (resultParts.length > 0) {
                if (coeff > 0) {
                    termStr += ' + ';
                } else {
                    termStr += ' - ';
                    coeff = -coeff;
                }
            } else {
                if (coeff < 0) {
                    termStr += '-';
                    coeff = -coeff;
                }
            }

            if (coeff !== 1) {
                termStr += coeff;
            }

            termStr += varName;

            resultParts.push(termStr);
        }

        if (resultParts.length === 0) {
            return '0';
        } else {
            return resultParts.join('');
        }
    }

    function generateWrongAnswer(correctAnswer) {
        // 正解の係数を取得
        let variables = ['x', 'y'];
        let wrongCoefficients = {};

        let coeffs = { 'x': 0, 'y': 0 };
        let tokens = correctAnswer.match(/[+-]?[^+-]+/g); // 項に分割

        for (let token of tokens) {
            token = token.trim();
            let match = token.match(/^([+-]?)(\d*)([xy])$/);
            if (match) {
                let sign = match[1];
                let coeffStr = match[2];
                let varName = match[3];
                let coeff = coeffStr ? parseInt(coeffStr) : 1;
                if (sign === '-') coeff = -coeff;
                coeffs[varName] = coeff;
            }
        }

        // 間違った係数を生成
        for (let varName of variables) {
            let coeff = coeffs[varName];
            let delta = Math.floor(Math.random() * 5) - 2; // -2から2
            if (delta === 0) delta = 1; // 0を避ける
            wrongCoefficients[varName] = coeff + delta;
        }

        // 間違った答えを構築
        let resultParts = [];

        for (let varName of variables) {
            let coeff = wrongCoefficients[varName];
            if (coeff === 0) continue;

            let termStr = '';

            if (resultParts.length > 0) {
                if (coeff > 0) {
                    termStr += ' + ';
                } else {
                    termStr += ' - ';
                    coeff = -coeff;
                }
            } else {
                if (coeff < 0) {
                    termStr += '-';
                    coeff = -coeff;
                }
            }

            if (coeff !== 1) {
                termStr += coeff;
            }

            termStr += varName;

            resultParts.push(termStr);
        }

        if (resultParts.length === 0) {
            return '0';
        } else {
            return resultParts.join('');
        }
    }

    function checkAnswer(selectedAnswer) {
        document.getElementById('battleLog').textContent = '';
        document.getElementById('answers').textContent = '';
        if (selectedAnswer.replace(/\s+/g, '') === correctAnswer.replace(/\s+/g, '')) {
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
