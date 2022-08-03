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

    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

    playSound(randomChosenColour);
    level++;
    $("#level-title").text("Level " + level);

};
function handleButtonClick(userChosenColour) {
    userClickedPattern.push(userChosenColour);

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
        startOver();
        return;
    }
    if (userClickedPattern.length === gamePattern.length) {
        setTimeout(function () {
            userClickedPattern = [];
            nextSequence();
        }, 1000);
    }
}
$('.btn').click(function () {
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