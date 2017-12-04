javascript:(function(){

// Get a list of all the comment divs
var tCcomments = document.getElementsByClassName('comments');
var toggle = tCcomments[0].style.display=='none'?'':'none';

for (var i = 0; i < tCcomments.length - 13; i++) {
    //-13 because there are three extra comment class elements after the actual comments

    try {
    
        // Hide the comment
        tCcomments[i].style.display=toggle;

    } catch (e) {

        console.log(e);
        continue;

    }

};

document.getElementsByName('commentpreview')[0].scrollIntoView(true);

})();

javascript:(function(){for(var a=document.getElementsByClassName("comments"),b="none"==a[0].style.display?"":"none",c=0;c<a.length-13;c++)try{a[c].style.display=b}catch(a){console.log(a);continue}document.getElementsByName("commentpreview")[0].scrollIntoView(!0)}());