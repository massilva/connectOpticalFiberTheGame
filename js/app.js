(function (window) {
    'use strict';
    var stage, MAX_STAGE = 5, startStage, startGame,
        screenWidth = window.screen.availWidth,
        gameOptions = {
            width: screenWidth * 0.8,
            objectsDim: {
                width: 50,
                height: 50
            },
            transform: function (d) {
                return "translate(" + [d.x, d.y] + ")";
            },
            colors: ["#2ecc71", "#f1c40f", "#16a085", "#c0392b", "#8e44ad", "#2c3e50", "#d35400"],
            defaultColor: "#bdc3c7"
        };

    function clearStage(gameContent) {
        gameContent.select("svg").remove();
    }

    function getGameContent() {
        return d3.select(".content").style({width: gameOptions.width + 'px'});
    }

    function createGameBoard() {
        var gameContent, gameBoard;
        gameContent = getGameContent();
        clearStage(gameContent);
        gameBoard = gameContent.append("svg");
        gameBoard.attr('width', gameOptions.width + 'px');
        gameBoard.classed("h100", true);
        return gameBoard;
    }

    function nextStage() {
        stage += 1;
        startStage(stage);
    }

    function addText(element, x, y, text, fontSize, fontColor) {
        return element.append('text')
            .text(text)
            .attr('x', x)
            .attr('y', y)
            .attr('font-size', fontSize || '10em')
            .attr('fill', fontColor || '#2980b9')
            .attr('text-anchor', 'middle');
    }

    function winStage() {
        var gameBoard = createGameBoard(), nextBtn;
        addText(gameBoard, gameOptions.width * 0.5, 250, 'Stage ' + stage + ' complete', '7em');
        nextBtn = addText(gameBoard, gameOptions.width * 0.5, 400, 'Next', '5em', '#27ae60');
        nextBtn.attr('class', 'btn')
            .on('click', function () {
                if (stage < MAX_STAGE) {
                    nextStage();
                } else {
                    addText(gameBoard, gameOptions.width * 0.5, 350, 'Congrats! finished game');
                }
            });
    }

    function lostStage(dataTarget, hits, max) {
        var gameBoard = createGameBoard(), restartBtn;
        addText(gameBoard, gameOptions.width * 0.5, 150, 'You hit(s)', '5em');
        addText(gameBoard, gameOptions.width * 0.5, 350, hits + ' of ' + max, '10em', 'red');
        restartBtn = addText(gameBoard, gameOptions.width * 0.5, 450, 'Restart', '5em');
        restartBtn.attr('class', 'btn')
            .on('click', function () {
                gameBoard.selectAll('text').remove();
                startGame(gameBoard, dataTarget, max);
            });
    }

    function endGame(dataTarget, dataSelected, max) {
        var i, hits = 0;
        for (i = 0; i < dataSelected.length; i += 1) {
            if (dataTarget[i] === dataSelected[i]) {
                hits += 1;
            }
        }
        if (hits === max) {
            winStage();
        } else {
            lostStage(dataTarget, hits, max);
        }
    }

    function shuffleArray(arr) {
        var j, x, i, newArr = [];
        for (i = arr.length - 1; i >= 0; i -= 1) {
            newArr[i] = arr[i];
        }
        for (i = newArr.length - 1; i >= 0; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = newArr[i];
            newArr[i] = newArr[j];
            newArr[j] = x;
        }
        return newArr;
    }

    function getLineId(idx) {
        return 'line-' + idx;
    }

    function drawElements(source, target, gameOptions) {
        var elements = {
            source: [],
            target: []
        };

        elements.source = source.enter().append("g")
            .attr({
                "transform" : gameOptions.transform,
                'class' : 'fibreSource'
            });
        elements.source.append("rect")
            .attr({
                "width": gameOptions.objectsDim.width,
                "height": gameOptions.objectsDim.height,
                "fill": function (d, i) {
                    return gameOptions.colors[i];
                },
                "opacity": 0.75
            });

        elements.target = target.enter().append("g")
            .attr({
                "transform" : gameOptions.transform,
                'class' : 'fibreTarget'
            });
        elements.target.append("rect")
            .attr({
                "width": gameOptions.objectsDim.width,
                "height": gameOptions.objectsDim.height,
                "fill": gameOptions.defaultColor
            });
        return elements;
    }

    function getPositionsElements(len, gameOptions) {
        var i, data;
        data = {
            source: [],
            target: []
        };
        for (i = 0; i < len; i += 1) {
            data.source.push({x: 10, y: gameOptions.objectsDim.height * i + (i + 1) * 10});
            data.target.push({x: gameOptions.width - gameOptions.objectsDim.width - 10, y: gameOptions.objectsDim.height * i + (i + 1) * 10});
        }
        return data;
    }

    startGame = function (gameBoard, dataTarget, max) {
        var dataGraphic = {}, dataSelected = [], countSelected = 0,
            target, source, selected,
            centerObj = {
                x : gameOptions.objectsDim.width / 2,
                y : gameOptions.objectsDim.height / 2
            },
            connectFibre = function (fibreSource, fibreTarget) {
                gameBoard.insert("line", ":first-child")
                    .attr('x1', centerObj.x + fibreSource.d.x)
                    .attr('y1', centerObj.y + fibreSource.d.y)
                    .attr('x2', centerObj.x + fibreTarget.x)
                    .attr('y2', centerObj.y + fibreTarget.y)
                    .attr('stroke-width', 5)
                    .attr('stroke', 'black')
                    .attr('id', getLineId(fibreSource.i));
            };

        //Load data elements
        dataGraphic = getPositionsElements(max, gameOptions);
        source = gameBoard.selectAll("g.fibre").data(dataGraphic.source);
        target = gameBoard.selectAll("g.fibre").data(dataGraphic.target);
        drawElements(source, target, gameOptions);
        /**
        * Click events
        */
        d3.selectAll('.fibreSource rect').on("click", function (d, i) { // fn(d, i)
            var g = this.parentNode;
            d3.select(g).classed("selected", true);
            selected = {d: d, i: i};
        });
        d3.selectAll('.fibreTarget rect').on("click", function (d, i) {
            var previouslySelected;
            if (selected) {
                previouslySelected = d3.selectAll('g[data-source="' + selected.i + '"]');
                target = this.parentNode;
                target.parentNode.appendChild(target);
                target = d3.select(target);
                if (!target.attr('data-source')) { //Not has selected
                    previouslySelected.attr('data-source', '').classed("selected", false);
                    previouslySelected.select("rect").attr('fill', gameOptions.defaultColor);
                    d3.selectAll('#' + getLineId(selected.i)).remove();
                    target.classed("selected", true);
                    target.attr('data-source', selected.i);
                    target.select("rect").attr('fill', gameOptions.colors[selected.i]);
                    dataSelected[selected.i] = i;
                    connectFibre(selected, d);
                    countSelected += 1;
                    if (countSelected === max) {
                        endGame(dataTarget, dataSelected, max);
                    }
                }
            }
        });
    };

    startStage = function (stage) {

        var i, max = stage + 2,
            data = {},
            gameBoard;

        data = {source: [], target: []};
        for (i = 0; i < max; i += 1) {
            data.source[i] = i;
        }
        data.target = shuffleArray(data.source);

        //Load game board
        gameBoard = createGameBoard();
        startGame(gameBoard, data.target, max);

    };

    function introductionGame() {
        var i, step, gameBoard = createGameBoard(), startBtn,
            text = ["Your internet is connected via optical fiber cable.",
                "The internet crashed and you need to merge the fibers ",
                "in the splice distributor to make it work.",
                "Connect the fibres, left side with right side,",
                "correctly to fix it."];

        step = 150;
        for (i = 0; i < text.length; i += 1) {
            addText(gameBoard, gameOptions.width * 0.5, step + (i * 40), text[i], '3em').attr('stroke', 'none');
        }
        startBtn = addText(gameBoard, gameOptions.width * 0.5, 400, 'Start Game', '5em', '#27ae60');
        startBtn.attr('class', 'btn')
            .on('click', function () {
                startStage(stage);
            });
    }

    function firstPage() {
        stage = 0;
        introductionGame();
    }

    firstPage();
}(window));
