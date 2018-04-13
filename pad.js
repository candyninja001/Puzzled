var colors = ['blue', 'green', 'red', 'light', 'dark', 'heart']
  , colorsbak = ['blue', 'green', 'red', 'light', 'dark', 'heart']
  , colors2 = ['blue', 'green', 'red', 'light', 'dark', 'heart', 'poison', 'jammer', 'xbomb', 'mortalpoison', 'unknown']
  , colorsSpin = ['green', 'light', 'blue', 'dark', 'heart', 'red', 'red', 'red', 'red', 'red', 'unknown']
  , colorsCross = ['blue', 'green', 'red', 'light', 'dark', 'heart', 'poison', 'jammer', 'xbomb', 'mortalpoison', 'unknown']
  , colors3 = ['blue', 'green', 'red', 'light', 'dark']
  , divs = []
  , clouds = []
  , savedBoardState = []
  , savedPlusState = []
  , savedLockState = []
  , savedBlindState = []
  , savedSwapperState = []
  , savedCloudState = []
  , changeTheWorldOn = 0
  , timerOn = 0
  , defaultDropSpeed = 400
  , dropSpeed = defaultDropSpeed
  , fieldDropTimer = 100
  , scale = 90
  , offsetMargin = 0
  , cornerspace = 20
  , rows = 6
  , cols = 5
  , scoreTracker = []
  , swapHasHappened = 0
  , timeOut = []
  , ctwTimeOut = []
  , myMonsters = 6
  , freeToPlay = 0
  , skyFall = 0
  , showReplayArrows = 1
  , timerTime = 4000
  , toDrop = 0
  , showComboItems = true
  , shortenedData = []
  , ajaxErrorOccured = 0
  , randomizeMatchedOrbs = false
  , shuffleInstead = false
  , minimumMatched = 2
  , minimumMatches = 2
  , startPosition = false
  , spinnerTimer = 1000
  , isMobile = false;
function setUpMobile() {
    //scale = ($(window).width() - 40) / 6 ;
	var windowX = $(window).width(); 	
	var windowY = $(window).width()*616/750;
	var scaleX = Math.floor(windowX / rows);
	var scaleY = Math.floor(windowY / cols);
	scale = Math.min(scaleX, scaleY);
	var diffX = windowX - (scaleX * rows)
	var diffY = windowY - (scaleY * cols)
	var ghostX = Math.floor(windowX / 5); // size of the ghost orb when moving orbs on the board
	var ghostY = Math.floor(windowY / 4);
	var ghost = Math.min(ghostX, ghostY);
	cornerspace = scale*20/90;
	//scale = Math.floor($(window).width() / rows);
	document.getElementById("mobilesizesheet").innerHTML = "svg { height: "+scale*1.2+"px; width: "+scale*1.2+"px; left: -"+scale*0.1+"px; top: -"+scale*0.1+"px; background-size: "+scale+"px; } .cloud { height: "+scale+"px; width: "+scale+"px; } .cloud.show::after { height: "+scale*2+"px; width: "+scale*2+"px; left: -"+scale/2+"px; top: -"+scale/2+"px; } #revealOrbs { position: absolute; height: "+scale+"px; width: "+scale+"px; top: -"+(scale+20)+"px; right: 0px; background-image:url('https://discordapp.com/assets/53ef346458017da2062aca5c7955946b.svg'); background-size:100%; } #game { position: relative; top: "+diffY/2+"px; margin: auto auto auto auto; } .tile { height: "+scale+"px; width: "+scale+"px; } #board { background-image:url('boardbackground.png'); background-size:"+scale*2+"px "+scale*2+"px; height: "+scale*cols+"px; width: "+scale*rows+"px; border:0px; } #scrolls.vertical>#scroll.left { width: "+scale+"px; } #scrolls.vertical>#scroll.right { width: "+scale+"px; } #scrolls.vertical>.play { width: calc(100% - "+scale+"px); } #scrolls.horizontal>#scroll.top { height: "+scale+"px; } #scrolls.horizontal>#scroll.bottom { height: "+scale+"px; } #scrolls.horizontal>.play { height: calc(100% - "+scale+"px); } #scrolls.vertical>#scroll::after { background-size: "+scale*0.59375+"px "+scale*2+"px; } #scrolls.horizontal>#scroll::after { background-size: "+scale*2+"px "+scale*0.59375+"px; } .cornerblock{ width: "+scale*2/9+"px; height: "+scale*2/9+"px; position: absolute; top: -"+scale/90+"px; }";
	document.getElementById("mobilesheet").href = "mobile.css";
	document.getElementById("mobileentrysheet").innerHTML = "#entry,#plusEntry,#lockEntry,#blindEntry,#swapperEntry,#cloudEntry { width: calc(100vw * "+rows*70/6+" / 630); height: calc(100vw * "+cols*120/5+" / 630); }";
}
function hideUnit(obj) {
    var link = document.getElementById(obj);
    link.style.display = 'none';
    return false;
}
function toObject(arr) {
    var rv = {};
    for (var i = 0; i < arr.length; ++i)
        if (arr[i] !== undefined)
            rv[i] = arr[i];
    return rv;
}
function inverObject(obj) {
    var result = {};
    for (var key in obj)
        if (hasOwnProperty.call(obj, key))
            result[obj[key]] = key;
    return result;
}
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
}
;
function convertPosition(x, y) {
    return (y * rows + x * 1);
}
function convertXY(position, single) {
    if (single == 'x')
        return position % rows;
    if (single == 'y')
        return Math.floor(position / rows);
    return [position % rows, Math.floor(position / rows)];
}
function randomColor(check) {
    var randomIndex;
    if (check == 1) {
        randomIndex = Math.floor(Math.random() * colors3.length);
        return colors[randomIndex];
    } else
        randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}
jQuery.fn.swap = function(b, trigger) {
    b = jQuery(b)[0];
    var a = this[0];
    var t = a.parentNode.insertBefore(document.createTextNode(''), a);
    b.parentNode.insertBefore(a, b);
    t.parentNode.insertBefore(b, t);
    t.parentNode.removeChild(t);
	var flagA = a.classList.contains('swapper');
	var flagB = b.classList.contains('swapper');
	a.classList.remove('swapper');
	b.classList.remove('swapper');
	if(flagA)
		b.classList.add('swapper');
	if(flagB)
		a.classList.add('swapper');
	a.classList.remove('blind');
	b.classList.remove('blind');
    if (trigger == 2) {
        if (swapHasHappened == 0)
            replayMoveSet.push(((b.offsetTop - b.parentNode.offsetTop - offsetMargin) / scale) * rows + ((b.offsetLeft - b.parentNode.offsetLeft - offsetMargin) / scale));
        replayMoveSet.push(((a.offsetTop - a.parentNode.offsetTop - offsetMargin) / scale) * rows + ((a.offsetLeft - a.parentNode.offsetLeft - offsetMargin) / scale));
    }
    return this;
}
;
function displayOutput(content, clear) {
    if (typeof clear === "undefined")
        clear = 0;
    if (clear == 0)
        document.getElementById("infobooth").innerHTML = content;
    else if (clear == 2)
        document.getElementById("infobooth").innerHTML = content + document.getElementById("infobooth").innerHTML;
    else
        document.getElementById("infobooth").innerHTML += content;
}
function toColor(letter, colorSet) {
    letter = letter.toLowerCase();
    if (colorSet == 1)
        colorSet = colors.slice();
    else
        colorSet = colors2.slice();
    for (var g = 0; g < colors2.length; g++) {
        if (letter == colors2[g].charAt(0))
            return colors2[g];
    }
    return 0;
}
function propertyToState(property, letter) {
    letter = letter.toLowerCase();
	if (property == 'plus' && letter == 'p')
		return true;
	if (property == 'lock' && letter == 'l')
		return true;
	if (property == 'blind' && letter == 'b')
		return 'blind';
	if (property == 'blind' && letter == 'd')
		return 'blind-duration';
	if (property == 'swapper' && letter == 's')
		return true;
	if (letter == '.')
		return false;
    return '?';
}
function cloudToState(letter) {
    letter = letter.toLowerCase();
    if (letter == 'c')
		return true;
	if (letter == '.')
		return false;
    return '?';
}
function toLetter(color) {
    for (var g = 0; g < colors2.length; g++) {
        if (color == colors2[g])
            return colors2[g].charAt(0);
    }
    return 0;
}
function cloudToletter(state) {
    if(state == true)
		return 'c';
    return '.';
}
function propertyToLetter(property, state) {
	if (state == false)
		return '.';
	if (property == 'plus')
		return 'p';
	if (property == 'lock')
		return 'l';
	if (property == 'blind'){
		if (state == 'blind')
			return 'b';
		else if (state == 'blind-duration')
			return 'd';
		else 
			return '.';
	}
	if (property == 'swapper')
		return 's';
    return '.';
}
function getTiles() {
    divs = document.getElementsByClassName('tile');
}
function getProperies(property) { // TODO
    divs = document.getElementsByClassName('tile'); // This should work?
}
function getClouds() {
    clouds = document.getElementsByClassName('cloud');
}
function trackScore(matches, bombScoreCheck=0) {
    for (var i = 0; i < matches.length; i++) {
        if (bombScoreCheck == 1) {
            if (divs[matches[i][0]].getAttribute('tileColor') == 'xbomb')
                scoreTracker[divs[matches[i][0]].getAttribute('tileColor')].push([matches[i].length]);
        } else
            scoreTracker[divs[matches[i][0]].getAttribute('tileColor')].push([matches[i].length]);
    }
}
function clearMemory(item) {
    if (item == 'score') {
        for (var i = 0; i < colors2.length; i++) {
            scoreTracker[colors2[i]] = [];
        }
    }
    if (item == 'timeout') {
        for (i = 0; i < timeOut.length; i++) {
            clearTimeout(timeOut[i]);
        }
        timeOut = new Array();
    }
    if (item == 'arrows') {
        document.getElementById("arrowSurface").width = document.getElementById("arrowSurface").width + 1;
        document.getElementById("arrowSurface").width = document.getElementById("arrowSurface").width - 1;
    }
    if (item == 'ctw') {
		for (i = 0; i < ctwTimeOut.length; i++) {
            clearTimeout(ctwTimeOut[i]);
        }
        ctwTimeOut = new Array();
    }
}
function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function unCapitaliseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
function toggle(item, command) {
    if (item == 'timer') {
        if (timerOn == 0) {
            timerOn = 1;
            displayOutput('Timer starts on click (stays on)<br />');
            reset();
            $("#image4").show();
            $("#image5").show();
        } else {
            timerOn = 0;
            displayOutput('Timer off<br />');
            document.getElementById('time').innerHTML = 'Unlimited';
            $("#image4").hide();
            $("#image5").hide();
        }
    }
    if (item == 'damage') {
        if (document.getElementById("damage").style.display == 'none')
            document.getElementById("damage").style.display = 'block';
        else
            document.getElementById("damage").style.display = 'none';
    }
    if (item == 'draggable') {
        if (command == 2) //return true if an orb is movable;
            return !$(".tile").draggable("option", "disabled") || !$(".tile.fixed-start").draggable("option", "disabled");
		if (!startPosition) {
			$(".tile").removeClass('fixed-start');
			$(".tile").removeClass('no-start');
		}
        if (command == 1)
			if (changeTheWorldOn) {
				setTimeout(function() {
					$(".tile").draggable("option", "disabled", false);
				}, 5);
			} else if (startPosition) {
				setTimeout(function() {
					$(".tile").each(function() {
						if ($(".tile").index($(this)) == startPosition) {
							$(this).draggable("option", "disabled", false);
							$(this).addClass('fixed-start')
						} else {
							$(this).draggable("option", "disabled", true);
							$(this).addClass('no-start')
						}
					});
				}, 5);
			} else {
				setTimeout(function() {
					$(".tile").draggable("option", "disabled", false);
				}, 5);
			}
        else
            setTimeout(function() {
                $(".tile").draggable("option", "disabled", true);
            }, 5);
    }
    if (item == 'skyfall') {
        if (skyFall == 0) {
            skyFall = 1;
            displayOutput('!!WARNING!! Skyfall is currently untested. !!WARNING!!<br /><br />Skyfall enabled.<br /><br />You will now be able to extra turns. Press SkyFall again to disable this. Replays will not save which orbs fall');
        } else {
            skyFall = 0;
            displayOutput('Skyfall has been disabled');
        }
    }
    if (item == 'boardcolor') {
        temp23 = '';
        var index;
        for (index = 0; index < colors.length; ++index) {
            if (capitaliseFirstLetter(colors[index]) == command) {
                temp23 = '1';
                colors.splice(index, 1);
                break;
            }
        }
        if (temp23 != '1')
            colors.push(unCapitaliseFirstLetter(command));
		//  re-enable if important
        //document.getElementById('bc' + command).style.backgroundImage = "url('" + command + temp23 + ".png')";
		if(temp23 == '1'){
			document.getElementById('bc' + command).style.filter = "grayscale(100%)";
		}else{
			document.getElementById('bc' + command).style.filter = "";
		}
    }
	if (item == 'cross') {
        temp23 = '';
        var index;
        for (index = 0; index < colorsCross.length; ++index) {
            if (capitaliseFirstLetter(colorsCross[index]) == command) {
                temp23 = '1';
                colorsCross.splice(index, 1);
                break;
            }
        }
        if (temp23 != '1')
            colorsCross.push(unCapitaliseFirstLetter(command));
		//  re-enable if important
        //document.getElementById('cross' + command).style.backgroundImage = "url('" + command + temp23 + ".png')";
		if(temp23 == '1'){
			document.getElementById('cross' + command).style.filter = "grayscale(100%)";
			$('.tile.' + unCapitaliseFirstLetter(command)).addClass('cross');
		}else{
			document.getElementById('cross' + command).style.filter = "";
			$('.tile.' + unCapitaliseFirstLetter(command)).removeClass('cross');
		}
    }
    if (item == 'replayarrows') {
        if (command == 0) {
            showReplayArrows = 0;
            displayOutput('Setting changed: Replay Arrows Off');
        } else {
            showReplayArrows = 1;
            displayOutput('Setting changed: Replay Arrows On');
        }
    }
    if (item == 'showComboItems') {
        if (command == 0) {
            showComboItems = false;
            displayOutput('Setting changed: Showing combo results with icons');
        } else {
            showComboItems = true;
            displayOutput('Setting changed: Showing combo results with text');
        }
    }
    if (item == 'randomizeMatchedOrbs') {
        if (command == 0) {
            randomizeMatchedOrbs = false;
            displayOutput('Setting changed: Random boards cannot contain matches');
        } else {
            randomizeMatchedOrbs = true;
            displayOutput('Setting changed: Random boards can now contain matches');
        }
    }
    if (item == 'shuffleInstead') {
        if (command == 0) {
            shuffleInstead = false;
            document.getElementById('random').innerHTML = 'Random';
            displayOutput('Setting changed: Randomize boards instead of shuffling');
        } else {
            shuffleInstead = true;
            document.getElementById('random').innerHTML = 'Shuffle';
            displayOutput('Setting changed: Shuffle boards instead of randomizing');
        }
    }
    if (item == 'minimumCombo') {
        minimumMatches = command;
        displayOutput('Setting changed: Minimum combo is now ' + (parseInt(command) + 1) + '.');
    }
}
function setTileAttribute(i, tileColor, opacity, classless, bombbomb=0, convert=1) {
	var plus = divs[i].classList.contains('plus') ? ' plus' : '';
	var lock = divs[i].classList.contains('lock') ? ' lock' : '';
	var blind = divs[i].classList.contains('blind-duration') ? ' blind-duration' : (divs[i].classList.contains('blind') ? ' blind' : '');
	var swap = divs[i].classList.contains('swapper') ? ' swapper' : '';
	var reveal = divs[i].classList.contains('reveal') ? ' reveal' : '';
	var cross = ' cross';
	//console.log('l: ' + );
	for (index = 0; index < colorsCross.length; ++index) {
        if (unCapitaliseFirstLetter(colorsCross[index]) == tileColor) {
            cross = '';
        }
    }
	if (convert == 0){
        if (classless != 1)
            divs[i].setAttribute('class', 'tile ' + tileColor + cross + swap); //TODO see if cross belongs here
        divs[i].setAttribute('tileColor', tileColor);
        divs[i].setAttribute('tileopacity', opacity);
	} else {
		if (classless != 1)
            divs[i].setAttribute('class', 'tile ' + tileColor + cross + plus + lock + blind + swap + reveal);
        divs[i].setAttribute('tileColor', tileColor);
        divs[i].setAttribute('tileopacity', opacity);
	}
//    if (bombbomb == 0) {
//        if (classless != 1)
//            divs[i].setAttribute('class', 'tile ' + tileColor + plus + lock + blind);
//        divs[i].setAttribute('tileColor', tileColor);
//        divs[i].setAttribute('style', 'opacity:' + opacity);
//    } else if (divs[i].getAttribute('tileColor') == 'xbomb') { // NOTE there used to be two categories of functions here, one for bombs the other for non-bombs. I removed them since they were identical.
//        if (classless != 1)
//            divs[i].setAttribute('class', 'tile ' + tileColor + plus + lock + blind);
//        divs[i].setAttribute('tileColor', tileColor);
//        divs[i].setAttribute('style', 'opacity:' + opacity);
//    }
}
function setCloudStatus(i, visible) {
    if (visible == true)
		clouds[i].classList.add('show');
	else
		clouds[i].classList.remove('show');
}
function setProperty(i, property, state) {
	if (property == 'blind'){
		if (state == 'blind') {
			divs[i].classList.add('blind');
			divs[i].classList.remove('blind-duration');
		} else if (state == 'blind-duration') {
			divs[i].classList.remove('blind');
			divs[i].classList.add('blind-duration');
		} else {
			divs[i].classList.remove('blind-duration');
			divs[i].classList.remove('blind');
		}
	} else if (state == true)
		divs[i].classList.add(property);
	else if (state == false)
		divs[i].classList.remove(property);
}
function randomizeBoard() {
    for (var i = 0; i < rows * cols; i++) {
        setTileAttribute(i, randomColor(), 1);
    }
    getTiles();
    var matchedOrbs = getMatches();
    if (matchedOrbs != false && randomizeMatchedOrbs == false)
        randomizeBoard();
}
function saveBoardState() {
    for (var i = 0; i < divs.length; i++) {
        savedBoardState[i] = divs[i].getAttribute('tileColor');
    }
}
function savePlusState() {
    for (var i = 0; i < divs.length; i++) {
        savedPlusState[i] = divs[i].classList.contains('plus');
    }
}
function saveLockState() {
    for (var i = 0; i < divs.length; i++) {
        savedLockState[i] = divs[i].classList.contains('lock');
    }
}
function saveBlindState() {
    for (var i = 0; i < divs.length; i++) {
        savedBlindState[i] = divs[i].classList.contains('blind-duration') ? 'blind-duration' : (divs[i].classList.contains('blind') ? 'blind' : false);
    }
}
function saveSwapperState() {
    for (var i = 0; i < divs.length; i++) {
        savedSwapperState[i] = divs[i].classList.contains('swapper');
    }
}
function saveCloudState() {
    for (var i = 0; i < clouds.length; i++) {
		if(clouds[i].classList.contains('show')){
			savedCloudState[i] = true;
		}else{
			savedCloudState[i] = false;
		}
    }
}
function loadBoardState(loadThis) { 
    for (var i = 0; i < divs.length; i++) {
        setTileAttribute(i, loadThis[i], 1);
    }
    getTiles();
}
function loadProperty(property, loadThis) { 
    for (var i = 0; i < divs.length; i++) {
        setProperty(i, property, loadThis[i]);
    }
    getProperies(property);
}
function loadCloudState(loadThis) {
    for (var i = 0; i < clouds.length; i++) {
        setCloudStatus(i, loadThis[i]);
    }
    getClouds();
}
function opacify() {
    for (var i = 0; i < divs.length; i++) {
        divs[i].setAttribute('tileopacity', 1);
    }
}
function applyPattern() {
    var input = document.getElementById("entry").value;
    input = input.replace(new RegExp('\r?\n','g'), '');
    if (input.length != rows * cols)
        return false;
    var tileColor;
    for (var i = 0; i < rows * cols; i++) {
        tileColor = toColor(input[i]);
        if (tileColor == 0)
            return false;
    }
    for (var i = 0; i < rows * cols; i++) {
        tileColor = toColor(input[i]);
        setTileAttribute(i, tileColor, 1);
    }
    return true;
}
function applyPlusses() {
    var input = document.getElementById("plusEntry").value;
    input = input.replace(new RegExp('\r?\n','g'), '');
    if (input.length != rows * cols)
        return false;
    var state;
    for (var i = 0; i < rows * cols; i++) {
        state = propertyToState('plus', input[i]);
        if (state == '?')
            return false;
    }
    for (var i = 0; i < rows * cols; i++) {
        state = propertyToState('plus', input[i]);
        setProperty(i, 'plus', state);
    }
    return true;
}
function clearPlusses() {for (var i = 0; i < rows * cols; i++) {;
        setProperty(i, 'plus', false);
    }
    return true;
}
function applyLocks() {
    var input = document.getElementById("lockEntry").value;
    input = input.replace(new RegExp('\r?\n','g'), '');
    if (input.length != rows * cols)
        return false;
    var state;
    for (var i = 0; i < rows * cols; i++) {
        state = propertyToState('lock', input[i]);
        if (state == '?')
            return false;
    }
    for (var i = 0; i < rows * cols; i++) {
		
        state = propertyToState('lock', input[i]);
        setProperty(i, 'lock', state);
    }
    return true;
}
function clearLocks() {for (var i = 0; i < rows * cols; i++) {;
        setProperty(i, 'lock', false);
    }
    return true;
}
function applyBlinds() {
    var input = document.getElementById("blindEntry").value;
    input = input.replace(new RegExp('\r?\n','g'), '');
    if (input.length != rows * cols)
        return false;
    var state;
    for (var i = 0; i < rows * cols; i++) {
        state = propertyToState('blind', input[i]);
        if (state == '?')
            return false;
    }
    for (var i = 0; i < rows * cols; i++) {
		
        state = propertyToState('blind', input[i]);
        setProperty(i, 'blind', state);
    }
    return true;
}
function clearBlinds() {for (var i = 0; i < rows * cols; i++) {;
        setProperty(i, 'blind', false);
    }
    return true;
}
function applySwappers() {
    var input = document.getElementById("swapperEntry").value;
    input = input.replace(new RegExp('\r?\n','g'), '');
    if (input.length != rows * cols)
        return false;
    var state;
    for (var i = 0; i < rows * cols; i++) {
        state = propertyToState('swapper', input[i]);
        if (state == '?')
            return false;
    }
    for (var i = 0; i < rows * cols; i++) {
		
        state = propertyToState('swapper', input[i]);
        setProperty(i, 'swapper', state);
    }
    return true;
}
function clearSwappers() {for (var i = 0; i < rows * cols; i++) {;
        setProperty(i, 'swapper', false);
    }
    return true;
}
function applyClouds() {
    var input = document.getElementById("cloudEntry").value;
    input = input.replace(new RegExp('\r?\n','g'), '');
    if (input.length != rows * cols)
        return false;
    var state;
    for (var i = 0; i < rows * cols; i++) {
        state = cloudToState(input[i]);
        if (state == '?')
            return false;
    }
    for (var i = 0; i < rows * cols; i++) {
		
        state = cloudToState(input[i]);
        setCloudStatus(i, state);
    }
    return true;
}
function clearClouds() {for (var i = 0; i < rows * cols; i++) {;
        setCloudStatus(i, false);
    }
    return true;
}
function copyPattern(modifier, noOutput=1, record) {
    var tilePattern = '';
	var plusPattern = '';
	var lockPattern = '';
	var blindPattern = '';
	var swapperPattern = '';
	var cloudPattern = '';
    for (var i = 0; i < rows * cols; i++) {
        if (toLetter(divs[i].getAttribute('tileColor')) == 0 || propertyToLetter('plus', divs[i].classList.contains('plus')) == 0 || propertyToLetter('lock', divs[i].classList.contains('lock')) == 0 || propertyToLetter('blind', divs[i].classList.contains('blind')) == 0 || propertyToLetter('swapper', divs[i].classList.contains('swapper')) == 0 || cloudToletter(clouds[i].classList.contains('show')) == 0)
            return false;
        tilePattern += toLetter(divs[i].getAttribute('tileColor')).toUpperCase();
		plusPattern += propertyToLetter('plus', divs[i].classList.contains('plus')).toUpperCase();
		lockPattern += propertyToLetter('lock', divs[i].classList.contains('lock')).toUpperCase();
		blindPattern += propertyToLetter('blind', divs[i].classList.contains('blind-duration') ? 'blind-duration' : (divs[i].classList.contains('blind') ? 'blind' : false)).toUpperCase();
		swapperPattern += propertyToLetter('swapper', divs[i].classList.contains('swapper')).toUpperCase();
		cloudPattern += cloudToletter(clouds[i].classList.contains('show')).toUpperCase();
    }
	if (record == 'tiles' || record == 'all')
		document.getElementById("entry").value = tilePattern;
	if (record == 'plusses' || record == 'all')
		document.getElementById("plusEntry").value = plusPattern;
	if (record == 'locks' || record == 'all')
		document.getElementById("lockEntry").value = lockPattern;
	if (record == 'blinds' || record == 'all')
		document.getElementById("blindEntry").value = blindPattern;
	if (record == 'swappers' || record == 'all')
		document.getElementById("swapperEntry").value = swapperPattern;
	if (record == 'clouds' || record == 'all')
		document.getElementById("cloudEntry").value = cloudPattern;
    if (noOutput) {
//        var exampleOfStart = 'Example Pattern Link indicating starting orb 1';
//        if (rows != 6 || cols != 5) {
//            exampleOfStart = "<a href='?height=" + cols + "&width=" + rows + "&patt=" + tilePattern + "&start=1'>" + exampleOfStart + "</a><br />";
//            displayOutput("<a href='?height=" + cols + "&width=" + rows + "&patt=" + tilePattern + "'>Pattern Link</a><br />", modifier);
//            if (replayMoveSet.length > 0) {
//                displayOutput("<a href='?height=" + cols + "&width=" + rows + "&patt=" + tilePattern + "&replay=" + replayMoveSet.join('.') + "'>Pattern with Replay Link</a>", 1);
//                displayOutput("<br /><a href='?height=" + cols + "&width=" + rows + "&patt=" + tilePattern + "&replay=" + replayMoveSet.join('.') + "&drops=1'>Pattern with Replay with Drops Link</a>", 1);
//            }
//        } else {
//            exampleOfStart = "<a href='?patt=" + tilePattern + "&start=1'>" + exampleOfStart + "</a><br />";
//            displayOutput("<a href='?patt=" + tilePattern + "'>Pattern Link</a><br />", modifier);
//            if (replayMoveSet.length > 0) {
//                displayOutput("<a href='?patt=" + tilePattern + "&replay=" + replayMoveSet.join('.') + "'>Pattern with Replay Link</a><br />", 1);
//                displayOutput("<a href='?patt=" + tilePattern + "&replay=" + replayMoveSet.join('.') + "&drops=1'>Pattern with Replay with Drops Link</a><br />", 1);
//            }
//        }
//        displayOutput("<br>*" + exampleOfStart, 1);
            //var exampleOfStart = 'Example Pattern Link indicating starting orb 1';
			var params = '';
			if (isMobile)
				params += "&mobile=true";
			if (rows != 6 || cols != 5)
				params += "&height=" + cols + "&width=" + rows;
			if (minimumMatches>2)
				params += "&mincombo=" + minimumMatches
			params += "&patt=" + tilePattern;
			if (plusPattern.includes('P'))
				params += "&plusses=" + plusPattern;
			if (lockPattern.includes('L'))
				params += "&locks=" + lockPattern;
			if (blindPattern.includes('B') || blindPattern.includes('D'))
				params += "&blinds=" + blindPattern;
			if (swapperPattern.includes('S')){
				params += "&spinners=" + swapperPattern;
				if (spinnerTimer != 1000)
					params += "&spintimer=" + (spinnerTimer / 1000);
			}
			if (cloudPattern.includes('C'))
				params += "&clouds=" + cloudPattern;
			if (getScroll())
				params += "&scroll=" + getScroll();
			
			if (colorsCross.length != ['blue', 'green', 'red', 'light', 'dark', 'heart', 'poison', 'jammer', 'xbomb', 'mortalpoison', 'unknown'].length)
				params += "&crossed=" + colorsCross.join('.');
			
			params = params.replace('&','?');
			//exampleOfStart = "<a href='" + params + "&start=1'>" + exampleOfStart + "</a><br />";
			if (document.getElementById("entry").value != tilePattern || document.getElementById("plusEntry").value != plusPattern || document.getElementById("lockEntry").value != lockPattern || document.getElementById("blindEntry").value != blindPattern || document.getElementById("swapperEntry").value != swapperPattern || document.getElementById("cloudEntry").value != cloudPattern) {
				displayOutput("One or more of the board settings has not been applied yet.<br />(This message might be bugged if there are spinners)<br /><br />", modifier);
				displayOutput("<a href='" + params + "'>Pattern Link</a><br />", 1);
			} else {
				displayOutput("<a href='" + params + "'>Pattern Link</a><br />", modifier);
			}
			if (replayMoveSet.length > 0 && $(".swapper").length < 1) {
			    displayOutput("<a href='" + params + "&replay=" + replayMoveSet.join('.') + "'>Pattern with Replay Link</a><br />", 1);
                displayOutput("<a href='" + params + "&replay=" + replayMoveSet.join('.') + "&drops=1'>Pattern with Replay with Drops Link</a><br />", 1);
			} else if ($(".swapper").length > 0) {
				displayOutput("Replays are unavailable when there are spinners on the board.<br />", 1);
			}
			if (startPosition) {
			    displayOutput("<a href='" + params + "&start=" + startPosition + "'>Pattern with Fixed Start</a><br />", 1);
			} else if (replayMoveSet.length > 0) {
				displayOutput("<a href='" + params + "&start=" + replayMoveSet[0] + "'>Pattern with Fixed Start at first move</a><br />", 1);
			}
			//displayOutput("<br>*" + exampleOfStart, 1);
    }
}
function darkenOrbs(matchedOrbs, matchedOrbsAreBombExplosion=0, cascade=1) {
    if (matchedOrbsAreBombExplosion)
        darkDrop = dropSpeed / 2;
    else
        darkDrop = dropSpeed;
    var comboPositionSplit = matchedOrbs[Object.size(matchedOrbs) - 1];
    for (var i = 0; i < comboPositionSplit.length; i++) {
        setTileAttribute(comboPositionSplit[i], 'black', 0, 1, matchedOrbsAreBombExplosion);
    }
    delete matchedOrbs[Object.size(matchedOrbs) - 1];
    timeOut.push(setTimeout(function() {
        if (Object.size(matchedOrbs) > 0)
            darkenOrbs(matchedOrbs, matchedOrbsAreBombExplosion, cascade);
        else {
            requestAction('boardmatched', cascade);
		}
    }, darkDrop));
}
function changeTheWorld() {
    changeTheWorldOn = 1;
    if (freeToPlay != 1) {
        start();
        ctwTimeOut.push(setTimeout(function() {
            if (changeTheWorldOn == 1) {
                replayMoveSet = [];
                $(document).trigger("mouseup");
                swapHasHappened = 1;
                changeTheWorldOn = 0;
                requestAction('solve', 1);
            }
        }, 10000));
    }
}
function checkField() {
    for (var f = 0; f < rows; f++) {
        var comboCount = 0;
        for (var i = 0 + f; i < rows * cols; i = i + rows) {
            if (divs[rows * cols - 1 - i].getAttribute("tileColor") == 'black')
                comboCount++;
            else if (comboCount > 0) {
                return true;
            }
        }
    }
    return false;
}
function dropField(cascade=1) {
	if(cascade == 1){
		for (var f = 0; f < rows; f++) {
			for (var i = 0 + f; i < rows * cols; i = i + rows) {
				if (i < rows * (cols - 1)) {
					if (divs[rows * cols - 1 - i].getAttribute("tileColor") == 'black') {
						($(divs[rows * cols - 1 - i])).swap($(divs[rows * cols - 1 - i - rows]));
					}
				} else {
					if (divs[rows * cols - 1 - i].getAttribute("tileColor") == 'black') {
						if (skyFall == 1)
							setTileAttribute(rows * cols - 1 - i, randomColor(), 1, 0, 0, 0);
					}
				}
			}
		}
		if (checkField())
			timeOut.push(setTimeout(function() {
				dropField();
			}, fieldDropTimer));
		else
			requestAction('fielddropped');
	} else
		requestAction('fielddropped');
}
function showDrops() {
    $("#showDrops").hide();
	$("#clouds").addClass('solving');
	$(".tile").addClass('solving');
    timeOut.push(setTimeout(function() {
        swapHasHappened = 1;
        clearMemory('arrows');
        opacify();
        bombsHaveBeenChecked = 0;
        requestAction('solve', 1);
    }, dropSpeed));
}
var replayMoveSet = [];
function playReplay(solution) {
    if (replayMoveSet.length == 0 || changeTheWorldOn == 1) {
        return;
    }
    requestAction('loadboard');
    toggle('draggable', 0);
    var ctx = document.getElementById("arrowSurface").getContext("2d");
    ($(divs[replayMoveSet[0]])).attr({
        tileopacity: 0.4 // TODO fix this
    });
    var i = 1;
    function playReplayLoopF() {
        timeOut.push(setTimeout(function() {
            var special = 0;
            for (var f = 1; f < i + 1; f++) {
                if (f == i)
                    special = 1;
                if (showReplayArrows == 1)
                    canvas_arrow(ctx, convertXY(replayMoveSet[f - 1], 'x') * scale + scale / 2, convertXY(replayMoveSet[f - 1], 'y') * scale + scale / 2, convertXY(replayMoveSet[f], 'x') * scale + scale / 2, convertXY(replayMoveSet[f], 'y') * scale + scale / 2, special);
            }
            ($(divs[replayMoveSet[i - 1]])).swap($(divs[replayMoveSet[i]]));
            i++;
            if (i < replayMoveSet.length)
                playReplayLoopF();
            else {
                if (solution == 2) {
                    showDrops();
                } else {
                    $("#showDrops").show();
					$("#clouds").addClass('solving');
					$(".tile").addClass('solving');
                }
            }
        }, dropSpeed));
    }
    playReplayLoopF();
}
function canvas_arrow(ctx, fromx, fromy, tox, toy, special) {
    fromx += 0.5;
    fromy += 0.5;
    tox += 0.5;
    toy += 0.5;
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    var headlen = 25;
    ctx.strokeStyle = "black";
    ctx.lineWidth = "12";
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo((tox - fromx) * 0.88 + fromx, (toy - fromy) * 0.88 + fromy);
    ctx.stroke();
    if (special == 1)
        ctx.fillStyle = "#cf0";
    else
        ctx.fillStyle = "white";
    headlen = 22;
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.lineWidth = "5";
    ctx.stroke();
    ctx.fill();
    if (special == 1)
        ctx.strokeStyle = "#cf0";
    else
        ctx.strokeStyle = "white";
    ctx.lineWidth = "8";
    ctx.beginPath();
    ctx.moveTo(tox - (tox - fromx) * 0.98, toy - (toy - fromy) * 0.98);
    ctx.lineTo((tox - fromx) * 0.88 + fromx, (toy - fromy) * 0.88 + fromy);
    ctx.stroke();
}
function getMatches(bombs=0) {
    var comboPositionList = [];
    var comboColor = ''
	  , comboPlusses = 0
	  , comboCross = false
	  , comboRow = false
	  , comboColumn = false //TODO see if this is where plusses are added
      , comboPosition = [];
    for (var f = 0; f < cols; f++) {
        comboColor = '';
		comboPlusses = 0;
		comboCross = false;
		comboRow = false;
		comboColumn = false;
        comboPosition = [];
        for (var i = f * rows; i < f * rows + rows; i++) {
            if (bombs.isArray && divs[i].getAttribute("tileColor") != 'xbomb') {
                for (var c = 0; c < bombs.length; c++) {
                    if (bombs[c] == i) {
                        comboColor = '';
                        comboPosition.length = 0;
                        continue;
                    }
                }
            }
            if (divs[i].getAttribute("tileColor") != comboColor || divs[i].classList.contains('cross')) {
                if (comboPosition.length > minimumMatched) {
                    comboPositionList = comboPositionList.concat(comboPosition);
                }
                comboColor = divs[i].getAttribute("tileColor") == 'unknown' ? '' : (divs[i].classList.contains('cross') ? '' : divs[i].getAttribute("tileColor"));
                comboPosition.length = 0;
            }
            comboPosition.push(i);
            if (comboPosition.length > minimumMatched && i == f * rows + rows - 1) {
                comboPositionList = comboPositionList.concat(comboPosition);
            }
        }
    }
    for (var f = 0; f < rows; f++) {
        comboColor = '';
        comboPosition = [];
        for (var i = 0 + f; i < rows * cols; i = i + rows) {
            if (bombs.isArray && divs[i].getAttribute("tileColor") != 'xbomb') {
                for (var c = 0; c < bombs.length; c++) {
                    if (bombs[c] == i) {
                        comboColor = '';
                        comboPosition.length = 0;
                        continue;
                    }
                }
            }
            if (divs[i].getAttribute("tileColor") != comboColor || divs[i].classList.contains('cross')) {
                if (comboPosition.length > minimumMatched) {
                    comboPositionList = comboPositionList.concat(comboPosition);
                }
                comboColor = divs[i].getAttribute("tileColor") == 'unknown' ? '' : (divs[i].classList.contains('cross') ? '' : divs[i].getAttribute("tileColor"));
                comboPosition.length = 0;
            }
            comboPosition.push(i);
            if (comboPosition.length > minimumMatched && i > rows * (cols - 1) - 1) {
                comboPositionList = comboPositionList.concat(comboPosition);
            }
        }
    }
    if (comboPositionList.length == 0)
        return false;
    comboPositionList = toObject(comboPositionList);
    var comboTracker = jQuery.extend({}, inverObject(comboPositionList));
    var stack = []
      , solutions = []
      , track = [];
    for (var i = 0; i < Object.size(comboPositionList); i++) {
        track = [];
        if (typeof comboTracker[comboPositionList[i]] === "undefined")
            continue;
        comboColor = divs[comboPositionList[i]].getAttribute('tileColor');
        if (comboColor == 'black')
            continue;
        floodFill.apply(null, convertXY(comboPositionList[i]));
        if (track.length > minimumMatches)
            solutions.push(track);
    }
    return solutions;
    function floodFill(x, y) {
        fillPosition(x, y);
        while (stack.length > 0) {
            var toFill = stack.pop();
            fillPosition(toFill[0], toFill[1]);
        }
    }
    function fillPosition(x, y) {
        if (!alreadyFilled(x, y)) {
            delete comboTracker[convertPosition(x, y)];
            track.push(convertPosition(x, y));
        }
        if (!alreadyFilled(x, y - 1))
            stack.push([x, y - 1]);
        if (!alreadyFilled(x + 1, y))
            stack.push([x + 1, y]);
        if (!alreadyFilled(x, y + 1))
            stack.push([x, y + 1]);
        if (!alreadyFilled(x - 1, y))
            stack.push([x - 1, y]);
    }
    function alreadyFilled(x, y) {
        if (x < 0 || y < 0 || x > rows - 1 || y > cols - 1)
            return true;
        if (typeof comboTracker[convertPosition(x, y)] === "undefined")
            return true;
        if (divs[convertPosition(x, y)].getAttribute('tileColor') != comboColor)
            return true;
        return false;
    }
}
function createMonsters() {
    toLetter(randomColor());
    var damageZones;
    damageZones = document.createElement("input");
    damageZones.setAttribute('type', 'text');
    damageZones.setAttribute('id', 'multi');
    damageZones.setAttribute('title', 'Combined Multiplier');
    $('#multic').append(damageZones);
    for (var i = 0; i < myMonsters; i++) {
        damageZones = document.createElement("div");
        damageZones.setAttribute('id', 'm' + i);
        damageZones.setAttribute('class', 'monster');
        $('#damage').append(damageZones);
    }
    for (var i = 0; i < myMonsters; i++) {
        damageZones = document.createElement("input");
        damageZones.setAttribute('type', 'text');
        damageZones.setAttribute('id', 't' + i);
        damageZones.setAttribute('class', 'mtypes');
        damageZones.setAttribute('maxlength', 2);
        damageZones.setAttribute('title', toLetter(randomColor(1)).toUpperCase() + toLetter(randomColor(1)).toUpperCase());
        $('#m' + i).append(damageZones);
    }
    for (var i = 0; i < myMonsters; i++) {
        damageZones = document.createElement("input");
        damageZones.setAttribute('type', 'text');
        damageZones.setAttribute('id', 'd' + i);
        damageZones.setAttribute('title', '1000');
        damageZones.setAttribute('class', 'mnums');
        damageZones.setAttribute('maxlength', 4);
        $('#m' + i).append(damageZones);
    }
    for (var i = 0; i < myMonsters; i++) {
        damageZones = document.createElement("input");
        damageZones.setAttribute('type', 'text');
        damageZones.setAttribute('id', 'r' + i);
        damageZones.setAttribute('disabled', true);
        $('#m' + i).append(damageZones);
    }
    document.getElementById("damage").style.display = 'none';
}
function calculateOutput(item) {
    var temp;
    if (item == 'score') {
        var totalCombo = 0;
        var comboText = '';
        for (i = 0; i < colors2.length; i++) {
            if (typeof scoreTracker[colors2[i]] === "undefined")
                continue;
            for (g = 0; g < scoreTracker[colors2[i]].length; g++) {
                if (colors2[i] == 'xbomb')
                    var convertedOrbTypeName = 'Bomb';
                else if (colors2[i] == 'mortalpoison')
                    var convertedOrbTypeName = 'Mortal Poison';
                else
                    var convertedOrbTypeName = capitaliseFirstLetter(colors2[i]);
                if (showComboItems) {
                    //comboText += "<div class='comboInfoBox'>" + "<span>" + scoreTracker[colors2[i]][g] + " x </span> " + "<img width='32px' src='" + capitaliseFirstLetter(colors2[i]) + ".png'>" + "</div>";
					comboText += "<div class='comboInfoBox'>" + "<span>" + scoreTracker[colors2[i]][g] + " x </span> " + "<img width='32px' src='" + colors2[i] + ".png'>" + "</div>";
                } else {
                    comboText += scoreTracker[colors2[i]][g] + " x " + convertedOrbTypeName + '<br />';
                }
                totalCombo++;
            }
        }
        var poisonText = '';
        var poisonAmount = 0;
        var mortalpoisonText = '';
        var mortalpoisonAmount = 0;
        var numberOfMoves = '';
        for (var i = 0; i < scoreTracker['poison'].length; i++) {
            poisonAmount += 20 + (scoreTracker['poison'][i] - 3) * 5;
        }
        if (scoreTracker['poison'].length > 0)
            poisonText = poisonAmount + '% life lost due to poison';
        for (var i = 0; i < scoreTracker['mortalpoison'].length; i++) {
            mortalpoisonAmount += 50 + (scoreTracker['mortalpoison'][i] - 3) * 15;
        }
        if (scoreTracker['mortalpoison'].length > 0)
            mortalpoisonText = mortalpoisonAmount + '% life lost due to mortal poison';
        if (replayMoveSet.length > 0)
            numberOfMoves = 'Number of moves: ' + (replayMoveSet.length - 1);
        displayOutput('<div style="float:left">' + comboText + '</div><div style="float:left;margin-left:20px">Total Combo: ' + totalCombo + '<br />' + numberOfMoves + '<br />' + mortalpoisonText + '<br>' + poisonText + '</div>', 0);
    }
    if (item == 'damage') {
        var scorePerColor = [];
        var doItComboCount2 = 0;
        for (var i = 0; i < colors2.length; i++) {
            if (typeof scoreTracker[colors2[i]] === "undefined")
                continue;
            for (var g = 0; g < scoreTracker[colors2[i]].length; g++) {
                if (typeof scorePerColor[colors2[i]] === "undefined")
                    scorePerColor[colors2[i]] = 0;
                scorePerColor[colors2[i]] += (100 + (scoreTracker[colors2[i]][g] * 1 - 3) * 25) / 100;
                doItComboCount2++;
            }
        }
        var damageTotal = 0, multiNum;
        scorePerColor['x'] = 0;
        if (!($.isNumeric(multiNum = document.getElementById("multi").value)))
            multiNum = 0;
        var dmgColor, temp = 0, dmgColor2, damageCounter;
        for (var i = 0; i < myMonsters; i++) {
            damageCounter = 0;
            var temp2 = document.getElementById("t" + i).value.trim().split('');
            for (var f = 0; f < 2; f++) {
                if (typeof temp2[f] === "undefined") {
                    dmgColor = 'x';
                } else
                    dmgColor = toColor(temp2[f], 1);
                if (f == 0) {
                    if (dmgColor == 'x' || !($.isNumeric(document.getElementById("d" + i).value * 1)))
                        break;
                    if (!isNaN(scorePerColor[dmgColor]))
                        damageCounter = document.getElementById("d" + i).value * 1 * scorePerColor[dmgColor];
                    dmgColor2 = dmgColor;
                }
                if (f == 1) {
                    temp = 0.3;
                    if (dmgColor == dmgColor2) {
                        temp = 0.1;
                    }
                    if (isNaN(scorePerColor[dmgColor]))
                        scorePerColor[dmgColor] = 0;
                    damageCounter = multiNum * ((100 + (doItComboCount2 - 1) * 25) / 100) * (damageCounter + temp * Math.ceil((document.getElementById("d" + i)).value) * scorePerColor[dmgColor]);
                    if (isNaN(damageCounter))
                        damageCounter = 0;
                    if (damageCounter > 999999)
                        document.getElementById("r" + i).value = Math.ceil(damageCounter / 10000) / 100 + "m";
                    else
                        document.getElementById("r" + i).value = Math.ceil(damageCounter);
                    damageTotal += Math.ceil(damageCounter);
                }
            }
        }
        document.getElementById("total").value = 'Total Damage Dealt: ' + damageTotal;
    }
}
function getArrayOfBombs() {
	arrayOfBombs = new Array();
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].getAttribute("tileColor") == 'xbomb')
            arrayOfBombs.push(i);
    }
    return arrayOfBombs;
}
function getUnmatchedBombs(bombOrbs, matchedOrbs) { //returns array or unmatched bombs
    for (var i = 0; i < matchedOrbs.length; i++) {
        for (var j = 0; j < matchedOrbs[i].length; j++) {
            for (var k = 0; k < bombOrbs.length; k++) {
                if (matchedOrbs[i][j] == bombOrbs[k]) {
                    delete bombOrbs[k];
                    continue;
                }
            }
        }
    }
    /*if (bombsHaveBeenChecked > 0)
        return false;
    else*/ 
	if (Object.size(bombOrbs) > 0)
        return bombOrbs;
    else
        return false;
}
function getMatchedBombs(bombOrbs, matchedOrbs) { //returns array or unmatched bombs
	arrayOfMatchedBombs = new Array();
    ii: for (var i = 0; i < matchedOrbs.length; i++) {
        for (var j = 0; j < matchedOrbs[i].length; j++) {
            for (var k = 0; k < bombOrbs.length; k++) {
                if (matchedOrbs[i][j] == bombOrbs[k]) {
                    //delete bombOrbs[k];
					arrayOfMatchedBombs.push(matchedOrbs[i]);
                    continue ii;
                }
            }
        }
    }
    if (bombsHaveBeenChecked > 0)
        return false;
    else if (Object.size(arrayOfMatchedBombs) > 0)
        return arrayOfMatchedBombs;
    else
        return false;
}
function arrNoDupe(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    return Object.keys(temp);
}
function bombsExplode(unmatchedBombs) {
    var redoit = 1;
    var bombsArray = new Array();
    for (var z = 0; z < unmatchedBombs.length; z++) {
        for (var f = 0; f < cols; f++) {
            for (var i = f * rows; i < f * rows + rows; i++) {
                if (redoit == 0) {
                    bombsArray.push(i);
                    setTileAttribute(i, 'xbomb', 1, 1);
                }
                if (redoit == 1 && i == unmatchedBombs[z]) {
                    i = f * rows - 1;
                    redoit = 0;
                }
            }
            redoit = 1;
        }
        for (var f = 0; f < rows; f++) {
            for (var i = 0 + f; i < rows * cols; i = i + rows) {
                if (redoit == 0) {
                    bombsArray.push(i);
                    setTileAttribute(i, 'xbomb', 1, 1);
                }
                if (redoit == 1 && i == unmatchedBombs[z]) {
                    i = f - rows;
                    redoit = 0;
                }
            }
            redoit = 1;
        }
        redoit = 1;
    }
    if (bombsArray.length > 0)
        return arrNoDupe(bombsArray);
    else
        return false;
}
function getScroll(position) {
	var position = $("#scroll").attr('class');
	switch(position) {
		case "top": return 1;
		case "right": return 2;
		case "bottom": return 3;
		case "left": return 4;
	}
	return false;
}
var bombsHaveBeenChecked = 0;
function solveBoard(solvePortion) {
    var tempArray = new Array();
    if (solvePortion == 1) {
		getTiles();
		var matchedOrbs = getMatches();
		var matchedBombs = getMatchedBombs(getArrayOfBombs(), matchedOrbs);
		var unmatchedBombs = getUnmatchedBombs(getArrayOfBombs(), matchedOrbs);
		if (matchedBombs != false) {
			trackScore(matchedBombs);
            darkenOrbs(matchedBombs, 0, 0);
		} else if (unmatchedBombs !== false) {
            tempArray = bombsExplode(unmatchedBombs);
			matchedOrbs = new Array();
			matchedOrbs.unshift(tempArray);
            bombsHaveBeenChecked = 2;
            darkenOrbs(matchedOrbs, 1, 0);
        } else if (matchedOrbs != false) {
            trackScore(matchedOrbs);
            darkenOrbs(matchedOrbs);
        } else if (checkField()) { // Added in, check for cascade after bomb matches have occured
			dropField(1);
		} else {
            calculateOutput('score');
            calculateOutput('damage');
            swapHasHappened = 0;
            clearMemory('timeout');
            if (skyFall == 1)
                toggle('draggable', 1);
        }
    }
    if (solvePortion == 2) {
        bombsHaveBeenChecked = 1;
        timeOut.push(setTimeout(function() {
            requestAction('solve');
        }, dropSpeed));
    }
}
function changeTimer(modifier) {
    if (modifier == 0) {
        if (timerTime > 0)
            timerTime = timerTime - 500;
    } else
        timerTime = timerTime + 500;
    reset();
}
String.prototype.shuffle = function() {
    var a = this.split("")
      , n = a.length;
    for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];	
        a[j] = tmp;
    }
    return a.join("");
}
function shuffleBoard() {
    shuffledBoard = document.getElementById("entry").value.shuffle();
    document.getElementById("entry").value = shuffledBoard;
    requestAction('applypattern', 2);
}
function requestAction(action, modifier, modifier2=1) {
    if (typeof modifier === 'undefined')
        modifier = 0;
    if (action == 'randomize' || (action == 'applypattern' && modifier != 2))
        replayMoveSet = [];
    if (action == 'randomize' || action == 'loadboard' || action == 'clearstate' || action == 'copypattern') {
        changeTheWorldOn = 0;
        swapHasHappened = 0;
		toggle('draggable', 1);
        clearMemory('timeout');
        clearMemory('ctw');
        reset();
        clearMemory('arrows');
        $("#showDrops").hide();
		$("#clouds").removeClass('solving');
		$(".tile").removeClass('solving');
		spinnerStart();
    }
    if (action == 'randomize') {
        if (colors.length < 2)
            displayOutput('Select a minimum of 2 colors in the options to randomize the board<br />', 0);
        else {
            if (shuffleInstead) {
                shuffleBoard();
            } else {
                randomizeBoard();
            }
            saveBoardState();
            requestAction('copypattern', 0, 0, 'tiles'); // TODO see if 0, 0 is correct
        }
    }
    if (action == 'loadboard'){
        loadBoardState(savedBoardState);
		loadProperty('plus', savedPlusState);
		loadProperty('lock', savedLockState);
		loadProperty('blind', savedBlindState);
		loadProperty('swapper', savedSwapperState);
		loadCloudState(savedCloudState);
	}
//	if (action == 'loadplusses')
//        loadProperty('plus', savedPlusState);
//	if (action == 'loadlocks')
//        loadProperty('lock', savedLockState);
//	if (action == 'loadblinds')
//        loadProperty('blind', savedBlindState);
//	if (action == 'loadsunglasses')
//        loadProperty('blind-duration', savedSunglassesState);
//	if (action == 'loadclouds')
//        loadCloudState(savedCloudState);
    if (action == 'timer') {
        if (changeTheWorldOn == 0)
            toggle('timer');
        else
            displayOutput('Not during Change the World<br />', 0);
    }
    if (action == 'damage')
        toggle('damage');
    if (action == 'skyfall')
        toggle('skyfall');
    if (action == 'changetheworld') {
        if (toggle('draggable', 2)) {
			spinnerStop();
            changeTheWorld();
            displayOutput('I want to change the world... <br />', 0);
        } else
            displayOutput('Reset the board first<br />', 0);
    }
    if (action == 'applypattern') {
        if (applyPattern()) {
            toggle('draggable', 1);
            saveBoardState();
            requestAction('copytiles', 0, modifier2);
        } else
            displayOutput('Failed to apply orbs<br />', 0);
    }
	if (action == 'applyplusses') {
        if (applyPlusses()) {
			toggle('draggable', 1);
            savePlusState();
            requestAction('copyplusses', 0, modifier2);
        } else
            displayOutput('Failed to apply plusses<br />', 0);
    }
	if (action == 'clearplusses') {
        if (clearPlusses()) {
			toggle('draggable', 1);
            savePlusState();
            requestAction('copyplusses', 0, modifier2);
        } else
            displayOutput('Failed to apply plusses<br />', 0);
    }
	if (action == 'applylocks') {
        if (applyLocks()) {
			toggle('draggable', 1);
            saveLockState();
            requestAction('copylocks', 0, modifier2);
        } else
            displayOutput('Failed to apply locks<br />', 0);
    }
	if (action == 'clearlocks') {
        if (clearLocks()) {
			toggle('draggable', 1);
            saveLockState();
            requestAction('copylocks', 0, modifier2);
        } else
            displayOutput('Failed to apply locks<br />', 0);
    }
	if (action == 'applyblinds') {
        if (applyBlinds()) {
			toggle('draggable', 1);
            saveBlindState();
            requestAction('copyblinds', 0, modifier2);
        } else
            displayOutput('Failed to apply blinds<br />', 0);
    }
	if (action == 'clearblinds') {
        if (clearBlinds()) {
			toggle('draggable', 1);
            saveBlindState();
            requestAction('copyblinds', 0, modifier2);
        } else
            displayOutput('Failed to apply blinds<br />', 0);
    }
	if (action == 'applyswappers') {
        if (applySwappers()) {
			toggle('draggable', 1);
            saveSwapperState();
            requestAction('copyswappers', 0, modifier2);
        } else
            displayOutput('Failed to apply duration blinds<br />', 0);
    }
	if (action == 'clearswappers') {
        if (clearSwappers()) {
			toggle('draggable', 1);
            saveSwapperState();
            requestAction('copyswappers', 0, modifier2);
        } else
            displayOutput('Failed to apply duration blinds<br />', 0);
    }
	if (action == 'toggleswappers')
		toggleSwappers();
	if (action == 'applyclouds') {
        if (applyClouds()) {
			toggle('draggable', 1);
            saveCloudState();
            requestAction('copyclouds', 0, modifier);
        } else
            displayOutput('Failed to apply clouds<br />', 0);
    }
	if (action == 'clearclouds') {
        if (clearClouds()) {
			toggle('draggable', 1);
            saveCloudState();
            requestAction('copyclouds', 0, modifier2);
        } else
            displayOutput('Failed to apply clouds<br />', 0);
    }
	if (action == 'copypattern') {
        loadBoardState(savedBoardState);
		loadProperty('plus', savedPlusState);
		loadProperty('lock', savedLockState);
		loadProperty('blind', savedBlindState);
		loadProperty('swapper', savedSwapperState);
		loadCloudState(savedCloudState);
        copyPattern(modifier, modifier2, 'all');
    }
	if (action == 'copytiles') {
        loadBoardState(savedBoardState);
        copyPattern(modifier, modifier2, 'tiles');
    }
	if (action == 'copyplusses') {
		loadProperty('plus', savedPlusState);
        copyPattern(modifier, modifier2, 'plusses');
    }
	if (action == 'copylocks') {
		loadProperty('lock', savedLockState);
        copyPattern(modifier, modifier2, 'locks');
    }
	if (action == 'copyblinds') {
		loadProperty('blind', savedBlindState);
        copyPattern(modifier, modifier2, 'blinds');
    }
	if (action == 'copyswappers') {
		loadProperty('swapper', savedSwapperState);
        copyPattern(modifier, modifier2, 'swappers');
    }
	if (action == 'copyclouds') {
		loadCloudState(savedCloudState);
        copyPattern(modifier, modifier2, 'clouds');
    }
    if (action == 'solve') {
        if (changeTheWorldOn == 0)
            reset();
        if (modifier == 1) {
            clearMemory('score');
        }
        if (changeTheWorldOn == 0 && swapHasHappened) {
            toggle('draggable', 0);
			spinnerStop();
			if(modifier2 > 100){
				timeOut.push(setTimeout(function () {
					solveBoard(1);
				}, modifier2));
			}else
				solveBoard(1);
			
        } else {
            clearMemory('timeout');
        }
        if (modifier == 3) {
            clearMemory('arrows');
            swapHasHappened = 1;
            solveBoard(1);
        }
    }
    if (action == "convert") {
        if ((swapHasHappened == 0 || skyFall == 1) && (timeOut.length < 1)) {
            var colorfrom = document.getElementById("colorfrom").value;
            var colorto = document.getElementById("colorto").value;
            if (colorfrom.length < 1 || colorto.length < 1 || colorfrom.length != colorto.length)
                return;
            saveBoardState();
            requestAction('copypattern', 0, 0, board);// TODO see if 0, 0 is correct
            var inputtemp = document.getElementById("entry").value;
            inputtemp = inputtemp.replace(new RegExp('\r?\n','g'), '');
            var temp3 = inputtemp.split("");
            for (var i = 0, len = inputtemp.length; i < len; i++) {
                for (var g = 0, len2 = colorfrom.length; g < len2; g++) {
                    if (capitaliseFirstLetter(inputtemp[i]) == capitaliseFirstLetter(colorfrom[g])) {
                        temp3[i] = capitaliseFirstLetter(colorto[g]);
                        continue;
                    }
                }
            }
            document.getElementById("entry").value = temp3.join("");
            requestAction('applypattern');
        }
    }
    if (action == 'boardmatched')
        dropField(modifier);
    if (action == 'solve2' || action == 'fielddropped')
        solveBoard(2);
    if (action == 'help') {
        var showHelp = ['<a href="javascript:requestAction(\'legend\')">Legend</a> for the entry boxes above<br /><br />', isMobile ? 'On desktop? <a href="?mobile=false">Here is a link to the desktop version of the site.</a><br /><br />' : 'On mobile? <a href="?mobile=true">Here is a link to the experimental mobile version of the site.</a><br /><br />', 'Icons above the board do things! Gear icon leads to <a href="javascript:requestAction(\'options\')">options</a>', ', stopwatch icon toggles an adjustable 4 second timer', '<br /><br />You can play with different <a href="?' + (isMobile ? 'mobile=true&' : '') + 'height=6&width=7">board</a> <a href="?' + (isMobile ? 'mobile=true&' : '') + 'height=4&width=5">sizes</a>! (change url)', '<br /><br />CtW (change the world) allows you to move and drop orbs freely for 10 seconds (no replay)', '<br /><br />Convert feature on the right will change all orbs of the first color to those of the second (supports 2 colors at once: GR=>RG)', '<br /><br />Puzzled is a modification to <a href="https://pad.dawnglare.com/">dawnGlare\'s PAD Simulator</a>. You can view the source code and add suggestions on <a href="https://github.com/candyninja001/Puzzled">GitHub</a>'].join('');
        displayOutput(showHelp, 0);
    }
    if (action == 'options') {
        var showHelp = ['Options:<br /><div class="test1"><div style="float:left;vertical-align:bottom;line-height:30px">Board Colors: </div>', '<button onclick="requestAction(\'boardcolor\', \'Green\')" id="bcGreen" class="topbutton image7">Options</button>', '<button onclick="requestAction(\'boardcolor\', \'Red\')" id="bcRed" class="topbutton image8">Options</button>', '<button onclick="requestAction(\'boardcolor\', \'Blue\')" id="bcBlue" class="topbutton image9">Options</button>', '<button onclick="requestAction(\'boardcolor\', \'Light\')" id="bcLight" class="topbutton image10">Options</button>', '<button onclick="requestAction(\'boardcolor\', \'Dark\')" id="bcDark" class="topbutton image11">Options</button>', '<button onclick="requestAction(\'boardcolor\', \'Heart\')" id="bcHeart" class="topbutton image12">Options</button></div>', '<br />Random boards with matches: <a onclick="requestAction(\'randomizeMatchedOrbs\', \'1\');" href="#">On</a> / <a onclick="requestAction(\'randomizeMatchedOrbs\', \'0\');" href="#">Off</a>', '<br />Replay arrows: <a href="#" onclick="requestAction(\'replayarrows\', \'1\');">On</a> / <a href="#" onclick="requestAction(\'replayarrows\', \'0\');">Off</a>', '<br />Show combos results with icons: <a onclick="requestAction(\'showComboItems\', \'1\');" href="#">On</a> / <a onclick="requestAction(\'showComboItems\', \'0\');" href="#">Off</a>', '<br />Instead of randomizing orbs, shuffle them: <a onclick="requestAction(\'shuffleInstead\', \'1\');" href="#">On</a> / <a onclick="requestAction(\'shuffleInstead\', \'0\');" href="#">Off</a>', '<br />Minimum matchable combo: <a onclick="requestAction(\'minimumCombo\', \'2\');" href="#">3</a> / <a onclick="requestAction(\'minimumCombo\', \'3\');" href="#">4</a> / <a onclick="requestAction(\'minimumCombo\', \'4\');" href="#">5</a>', '<br /><br />*Board colors affect possible drops from skyfall and colors from random boards'].join('');
        displayOutput(showHelp, 0);
        for (index1 = 0; index1 < 2; ++index1) {
            toggle('boardcolor', 'Blue');
            toggle('boardcolor', 'Green');
            toggle('boardcolor', 'Red');
            toggle('boardcolor', 'Light');
            toggle('boardcolor', 'Dark');
            toggle('boardcolor', 'Heart');
        }
    }
    if (action == 'boardcolor')
        toggle('boardcolor', modifier);
	if (action == 'togglechanges') {
		if ($("#changes").is(':visible'))
			$("#changes").hide();
		else
			$("#changes").show();
	}
    if (action == 'legend') {
        var showHelp = ['Board:<br />R = Red<br />B = Blue<br />G = Green<br />D = Dark (Purple)<br />L = Light (Yellow)<br />H = Heart<br />J = Jammer<br />P = Poison<br />M = Mortal Poison<br />X = Bomb', '<br /><br />Plusses:<br />P = Plussed<br />. = Not plussed', '<br /><br />Locks:<br />L = Locked<br />. = Unlocked', '<br /><br />Blinds:<br />B = Blinded<br />D = Duration Blinded<br />. = Visible', '<br /><br />Spinners:<br />S = Spinner<br />. = Normal', '<br /><br />Clouds:<br />C = Clouded<br />. = Visible', '<br /><br />Press Enter or hit the apply button to change the board', '<br /><br /><a href="javascript:requestAction(\'help\')">Click here to return to information</a>'].join('');
        displayOutput(showHelp, 0);
    }
	if (action == 'statuses') {
		var showHelp = ['<br /><div class="test1"><div style="float:left;vertical-align:bottom;line-height:30px">Matchable: </div>', '<button onclick="requestAction(\'togglecross\', \'Red\')" id="crossRed" class="topbutton image8">Options</button>', '<button onclick="requestAction(\'togglecross\', \'Blue\')" id="crossBlue" class="topbutton image9">Options</button>', '<button onclick="requestAction(\'togglecross\', \'Green\')" id="crossGreen" class="topbutton image7">Options</button>', '<button onclick="requestAction(\'togglecross\', \'Light\')" id="crossLight" class="topbutton image10">Options</button>', '<button onclick="requestAction(\'togglecross\', \'Dark\')" id="crossDark" class="topbutton image11">Options</button>', '<button onclick="requestAction(\'togglecross\', \'Heart\')" id="crossHeart" class="topbutton image12">Options</button>', '<button onclick="requestAction(\'togglecross\', \'Jammer\')" id="crossJammer" class="topbutton image13">Options</button>', '<button onclick="requestAction(\'togglecross\', \'Poison\')" id="crossPoison" class="topbutton image14">Options</button>', '<button onclick="requestAction(\'togglecross\', \'Mortalpoison\')" id="crossMortalpoison" class="topbutton image15">Options</button>', '<button onclick="requestAction(\'togglecross\', \'Xbomb\')" id="crossXbomb" class="topbutton image16">Options</button></div>'].join('');
        displayOutput(showHelp, 0);
        for (index1 = 0; index1 < 2; ++index1) {
			toggle('cross', 'Red');
            toggle('cross', 'Blue');
            toggle('cross', 'Green');
            toggle('cross', 'Light');
            toggle('cross', 'Dark');
            toggle('cross', 'Heart');
			toggle('cross', 'Jammer');
			toggle('cross', 'Poison');
			toggle('cross', 'Mortalpoison');
			toggle('cross', 'Xbomb');
        }
	}
	if (action == 'togglecross') { 
		toggle('cross', modifier);
	}
	if (action == 'na') {
        var showHelp = ['This feature is not ready yet as there is a lot to be done. Here is a list of things that need to be done.<br /><br />Features:<br /> - Allow for replays with spinners and change the world<br /> - Allow user to specify a team<br /> - Allow user to specify a foe(s)<br /> - Allow user to specify status buffs/debuffs<br /><br />Bugs:<br /> - Make locked orb + spinner interaction more obvious<br /> - Make bombs explode properly'].join('');
        displayOutput(showHelp, 0);
    }
    if (action == 'replay'){
		if ($(".swapper").length > 0){
			var showHelp = ['Replays are unavailable when there are spinners on the board'].join('');
			displayOutput(showHelp, 0);
		} else { 
			playReplay(toDrop);
		}
	}
    if (action == 'showdrops')
        showDrops();
    if (action == 'ctimer' && changeTheWorldOn == 0) {
        changeTimer(modifier);
    }
    if (action == 'replayarrows')
        toggle('replayarrows', modifier);
    if (action == 'showComboItems')
        toggle('showComboItems', modifier);
    if (action == 'randomizeMatchedOrbs')
        toggle('randomizeMatchedOrbs', modifier);
    if (action == 'shuffleInstead')
        toggle('shuffleInstead', modifier);
    if (action == 'minimumCombo')
        toggle('minimumCombo', modifier);
	if (action == 'setScroll'){
		$("#scrolls").removeClass("vertical horizontal");
	    $("#scroll").removeClass("top bottom left right");
	    if(modifier == 1) {
			$("#scrolls").addClass("horizontal");
			$("#scroll").addClass("top");
		}else if(modifier == 2) {
			$("#scrolls").addClass("vertical");
			$("#scroll").addClass("right");
		}else if(modifier == 3) {
			$("#scrolls").addClass("horizontal");
			$("#scroll").addClass("bottom");
		}else if(modifier == 4) {
			$("#scrolls").addClass("vertical");
			$("#scroll").addClass("left");
		}
	}
	if (action == 'scrollSettings'){
		var showHelp = ['<br />Scroll: <a onclick="requestAction(\'setScroll\', \'0\');" href="#">None</a> / <a onclick="requestAction(\'setScroll\', \'1\');" href="#">Top</a> / <a onclick="requestAction(\'setScroll\', \'3\');" href="#">Bottom</a> / <a onclick="requestAction(\'setScroll\', \'4\');" href="#">Left</a> / <a onclick="requestAction(\'setScroll\', \'2\');" href="#">Right</a>'].join('');
        displayOutput(showHelp, 0);
	}
	if (action == 'applyspintimer'){
		var temptime = parseFloat(document.getElementById("spinnerTimer").value)
		if (temptime != NaN)
			spinnerTimer = parseFloat(document.getElementById("spinnerTimer").value) * 1000;
	}
}
var clsStopwatch = function() {
    var startAt = 0;
    var lapTime = 0;
    var now = function() {
        return (new Date()).getTime();
    };
    this.start = function() {
        startAt = startAt ? startAt : now();
    }
    ;
	this.stop = function() {
		// If running, update elapsed time otherwise keep it
		lapTime	= startAt ? lapTime + now() - startAt : lapTime;
		startAt	= 0; // Paused
	}
	;
    this.reset = function() {
        lapTime = startAt = 0;
    }
    ;
    this.time = function() {
        return lapTime + (startAt ? now() - startAt : 0);
    }
    ;
};
var x = new clsStopwatch();
var clocktimer;
var spinx = new clsStopwatch();
var spintimer;
function pad(num, size) {
    var s = "0000" + num;
    return s.substr(s.length - size);
}
function formatTime(time, modifier) {
    if (typeof modifier === 'undefined')
        modifier = 0;
    var s = ms = 0, newTime = '', timeTop;
    time = time % (60 * 60 * 1000);
    time = time % (60 * 1000);
    s = Math.floor(time / 1000);
    ms = time % 1000;
    if (!timerOn && !changeTheWorldOn)
        return 'Unlimited';
    if (timerOn == 1)
        timeTop = timerTime / 1000;
    if (changeTheWorldOn == 1)
        timeTop = 10;
    newTime = pad(Math.floor(timeTop - .01) - s, 2) + '.' + pad(1000 + timerTime - Math.floor(timerTime / 1000) * 1000 - ms, 3) + 's';
    if (modifier == 1)
        newTime = pad(Math.floor(timeTop) - s, 2) + '.' + pad(1000 + timerTime - Math.floor(timerTime / 1000) * 1000 - ms, 3) + 's';
    return newTime;
}
function update() {
    document.getElementById('time').innerHTML = formatTime(x.time());
}
function start() {
    clocktimer = setInterval("update()", 1);
    x.start();
}
function reset() {
    clearInterval(clocktimer);
    x.reset();
    update();
    document.getElementById('time').innerHTML = formatTime(x.time(), 1);
}
var previousSpinnerTime;
function spinnerUpdate() {
    var c = document.getElementsByTagNameNS("http://www.w3.org/2000/svg", 'path');
	for (var i = 0; i < c.length; i++){
		c[i].setAttribute('d', getSpinnerPath());
	}
	var spinnerTime = spinx.time() % spinnerTimer;
	if (previousSpinnerTime > spinnerTime){
		spinOrbs();
	}
	previousSpinnerTime = spinnerTime;
}
function spinnerStart() {
	spintimer = setInterval("spinnerUpdate()", 1);
	spinx.reset();
    spinx.start();
}
function spinnerResume() {
	spintimer = setInterval("spinnerUpdate()", 1);
    spinx.start();
}
function spinnerIsRunning() {
    return spinx.time() > 0;
}
function spinnerReset() {
	clearInterval(spintimer);
    spinx.reset();
    spinnerUpdate();
    //document.getElementById('time').innerHTML = formatTime(x.time(), 1);
}
function spinnerStop() {
	clearInterval(spintimer);
	spinx.stop();
	spinnerUpdate();
}
function toggleSwappers() {
	if (spinnerIsRunning()) {
		spinnerReset();
	} else {
		spinnerStart();
	}
}
function getSpinnerPath() {
	var d = [];
	var height = 100;
	var width = 100;
	var rX = 47;
	var rY = 47;
	var rotation = 0; // This is not set up for change
	var arc = 1; // Do not change
	var sweep = 1; // Do not change
	var percent = 1 - spinx.time() % spinnerTimer / spinnerTimer;
	d[0] = width / 2;
	d[1] = height / 2;
	d[2] = width / 2;
	d[3] = height / 2 - rX;
	d[4] = rX;
	d[5] = rY;
	d[6] = rotation;
	d[7] = percent > 0.5 ? 0 : 1;
	d[8] = sweep;
	d[9] = width / 2 - rX * Math.sin(2 * Math.PI * percent);
	d[10] = height / 2 - rY * Math.cos(2 * Math.PI * percent);
	return "M "+d[0]+" "+d[1]+" L "+d[2]+" "+d[3]+" A "+d[4]+" "+d[5]+" "+d[6]+" "+d[7]+" "+d[8]+" "+d[9]+" "+d[10]+" Z"
}
function spinOrbs() {
	for (var i = 0; i < divs.length; i++){
		if(divs[i].classList.contains('swapper') && divs[i].getAttribute("tileColor") != "black" && !divs[i].classList.contains('moving') && !divs[i].classList.contains('ui-draggable-dragging')){
			if (!divs[i].classList.contains('lock')) {
				var color = divs[i].getAttribute("tileColor");
				var newColor = "red";
				for (var ii = 0; ii < colors2.length; ii++){
					if (colors2[ii] == color){
						newColor = colorsSpin[ii];
					}
				}
				setTileAttribute(i, newColor);
			} else {
				// TODO perform some lock effect
			}
		}
		//setTileAttribute(i, 'thngs');
	}
	//$('.swapper:not()')
}
function removeChild(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
}
$(function() {
    var $_GET = {}
      , args = location.search.substr(1).split(/&/);
    for (var i = 0; i < args.length; ++i) {
        var tmp = args[i].split(/=/);
        if (tmp[0] != "") {
            $_GET[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp.slice(1).join("").replace("+", " "));
        }
    }
    if ($_GET['width'] && $.isNumeric($_GET['width']) && 2 < $_GET['width'] && $_GET['width'] < 10) {
        rows = parseInt($_GET['width']);
        //document.getElementById("board").style.width = rows * scale + "px";
    }
    if ($_GET['height'] && $.isNumeric($_GET['height']) && 2 < $_GET['height'] && $_GET['height'] < 10) {
        cols = parseInt($_GET['height']);
        //document.getElementById("board").style.height = cols * scale + "px";
    }
	if ($_GET['mobile']){
		setUpMobile();
	} else {
		scale = 90;
		document.getElementById("mobilesizesheet").innerHTML = ".tile { height: "+scale+"px; width: "+scale+"px; } #board { background-image:url('boardbackground.png'); background-size:"+scale*2+"px "+scale*2+"px; height: "+scale*cols+"px; width: "+scale*rows+"px; }";
	}
	//document.getElementById("board").style.width = rows * scale + "px";
	//document.getElementById("board").style.height = cols * scale + "px";
    document.getElementById('arrowSurfaceC').innerHTML = '<canvas id="arrowSurface" width="' + rows * scale + 'px" height="' + cols * scale + 'px"></canvas>';
    if (rows != 6 || cols != 5) {
        document.getElementById("entry").maxLength = cols * rows;
		document.getElementById("plusEntry").maxLength = cols * rows;
		document.getElementById("lockEntry").maxLength = cols * rows;
		document.getElementById("blindEntry").maxLength = cols * rows;
		document.getElementById("swapperEntry").maxLength = cols * rows;
		document.getElementById("cloudEntry").maxLength = cols * rows;
		if(!isMobile){
			document.getElementById("entry").style.width = rows * 70 / 6 + "px";
			document.getElementById("entry").style.height = cols * 120 / 5 + "px";
			document.getElementById("plusEntry").style.width = rows * 70 / 6 + "px";
			document.getElementById("plusEntry").style.height = cols * 120 / 5 + "px";
			document.getElementById("lockEntry").style.width = rows * 70 / 6 + "px";
			document.getElementById("lockEntry").style.height = cols * 120 / 5 + "px";
			document.getElementById("blindEntry").style.width = rows * 70 / 6 + "px";
			document.getElementById("blindEntry").style.height = cols * 120 / 5 + "px";
			document.getElementById("swapperEntry").style.width = rows * 70 / 6 + "px";
			document.getElementById("swapperEntry").style.height = cols * 120 / 5 + "px";
			document.getElementById("cloudEntry").style.width = rows * 70 / 6 + "px";
			document.getElementById("cloudEntry").style.height = cols * 120 / 5 + "px";
		}
    }
    for (var i = 0; i < rows * cols; i++) {
        var randColor = randomColor();
        divs[i] = document.createElement("div");
        setTileAttribute(i, randColor, 1);
		
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("class", "spinner");
		svg.setAttribute("viewbox", "0 0 100 100");
		//svg.setAttribute("style", "z-index: -4;");
		
		var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("class", "spinnerpath");
		path.setAttribute("fill", "rgba(255, 255, 255, 0.5)");
		//path.setAttribute("d", "M 50 50 L 50 3 A 47 47 0 1 1 3 50 Z");
		
		svg.append(path);
		divs[i].append(svg);
		$('#tiles').append(divs[i]);
		
		
		clouds[i] = document.createElement("div");
		clouds[i].setAttribute("class", "cloud");
		$('#clouds').append(clouds[i]);
    }
    for (i = 1; i < rows; i++) {
        for (h = 1; h < cols; h++) {
            $("#board").append("<div class='cornerblock' style='left:" + ((scale * i) - (cornerspace / 2)) + "px;top:" + ((scale * h) - (cornerspace / 2)) + "px'></div>");
        }
    }
    randomizeBoard();
    createMonsters();
    saveBoardState();
    clearMemory('score');
    if ($_GET['s']) {
        var replayOption = $_GET['s'].substr($_GET['s'].length - 1);
        $.ajax({
            async: false,
            type: 'GET',
            url: 'l.php?link=' + $_GET['s'].slice(0, -1),
            success: function(data) {
                shortenedData = data.split('~');
            }
        });
        if (shortenedData.length > 0 && shortenedData[0].length == 0) {
            alert('The map you were looking for couldn\'t be found');
        }
    }
    var initialGameScreen = 0;
    requestAction('help');
    if ($_GET['patt']) {
        document.getElementById("entry").innerHTML = $_GET['patt'];
        if ($_GET['replay']) {
            replayMoveSet = $_GET['replay'].split('.');
            for (i = 0; i < replayMoveSet.length; i++) {
                if (replayMoveSet[i] > rows * cols - 1 || replayMoveSet[i] < 0) {
                    replayMoveSet = [];
                    break;
                }
            }
        }
        requestAction('applypattern', 2, 0);
    } else
        requestAction('copypattern', 0, 0, 'tiles');
	if ($_GET['plusses']) {
        document.getElementById("plusEntry").value = $_GET['plusses'];
        requestAction('applyplusses', 2, 0);
    } else
        requestAction('copypattern', 0, 0, 'plusses');
	if ($_GET['locks']) {
        document.getElementById("lockEntry").value = $_GET['locks'];
        requestAction('applylocks', 2, 0);
    } else
        requestAction('copypattern', 0, 0, 'locks');
	if ($_GET['blinds']) {
        document.getElementById("blindEntry").value = $_GET['blinds'];
        requestAction('applyblinds', 2, 0);
    } else
        requestAction('copypattern', 0, 0, 'blinds');
	if ($_GET['spinners']) {
        document.getElementById("swapperEntry").value = $_GET['spinners'];
        requestAction('applyswappers', 2, 0);
    } else
        requestAction('copypattern', 0, 0, 'swappers');
	if ($_GET['clouds']) {
        document.getElementById("cloudEntry").value = $_GET['clouds'];
        requestAction('applyclouds', 2, 0);
    } else
        requestAction('copypattern', 0, 0, 'clouds');
	if ($_GET['crossed']) {
		colorsCross = $_GET['crossed'].split('.');
	}
    if (replayMoveSet.length > 0)
        timeOut.push(setTimeout(function() {
            requestAction('replay');
        }, 1000));
	if ($_GET['scroll'])
        requestAction('setScroll', $_GET['scroll']);
	if ($_GET['mincombo'])
        requestAction('minimumCombo', $_GET['mincombo']);
    if ($_GET['freetoplay'])
        freeToPlay = 1;
    if ($_GET['timer'])
        timerTime = $_GET['timer'] * 1000;
    if ($_GET['drops'])
        toDrop = 2;
    if ($_GET['speed'] && $.isNumeric($_GET['speed']))
        dropSpeed = $_GET['speed'];
	if ($_GET['start'] && $.isNumeric($_GET['start'])){
		startPosition = $_GET['start'];
		toggle('draggable', 1);
	}
	if ($_GET['spintimer']){
		document.getElementById("spinnerTimer").value = $_GET['spintimer']
		requestAction('applyspintimer', 2, 0);
	} else
		document.getElementById("spinnerTimer").value = '1.0'
    $(function() {
        document.getElementById('time').innerHTML = formatTime(x.time());
    });
    $(".tile").draggable({
        refreshPositions: "true",
        containment: "#scrolls>.play", //#board
        helper: "clone",
        opacity: 0.8, // TODO see if this is fine instead of tileopacity because of its nature
		zIndex: 3,
        start: function(event, ui) {
            $(this).attr({
                tileopacity: 0.2
            });
			$(this).addClass('moving');
			$("#revealOrbs").hide();
			$(".tile").removeClass('reveal');
			$("#scroll").removeClass('reveal');
			$(".cloud").removeClass('reveal');
			$("#tiles").addClass('picked-up');
            clearMemory('arrows');
            replayMoveSet = [];
            if (changeTheWorldOn == 0 && timerOn == 1) {
                timeOut.push(setTimeout(function() {
                    $(document).trigger("mouseup");
                }, timerTime));
                start();
            }
        },
        stop: function(event, ui) {
            $(this).attr({
                tileopacity: 1
            });
            //requestAction('solve', 1);
			$("#revealOrbs").show();
			if(swapHasHappened){
				$(".tile").removeClass('fixed-start');
				$(".tile").removeClass('no-start');
				if (changeTheWorldOn) {
					toggle('draggable', 1);
				} else {
					$("#clouds").addClass('solving');
					$(".tile").addClass('solving');
				}
			}
			$(this).removeClass('moving');
			$("#tiles").removeClass('picked-up');
			if($(".cloud.show").length > 0 || $(".tile.blind").length > 0 || $(".tile.blind-duration").length > 0){
				requestAction('solve', 1, 750);
			}else{
				requestAction('solve', 1);
			}
        },
        cursorAt: {
            top: scale / 2,
            left: scale / 2
        }
    });
    $(".tile").droppable({
        accept: ".tile",
        over: function(event, ui) {
            var draggable = ui.draggable
              , droppable = $(this);
            if (skyFall == 1 && swapHasHappened == 0)
                saveBoardState();
            draggable.swap(droppable, 2);
            swapHasHappened = 1;
            bombsHaveBeenChecked = 0;
        }
    });
    $(".cornerblock").droppable({
        tolerance: "pointer",
        over: function(event, ui) {
            var cornerblockcount = 0;
            $(".tile").each(function() {
                if (cornerblockcount++ < 30)
                    $(this).droppable('option', 'disabled', true);
            });
        },
        out: function(event, ui) {
            var cornerblockcount = 0;
            $(".tile").each(function() {
                if (cornerblockcount++ < 30)
                    $(this).droppable('option', 'disabled', false);
            });
        }
    });
    $("#entry").bind({
        keydown: function(e) {
            if (e.which == 13)
                requestAction('applypattern');
            if (e.which == 82 || e.which == 71 || e.which == 66 || e.which == 76 || e.which == 68 || e.which == 72 || e.which == 80 || e.which == 74 || e.which == 85 || e.which == 46 || e.which == 8 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || e.which == 88 || e.which == 77 || (e.ctrlKey && (e.which == 65 || e.which == 86 || e.which == 67)))
                return true;
            return false;
        }
    });
	$("#plusEntry").bind({
        keydown: function(e) {
            if (e.which == 13)
                requestAction('applyplusses');
            if (e.which == 80 || e.which == 110 || (!e.shiftKey && e.which == 190) || e.which == 46 || e.which == 8 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || (e.ctrlKey && (e.which == 65 || e.which == 86 || e.which == 67)))
                return true;
            return false;
        }
    });
	$("#lockEntry").bind({
        keydown: function(e) {
            if (e.which == 13)
                requestAction('applylocks');
            if (e.which == 76 || e.which == 110 || (!e.shiftKey && e.which == 190) || e.which == 46 || e.which == 8 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || (e.ctrlKey && (e.which == 65 || e.which == 86 || e.which == 67)))
                return true;
            return false;
        }
    });
	$("#blindEntry").bind({
        keydown: function(e) {
            if (e.which == 13)
                requestAction('applyblinds');
            if (e.which == 66 ||e.which == 68 || e.which == 110 || (!e.shiftKey && e.which == 190) || e.which == 46 || e.which == 8 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || (e.ctrlKey && (e.which == 65 || e.which == 86 || e.which == 67)))
                return true;
            return false;
        }
    });
	$("#swapperEntry").bind({
        keydown: function(e) {
            if (e.which == 13)
                requestAction('applyswappers');
            if (e.which == 83 || e.which == 110 || (!e.shiftKey && e.which == 190) || e.which == 46 || e.which == 8 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || (e.ctrlKey && (e.which == 65 || e.which == 86 || e.which == 67)))
                return true;
            return false;
        }
    });
	$("#cloudEntry").bind({
        keydown: function(e) {
            if (e.which == 13)
                requestAction('applyclouds');
            if (e.which == 67 || e.which == 110 || (!e.shiftKey && e.which == 190) || e.which == 46 || e.which == 8 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || (e.ctrlKey && (e.which == 65 || e.which == 86 || e.which == 67)))
                return true;
            return false;
        }
    });
    $("#colorfrom").bind({
        keydown: function(e) {
            if (e.which == 13)
                requestAction('convert');
            if (e.which == 82 || e.which == 71 || e.which == 66 || e.which == 76 || e.which == 68 || e.which == 72 || e.which == 80 || e.which == 74 || e.which == 46 || e.which == 8 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || (e.ctrlKey && (e.which == 65 || e.which == 86 || e.which == 67)))
                return true;
            return false;
        }
    });
    $("#colorto").bind({
        keydown: function(e) {
            if (e.which == 13)
                requestAction('convert');
            if (e.which == 82 || e.which == 71 || e.which == 66 || e.which == 76 || e.which == 68 || e.which == 72 || e.which == 80 || e.which == 74 || e.which == 46 || e.which == 8 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || (e.ctrlKey && (e.which == 65 || e.which == 86 || e.which == 67)))
                return true;
            return false;
        }
    });
    $("#multi").bind({
        keydown: function(e) {
            if ((e.which > 47 && e.which < 58) || e.which == 110 || e.which == 190 || e.which == 8 || e.which == 46 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || (e.which >= 96 && e.which <= 105))
                return true;
            return false;
        }
    });
    $(".mtypes").bind({
        keydown: function(e) {
            if (e.which == 9 || e.which == 82 || e.which == 71 || e.which == 66 || e.which == 76 || e.which == 68 || e.which == 80 || e.which == 74 || e.which == 46 || e.which == 8 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40)
                return true;
            return false;
        }
    });
    $(".mnums").bind({
        keydown: function(e) {
            if ((e.which > 47 && e.which < 58) || e.which == 8 || e.which == 9 || e.which == 46 || e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40 || (e.which >= 96 && e.which <= 105))
                return true;
            return false;
        }
    });
	$("#spinnerTimer").bind({
        keydown: function(e) {
            if (e.which == 13)
                requestAction('applyspintimer');
		}
	});
	$("#revealOrbs").hover(function(){ 
        $(".tile").addClass('reveal');
		$("#scroll").addClass('reveal');
		$(".cloud").addClass('reveal');
        }
        , function(){
        $(".tile").removeClass('reveal');
		$("#scroll").removeClass('reveal');
		$(".cloud").removeClass('reveal');
    });
	/*$("#revealOrbs").click(function(){ 
		if ($("#scroll").hasClass('reveal')) {
			$(".tile").removeClass('reveal');
			$("#scroll").removeClass('reveal');
			$(".cloud").removeClass('reveal');
		} else {
			$(".tile").addClass('reveal');
			$("#scroll").addClass('reveal');
			$(".cloud").addClass('reveal');
		}
    });*/
	$("#speed").change(function() {
		dropSpeed = parseInt($(this).val());
	});
	//defaultDropSpeed = parseInt($("#speed").val());
	//dropSpeed = defaultDropSpeed;
});
$(document).ready(function() {
    $('input[type=text][title],input[type=password][title],textarea[title]').each(function(i) {
        $(this).addClass('input-prompt-' + i);
        var promptSpan = $('<span class="input-prompt"/>');
        $(promptSpan).attr('id', 'input-prompt-' + i);
        $(promptSpan).append($(this).attr('title'));
        $(promptSpan).click(function() {
            $(this).hide();
            $('.' + $(this).attr('id')).focus();
        });
        if ($(this).val() != '') {
            $(promptSpan).hide();
        }
        $(this).after(promptSpan);
        $(this).focus(function() {
            $('#input-prompt-' + i).hide();
        });
        $(this).blur(function() {
            if ($(this).val() == '') {
                $('#input-prompt-' + i).show();
            }
        });
    });
});
