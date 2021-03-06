(function (window) {
    'use strict';
    //Detecting mobile browser
    //https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    var mobileOrTablet = (function (nav) {
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(nav) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(nav.substr(0, 4));
    }(window.navigator.userAgent || window.navigator.vendor || window.opera)),
        stage, MAX_STAGE = 7, startStage, startGame,
        screenWidth = window.screen.availWidth,
        gameOptions = {
            width: mobileOrTablet ? screenWidth : screenWidth * 0.8,
            objectsDim: {
                width: 50,
                height: 50
            },
            transform: function (d) {
                return "translate(" + [d.x, d.y] + ")";
            },
            colors: ["#2ecc71", "#f1c40f", "#16a085", "#CF000F", "#8e44ad", "#2c3e50", "#d35400", "#52B3D9", "#DB0A5B"],
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
                    if (dataSelected[selected.i] === undefined) {
                        countSelected += 1;
                    }
                    dataSelected[selected.i] = i;
                    connectFibre(selected, d);
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
                "The internet is crashed and you need to merge the fibers ",
                "in the splice distributor to make it work.",
                "Connect the fibres, left side with right side,",
                "correctly to fix it."];

        step = 150;
        for (i = 0; i < text.length; i += 1) {
            addText(gameBoard, gameOptions.width * 0.5, step + (i * 40), text[i], '26pt').attr({'stroke': 'none'});
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
