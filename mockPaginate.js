// ==UserScript==
// @name            Mock Paginate
// @description     Adds the appearance of pages to threads by only showing one section of comments at a time.
// @namespace       github.com/davidmear/mefiscripts
// @version         0.2
// @include         https://metafilter.com/*
// @include         https://*.metafilter.com/*
// ==/UserScript==

// Options
//
var commentsPerPage = 100;
//
//


// Status
var currentPage = 0;
var totalPages;
var linkedCommentOnPage;
var linkedComment;

// References
var allComments;
var commentAnchors;
var prevNextThreadBox;
var newCommentsMessage;
var newCommentsObserver;
var triangleContainer;

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
var pageLinksEnd;
var pageGrey;

function setup() {
    browserAdjustments();
    
    allComments = [].slice.call(document.getElementsByClassName("comments")); // Gets a list of all the comment divs
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
    
    totalPages = Math.ceil(allComments.length / commentsPerPage);

    prepareAll();
    createControls();
    updateControls();
    
    if (window.location.hash) {
        hashChanged();
    }
    window.addEventListener("hashchange", hashChanged, false);
    
};

var newCommentsChange = function(changes) {
    for(var change of changes) {
        if (change.type == 'attributes') {
            //console.log('The ' + change.attributeName + ' attribute was modified.');
            if (change.attributeName == "style") {
            
                // The new comments message div has its visibility changed when: 1) New comments appear and 2) The user clicks show comments, so:
                // Refresh everything, get all the comments, redo the pages, refresh the controls, scroll back to the correct position?
                // Need to test on the last page and on earlier pages.
                
                var previousComments = allComments.length;
                
                allComments = [].slice.call(document.getElementsByClassName("comments"));
                if (allComments[allComments.length - 5].id == "newcommentsmsg") {
                    allComments.splice(allComments.length - 5, 5);
                } else {
                    allComments.splice(allComments.length - 4, 4);
                }
                // Page controls have the class "comments", so they need to be removed from the list too.
                // Do this more robustly, check through last few for ids?
                
                totalPages = Math.ceil(allComments.length / commentsPerPage);
                
                prepareNewComments(previousComments);
                
                createNewPageControls();
                updateControls();
            }
        }
    }
}

function prepareAll() {
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

function prepareNewComments(previousComments) {
    var display;
    
    for (var i = previousComments; i < allComments.length; i++) {
    
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
}

function setCommentVisibility(i, show) {
    try {
        // Toggle the comment visibility
        allComments[i].style.display = show; // Comment
        allComments[i].nextSibling.style.display = show; // First <br /> after comment
        allComments[i].nextSibling.nextSibling.style.display = show; // Second <br /> after comment
    } catch (e) {
        console.log("Setting comment " + i + " - " + e);
    }
}

function refreshFlow() {
    window.dispatchEvent(new Event('resize')); // Try to force reflow
    //$(window).resize()
}

function changePage(newPage, changeHash) {
    if (newPage >= 0 && newPage < totalPages && newPage != currentPage) {
                
        indexSpan.insertBefore(pageLinks[currentPage], pageGrey);
        pageGrey.remove(true);
        
        var i;
        
        // Hide current page
        for (i = currentPage * commentsPerPage; i < Math.min((currentPage + 1) * commentsPerPage, allComments.length); i++) {
            setCommentVisibility(i, "none");
        }
        
        // Change page
        currentPage = newPage;
        
        // Show new page
        for (i = currentPage * commentsPerPage; i < Math.min((currentPage + 1) * commentsPerPage, allComments.length); i++) {
            setCommentVisibility(i, "");
        }
                
        updateControls();
        
        checkForLinkedComment();
        
        refreshFlow();
        
        // Jump to the top
        allComments[currentPage * commentsPerPage].previousSibling.scrollIntoView(true);
        
        if (changeHash) {
          updateHash();
        }
        
    }
}

function checkForLinkedComment() {
    if (!triangleContainer) {
        var triangle = document.getElementById("triangle");
        if (triangle) {
            triangleContainer = document.createElement("div");
            triangleContainer.style.cssText = "display:inline-block; position:absolute; left:0; top:0;";
            triangle.parentNode.insertBefore(triangleContainer, triangle);
            triangleContainer.appendChild(triangle);
        }
    }
    if (triangleContainer) {
        triangleContainer.style.display = "none";
    }
    linkedCommentOnPage = false;
    for (var i = currentPage * commentsPerPage; i < Math.min((currentPage + 1) * commentsPerPage, allComments.length); i++) {
        if (commentAnchors[i] == linkedComment) {
            linkedCommentOnPage = true;
        }
    }
    if (triangleContainer && linkedCommentOnPage) {
        triangleContainer.style.display = "inline-block";
    }
}

function jumpToComment(commentAnchor) {
    for (var i = 0; i < allComments.length; i++) {
        if (commentAnchors[i] == commentAnchor) {
            linkedComment = commentAnchors[i];
            changePage(Math.floor(i / commentsPerPage), false);
            allComments[i].previousSibling.scrollIntoView(true);
        }
    }
}

function updateHash() {
    if (linkedCommentOnPage) {
        window.location.hash = linkedComment;
    } else {
        window.location.hash = "p" + (currentPage + 1);
    }
}

function hashChanged() {
    console.log("Hash changed to " + window.location.hash);
    if (window.location.hash) {
        if (window.location.hash.substring(0, 2) == "#p") {
            // Custom page hash
            console.log(" -> " + (parseInt(window.location.hash.substring(2)) - 1));
            changePage(parseInt(window.location.hash.substring(2)) - 1, true);
        } else if (window.location.hash.substring(0, 7) == "#inline") {
            // Metafilter link to the last newly added comment.
            // Reset to the current page.
            updateHash();
        } else {
            // Check if it's a Metafilter comment link
            jumpToComment(window.location.hash.substring(1));
            checkForLinkedComment();
        }
    }
}

function updateControls() {
    if (indexSpan.contains(pageLinks[currentPage])) {
        indexSpan.insertBefore(pageGrey, pageLinks[currentPage]);
        pageGrey.nodeValue = "[" + (currentPage + 1) + "]";
        pageLinks[currentPage].remove(true);
    }
    
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
    prevLink.onclick = function(){changePage(currentPage - 1, true)};
    prevLink.style.cursor = "pointer";
    prevGrey = document.createTextNode("« Prev");
    
    indexSpan.appendChild(prevLink);
    indexDiv.appendChild(indexSpan);
    
    nextLink = document.createElement("a");
    nextLink.appendChild(document.createTextNode("Next »"));
    nextLink.onclick = function(){changePage(currentPage + 1, true)};
    nextLink.style.cursor = "pointer";
    nextGrey = document.createTextNode("Next »");
    
    indexSpan.appendChild(prevLink);
    indexSpan.appendChild(document.createTextNode("  |  "));
    
    pageLinksEnd = document.createTextNode("  |  ");
    indexSpan.appendChild(pageLinksEnd);
    
    for (var i = 0; i < totalPages; i++) {
        createPageButton(i);
    }
    pageGrey = document.createTextNode("[1]");
    
    indexSpan.appendChild(nextLink);
    
    indexDiv.appendChild(indexSpan);
    
    prevNextThreadBox.parentNode.insertBefore(indexDiv, prevNextThreadBox);
}

function createNewPageControls() {
    var i = pageLinks.length;
    if (pageLinks.length < totalPages) {
        indexSpan.insertBefore(document.createTextNode(", "), pageLinksEnd);
    }
    while (pageLinks.length < totalPages) {
        createPageButton(i);
    }
}

function createPageButton(i) {
    pageLinks[i] = document.createElement("a");
    pageLinks[i].appendChild(document.createTextNode(i + 1));
    pageLinks[i].onclick = createPageFunction(i);
    pageLinks[i].style.cursor = "pointer";
    indexSpan.insertBefore(pageLinks[i], pageLinksEnd);
    if (i < totalPages - 1) {
        indexSpan.insertBefore(document.createTextNode(", "), pageLinksEnd);
    }
}

function createPageFunction(i) {
    return function() {changePage(i, true)};
}

function browserAdjustments() {
    // For IE - Need to actually test.
    /*
    if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };*/
}

setup();

//
// Todo:
// Stop scrolling to linked comment when changing pages manually?
// Add an animation or highlight when new comments disappear off onto the last page / a new page.
// Add handling for large numbers of pages (eg. if user changes comment count to 10). Show a few at a time + first/last? Only kick in >30?
// Test logged out view.
// Test classic view.
// Test other subsites.
// Add display of where you are in the comments?
// Add a note to the comment form if you're not on the last page?
// 
// Questions
// Is the new comments div always present?
// Does anything else show up with the class "comments"?