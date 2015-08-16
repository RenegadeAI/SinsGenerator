var resizeEndText = 0;

function resizer() {
    $("#sincount").css('font-size', Math.max(Math.min($("#sincount").width() / (1 * 10), parseFloat(Number.POSITIVE_INFINITY)), parseFloat(Number.NEGATIVE_INFINITY)));
    $("#timer").css('font-size', Math.max(Math.min($("#timer").width() / (1 * 10), parseFloat(Number.POSITIVE_INFINITY)), parseFloat(Number.NEGATIVE_INFINITY)));
    if (resizeEndText) {
        $("#sentence").css('font-size', Math.max(Math.min($("#sentence").width() / (2 * 10), parseFloat(Number.POSITIVE_INFINITY)), parseFloat(Number.NEGATIVE_INFINITY)));
        $("#sintally").css('font-size', Math.max(Math.min($("#sintally").width() / (2 * 10), parseFloat(Number.POSITIVE_INFINITY)), parseFloat(Number.NEGATIVE_INFINITY)));
    }
    while ($("#nav").height() > document.body.clientHeight * 0.1324 && document.body.clientHeight > 386 && $("#nav").css("display") != "none") {
        $("#sincount").css('font-size', parseFloat($("#sincount").css('font-size'), 10) - 1);
        $("#timer").css('font-size', parseFloat($("#timer").css('font-size'), 10) - 1);
    }
}
resizer();
$(window).on('resize', resizer);
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            'controls': 0,
            'showinfo': 0,
            'iv_load_policy': 3
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}
var Sins = {
    times: [],
    addSin: function() {
        this.times.push(("0" + Timer.hours).slice(-2) + ":" + ("0" + Timer.min).slice(-2) + ":" + ("0" + Timer.sec).slice(-2));
        $("#sincount").html(this.count() + "<br>Movie Sin Counter");
        var ding = new Audio("/audio/ding.mp3");
        ding.play();
    },
    count: function() {
        return this.times.length;
    }
}

function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function endSequence() {
    $('body').addClass("endbit");
    $("#top").css("display", "none");
    $("#bottom").css("display", "none");
    $("#endbit").css("display", "table");
    $("#sentence").css('font-size', Math.max(Math.min($("#sentence").width() / (2 * 10), parseFloat(Number.POSITIVE_INFINITY)), parseFloat(Number.NEGATIVE_INFINITY)));
    $("#sintally").css('font-size', Math.max(Math.min($("#sintally").width() / (2 * 10), parseFloat(Number.POSITIVE_INFINITY)), parseFloat(Number.NEGATIVE_INFINITY)));
    setTimeout(function() {
	$("#hits")[0].play();
        $("#MOVIE").css("opacity", "1");
        setTimeout(function() {
            $("#SIN").css("opacity", "1");
            setTimeout(function() {
                $("#TALLY").css("opacity", "1");
                setTimeout(function() {
                    $("#DIGITS").html(Sins.count());
                    $("#DIGITS").css("opacity", "1");
                    setTimeout(function() {
                        $("#SENTENCE").css("opacity", "1");
                        setTimeout(function() {
                            $("#HELL").css("opacity", "1");setTimeout(function(){
				exitFullscreen();
			    },1000);
                        }, 2645);
                    }, 1100);
                }, 580);
            }, 690);
        }, 730);
    }, 500);
    resizeEndText = 1;
}
var Timer = {
    running: 1,
    sec: 0,
    min: 0,
    hours: 0,
    ended: 0,
    init: function() {
        setInterval(Timer.runTheDamnThing, 1000);
    },
    runTheDamnThing: function() {
        if (Timer.running || this.ended) {
            if (Timer.sec === 60) {
                Timer.min++;
                Timer.sec = 0;
            }
            if (Timer.min === 60) {
                Timer.hours++;
                Timer.mins = 0;
            }
            $("#timer").html(("0" + Timer.hours).slice(-2) + ":" + ("0" + Timer.min).slice(-2) + ":" + ("0" + Timer.sec).slice(-2) + "<br>Movie Sin Timer");
            Timer.sec++;
            if (this.ended) {
                this.ended = 0;
            }
        }
    },
    start: function() {
        Timer.running = 1;
    },
    stop: function() {
        Timer.running = 0;
    }
};

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        Timer.stop();
        Timer.ended = 1;
        endSequence();
    }
    else if (event.data == YT.PlayerState.PAUSED) {
        Timer.stop();
    }
    else if (event.data == YT.PlayerState.PLAYING) {
        Timer.start();
    }
}

function launchFullScreen(element) {
    if (element.requestFullScreen) {
        element.requestFullScreen();
    }
    else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
    else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    }
}

function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
        return match[7];
    }
    else {
        return 0;
    }
}
var getVideo = function() {
    var ytVID = youtube_parser($("#videoSource").val());
    if (ytVID) {
        $('body').addClass("running");
        player.loadVideoById(ytVID);
        $("#player").css("display", "block");
        Timer.init();
        $("#player").focus();
        
        $.ajax({
            type: "GET",
            url: "https://www.googleapis.com/youtube/v3/videos?id=" + ytVID + "&key=AIzaSyAoBy89Guk3P1MFPMm403SWYXMBwz7BGww&fields=items(snippet(thumbnails))&part=snippet",
            dataType: "text",
            success: function(data) {
                var json = $.parseJSON(data);
                $.each(json.items, function() {
                    var thumb = this.snippet.thumbnails;
                    var image
                    if(thumb.maxres) {
                        var image = thumb.maxres;
//                        console.log("maxres");
                    }
                    else if (thumb.standard) {
                        var image = thumb.standard;
  //                      console.log("standard");
                    }
                    else if (thumb.high) {
                        var image = thumb.high;
    //                    console.log("high");
                    }
                    else if (thumb.medium) {
                        var image = thumb.medium;
      //                  console.log("medium");
                    }
                    else {
                        var image = thumb.default;
        //                console.log("default");
                    }
         //           console.log(image.url);
                    $("#endbit").css("background-image", "url(" + image.url + ")");
                });
            },
	        error: function() {
	        }
        });
        
        /*
	    $.get( "thumb.php?video_id=" + ytVID, function(maxResAvailable) {
		    if (maxResAvailable) {
			    $("#endbit").css("background-image", "url('http://img.youtube.com/vi/" + ytVID + "/maxresdefault.jpg')");
		    }
            else {
			    $("#endbit").css("background-image", "url('http://img.youtube.com/vi/" + ytVID + "/hqdefault.jpg')");
		    }
	    });
        */
        
        launchFullScreen(document.documentElement);
    }
    else {
        $("#landing-input label").remove();
        $("#landing-input").prepend("<label for='videoSource'>You forgot to add a video!</label>");
        $("#videoSource").focus();
    }
};
