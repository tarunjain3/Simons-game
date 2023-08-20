var buttonColors = ["red", "blue", "green", "yellow"], gamePattern = [], userClickedPattern = [], level = 0;

function startOver() {
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
}

function playSound(name) {
    var sound = new Audio("sounds/" + name + ".mp3");
    sound.play();
}

function animatePress(name) {
    $("#" + name).addClass("pressed");
    setTimeout(function () {
        $("#" + name).removeClass("pressed");
    }, 100);
}

function nextSequence() {
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColors[randomNumber];
    gamePattern.push(randomChosenColour);

    updateTurnCount();

    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

    playSound(randomChosenColour);
    level++;
    $("#level-title").text("Level " + level);

};

function updateTurnCount() {
    $('#turn-count').text("Moves left: " + userClickedPattern.length + '/' + gamePattern.length);
}


function updateLeaderBoard() {
    const leaderboardList = localStorage.getItem("leaderBoardList");
    if (!leaderboardList) addToLeaderBoard()
    const leaderboardRank = JSON.parse(leaderboardList);
    var leaderboard = $('#leaderboard');
    leaderboard.empty();
    leaderboardRank.forEach((user, idx) => {
        var row = $('<tr>');
        var rank = $('<td>');
        rank.text(idx + 1);
        var name = $('<td>');
        name.text(user.name);
        var level = $('<td>');
        level.text(user.level);
        row.append(rank);
        row.append(name);
        row.append(level);
        leaderboard.append(row);
    });
}
function addToLeaderBoard(userName) {
    const leaderboardList = localStorage.getItem("leaderBoardList");
    if (leaderboardList) {
        const user = {
            name: userName || 'Anonymous',
            level: level
        }
        const leaderboardRank = JSON.parse(leaderboardList);
        leaderboardRank.push(user);
        leaderboardRank.sort((a, b) => b.level - a.level);
        if (leaderboardRank.length > 3) leaderboardRank.pop();
        localStorage.setItem("leaderBoardList", JSON.stringify(leaderboardRank));
    } else {
        localStorage.setItem("leaderBoardList", JSON.stringify([{ name: "", level: "" }]));
    }
    updateLeaderBoard();
    startOver();
}


function handleButtonClick(userChosenColour) {
    userClickedPattern.push(userChosenColour);
    updateTurnCount();

    playSound(userChosenColour);
    animatePress(userChosenColour);
    //check answer
    var clickIdx = userClickedPattern.length - 1

    if (userClickedPattern[clickIdx] !== gamePattern[clickIdx]) {
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").text("Game Over, Press Any Key to Restart");
        const leaderboardList = localStorage.getItem("leaderBoardList");
        const leaderboardRank = JSON.parse(leaderboardList);
        if (level > (leaderboardRank[leaderboardRank.length - 1].level || 0) || leaderboardRank.length < 3) {
            $('#congratulationModal').modal('show');
        }
        else {
            updateLeaderBoard();
            startOver();
        }
        return;
    }
    if (userClickedPattern.length === gamePattern.length) {
        setTimeout(function () {
            userClickedPattern = [];
            nextSequence();
        }, 1000);
    }
}

$('.block-btn').click(function () {
    handleButtonClick($(this).attr('id'));
})

$(document).keypress(function (event) {
    if (!level) nextSequence()
    else {
        if (event.key === "g" || event.key === "G") {
            handleButtonClick("green");
        }
        else if (event.key === "r" || event.key === "R") {
            handleButtonClick("red");
        }
        else if (event.key === "y" || event.key === "Y") {
            handleButtonClick("yellow");
        }
        else if (event.key === "b" || event.key === "B") {
            handleButtonClick("blue");
        }
    }

});