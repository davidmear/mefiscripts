// ==UserScript==
// @name            Mock Paginate
// @description     Adds the appearance of pages to threads by only showing one section of comments at a time.
// @namespace       github.com/davidmear/mefiscripts
// @version         0.1
// @include         https://metafilter.com/*
// @include         https://*.metafilter.com/*
// ==/UserScript==

var allComments;
var commentAnchors;
var commentsPerPage = 100;
var currentPage = 0;
var totalPages;
var prevNextThreadBox;
var newCommentsMessage;
var newCommentsObserver;

// Controls
var indexDiv;
var indexSpan;
var prevLink;
var nextLink;
var prevGrey;
var nextGrey;
var prevGreyed = false;
var nextGreyed = false;
var pageLinks = [];
var pageGrey;

function setup() {
    allComments = [].slice.call(document.getElementsByClassName("comments")); // Gets a list of all the comment divs
    totalPages = Math.ceil(allComments.length / commentsPerPage);
    prevNextThreadBox = allComments[allComments.length - 3];
    
    newCommentsMessage = document.getElementById("newcommentsmsg");
    newCommentsObserver = new MutationObserver(newCommentsChange);
    newCommentsObserver.observe(newCommentsMessage, {attributes:true});
    
    if (allComments[allComments.length - 4].id == "newcommentsmsg") {
        allComments.splice(allComments.length - 4, 4);
    } else {
        allComments.splice(allComments.length - 3, 3);
    }
    //There are three extra comment class elements at the end of the page, and a fourth if the "New Comments" box is there.
    
    hideAll();
    createControls();
    updateControls();
    
    if (window.location.hash) {
        jumpToComment(window.location.hash.substring(1));
    }
};

var newCommentsChange = function(changes) {
    for(var change of changes) {
        if (change.type == 'attributes') {
            //console.log('The ' + change.attributeName + ' attribute was modified.');
            if (change.attributeName == "style") {
            
                // The new comments message div has its visibility changed when: 1) New comments appear and 2) The user clicks show comments, so:
                // Refresh everything, get all the comments, redo the pages, refresh the controls, scroll back to the correct position?
                // Need to test on the last page and on earlier pages.
                
                allComments = [].slice.call(document.getElementsByClassName("comments"));
                totalPages = Math.ceil(allComments.length / commentsPerPage);
                if (allComments[allComments.length - 4].id == "newcommentsmsg") {
                    allComments.splice(allComments.length - 4, 4);
                } else {
                    allComments.splice(allComments.length - 3, 3);
                }
                hideAll();
                
                // Need to do a full recheck of controls here, add a page to the index list if necessary,
                //recheck the greyed next / prev buttons, recheck the greyed page buttons.
                // Testing to see if a dumb hard reset works:
                indexDiv.remove(true);
                createControls();
                updateControls();
                
                // Half working, but getting an error:
                // Setting comment 232 - TypeError: Cannot set property 'display' of undefined
            }
        }
    }
}

function hideAll() {
    var display;
    
    commentAnchors = [];
    for (var i = 0; i < allComments.length; i++) {
    
        if (i >= currentPage * commentsPerPage && i < (currentPage + 1) * commentsPerPage) {
            display = "";
        } else {
            display = "none";
        }
        
        setCommentVisibility(i, display);
        
        if (allComments[i].previousSibling) {
            commentAnchors[i] = allComments[i].previousSibling.name;
        }

    };
    
    refreshFlow();
}

function setCommentVisibility(i, show) {
    try {
        // Toggle the comment visibility
        allComments[i].style.display=show; // Comment
        allComments[i].nextSibling.style.display=show; // First <br /> after comment
        allComments[i].nextSibling.nextSibling.style.display=show; // Second <br /> after comment
    } catch (e) {
        console.log("Setting comment " + i + " - " + e);
    }
}

function refreshFlow() {
    window.dispatchEvent(new Event('resize')); // Try to force reflow
    //$(window).resize()
}

function changePage(newPage) {
    if (newPage >= 0 && newPage < totalPages) {
    
        indexSpan.insertBefore(pageLinks[currentPage], pageGrey);
        pageGrey.remove(true);
        
        var i;
        
        // Hide current page
        for (i = currentPage * commentsPerPage; i < Math.min((currentPage + 1) * commentsPerPage, allComments.length); i++) {
            setCommentVisibility(i, 'none');
        }
        
        // Change page
        currentPage = newPage;
        
        // Show new page
        for (i = currentPage * commentsPerPage; i < Math.min((currentPage + 1) * commentsPerPage, allComments.length); i++) {
            setCommentVisibility(i, '');
        }
        
        updateControls();
        
        refreshFlow();
        
        // Jump to the top
        allComments[currentPage * commentsPerPage].previousSibling.scrollIntoView(true);
    }
}

function jumpToComment(commentAnchor) {
    for (var i = 0; i < allComments.length; i++) {
        if (commentAnchors[i] == commentAnchor) {
            changePage(Math.floor(i / commentsPerPage));
            allComments[i].previousSibling.scrollIntoView(true);
        }
    }
}

function updateControls() {
    indexSpan.insertBefore(pageGrey, pageLinks[currentPage]);
    pageGrey.nodeValue = currentPage + 1;
    pageLinks[currentPage].remove(true);
    
    if (currentPage == 0) {
        if (!prevGreyed) {
            indexSpan.insertBefore(prevGrey, prevLink);
            prevLink.remove(true);
            prevGreyed = true;
        }
    } else {
        if (prevGreyed) {
            indexSpan.insertBefore(prevLink, prevGrey);
            prevGrey.remove(true);
            prevGreyed = false;
        }
    }
    if (currentPage == totalPages - 1) {
        if (!nextGreyed) {
            indexSpan.insertBefore(nextGrey, nextLink);
            nextLink.remove(true);
            nextGreyed = true;
        }
    } else {
        if (nextGreyed) {
            indexSpan.insertBefore(nextLink, nextGrey);
            nextGrey.remove();
            nextGreyed = false;
        }
    }       
}

function createControls() {
    
    indexDiv = document.createElement("div");
    indexDiv.className = "comments";
    indexSpan = document.createElement("span");
    indexSpan.className = "whitesmallcopy";
    indexSpan.style.fontSize = "11px";

    prevLink = document.createElement("a");
    prevLink.appendChild(document.createTextNode("« Prev"));
    prevLink.onclick = function(){changePage(currentPage - 1)};
    prevLink.style.cursor = "pointer";
    prevGrey = document.createTextNode("« Prev");
    
    indexSpan.appendChild(prevLink);
    indexDiv.appendChild(indexSpan);
    
    nextLink = document.createElement("a");
    nextLink.appendChild(document.createTextNode("Next »"));
    nextLink.onclick = function(){changePage(currentPage + 1)};
    nextLink.style.cursor = "pointer";
    nextGrey = document.createTextNode("Next »");
    
    indexSpan.appendChild(prevLink);
    indexSpan.appendChild(document.createTextNode("  |  "));
    
    for (var i = 0; i < totalPages; i++) {
        pageLinks[i] = document.createElement("a");
        pageLinks[i].appendChild(document.createTextNode(i + 1));
        pageLinks[i].onclick = createPageFunction(i);
        pageLinks[i].style.cursor = "pointer";
        indexSpan.appendChild(pageLinks[i]);
        if (i < totalPages - 1) {
            indexSpan.appendChild(document.createTextNode(", "));
        }
    }
    pageGrey = document.createTextNode("1");
        
    indexSpan.appendChild(document.createTextNode("  |  "));
    indexSpan.appendChild(nextLink);
    
    indexDiv.appendChild(indexSpan);
    
    prevNextThreadBox.parentNode.insertBefore(indexDiv, prevNextThreadBox);
}

function createPageFunction(i) {
    return function() {changePage(i)};
}

setup();

//
// Todo, for pagination:
// Fix changing pages with a comment linked messing with reflow - hide linked comment arrow?
// Is the new comments div always present?
// Jump to the correct page when comment links are clicked
// Refreshing when there's a comment link in the hash but you've changed pages - should it stay on the same page or jump back to the linked comment?
// Handle new comments somehow - are there events to hook into when it appears / is clicked? -> refresh comments and redo page count
// Add display of where you are in the comments?
// Add a note to the comment form if you're not on the last page?
// 