javascript:(function(){
// Toggle the visibility of all but the last ten comments.

var tCcomments = document.getElementsByClassName('comments'); // Gets a list of all the comment divs
var toggle = tCcomments[0].style.display=='none'?'':'none'; // Checks if the first comment is hidden

for (var i = 0; i < tCcomments.length - 13; i++) {
    //-13 to leave the last ten comments visible, and because there are three extra comment class elements at the end of the page

    try {
    
        // Toggle the comment visibility
        tCcomments[i].style.display=toggle; // Comment
        tCcomments[i].nextSibling.style.display=toggle; // First <br /> after comment
        tCcomments[i].nextSibling.nextSibling.style.display=toggle; // Second <br /> after comment

    } catch (e) {

        console.log(e);
        continue;

    }

};

$(window).resize() // Forcing scroll refresh
document.getElementsByName('commentpreview')[0].scrollIntoView(true); // Jump to the comment form

})();

// Minified version:

javascript:(function(){for(var e=document.getElementsByClassName("comments"),n="none"==e[0].style.display?"":"none",t=0;t<e.length-13;t++)try{e[t].style.display=n,e[t].nextSibling.style.display=n,e[t].nextSibling.nextSibling.style.display=n}catch(e){console.log(e);continue}$(window).resize(),document.getElementsByName("commentpreview")[0].scrollIntoView(!0)}());

//
// Todo, for pagination:
// Add buttons to display next/prev x comments
// Handle first/last comments
// Add display of where you are in the comments
// Add jump to comment text box + button
// 