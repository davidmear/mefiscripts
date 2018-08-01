// ==UserScript==
// @name            Mock Paginate
// @description     Adds the appearance of pages to threads by only showing one section of comments at a time.
// @namespace       github.com/davidmear/mefiscripts
// @version         0.4
// @include         https://metafilter.com/*
// @include         https://*.metafilter.com/*
// ==/UserScript==

//  Options
//
//  How many comments should each page display.
    var commentsPerPage = 100;
//
//  How many pages should be listed before switching to a condensed page list.
    var maxListedPages = 10;
//
//  How many next and previous pages to display in a condensed list.
    var condensedPad = 2;
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
var postCommentCount;

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
var pageCommas = [];
var pageGrey;
var pageEllipses = [];

function setup() {
    browserAdjustments();
    
    maxListedPages = Math.max(3, parseInt(maxListedPages) || 20);
    commentsPerPage = Math.max(1, parseInt(commentsPerPage) || 100);
    condensedPad = parseInt(condensedPad) || 0;
    
    allComments = [].slice.call(document.getElementsByClassName("comments")); // Gets a list of all the comment divs
    prevNextThreadBox = allComments[allComments.length - 3];
    findPostCommentCount();
    
    newCommentsMessage = document.getElementById("newcommentsmsg");
    newCommentsObserver = new MutationObserver(newCommentsChange);
    newCommentsObserver.observe(newCommentsMessage, {attributes:true});
    
    if (allComments.length > 3 && allComments[allComments.length - 4].id == "newcommentsmsg") {
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
                updatepostCommentCount();
                
                if (allComments.length > previousComments && currentPage < totalPages - 1) {
                    bounceElement(pageLinks[totalPages - 1]);
                }
                
                return;
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
    if (window.location.hash) {
        if (window.location.hash.substring(0, 2) == "#p") {
            // Custom page hash
            changePage(parseInt(window.location.hash.substring(2)) - 1, true);
        } else if (window.location.hash.substring(0, 7) == "#inline") {
            // Metafilter link to the last newly added comment.
            // !!! Doesn't fire a hash changed event because it uses history.replaceState();
            // Reset to the current page.
            updateHash();
        } else {
            // Check if it's a Metafilter comment link
            jumpToComment(window.location.hash.substring(1));
            checkForLinkedComment();
        }
    }
}

function findPostCommentCount() {
    try {
        var byline = document.getElementsByClassName("smallcopy postbyline")[0];
        for (var i = 0; i < byline.childNodes.length; i++) {
            if (byline.childNodes[i].nodeValue) {
                if (byline.childNodes[i].nodeValue.indexOf("total)") >= 0) {
                    postCommentCount = byline.childNodes[i];
                    return;
                }
            }
        }
    } catch (e) {
        console.log("Failed to find post comment count. " + e);
    }
}

function updatepostCommentCount() {
    if (postCommentCount) {
        postCommentCount.nodeValue = postCommentCount.nodeValue.replace(/\d+/, allComments.length);
    }
}

function updateControls() {
    if (indexSpan.contains(pageLinks[currentPage])) {
        indexSpan.insertBefore(pageGrey, pageLinks[currentPage]);
        pageGrey.innerHTML = "<b>[" + (currentPage + 1) + "]</b>";
        pageLinks[currentPage].remove(true);
    }
    
    if (totalPages > maxListedPages) {
        indexSpan.insertBefore(pageEllipses[0], pageCommas[0].nextSibling);
        if (currentPage == totalPages - 1) {
            indexSpan.insertBefore(pageEllipses[1], pageGrey);
        } else {
            indexSpan.insertBefore(pageEllipses[1], pageLinks[totalPages - 1]);
        }
        var lowPage = Math.min(currentPage - condensedPad, totalPages - 1 - condensedPad * 2);
        var highPage = Math.max(currentPage + condensedPad, condensedPad * 2);
        for (var i = 1; i < totalPages - 1; i++) {
            if (i >= lowPage && i <= highPage) {
                pageLinks[i].style.display = "";
                pageCommas[i].style.display = "";
            } else {
                pageLinks[i].style.display = "none";
                pageCommas[i].style.display = "none";
            }
        }
        if (currentPage + condensedPad + 1 >= totalPages - 1) {
            pageEllipses[1].remove(true);
        }
        if (currentPage - condensedPad - 1 <= 0) {
            pageEllipses[0].remove(true);
        }
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
    if (currentPage == totalPages - 1 || totalPages == 0) {
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
    pageGrey = document.createElement("span");
    pageGrey.innerHTML = "<b>[1]</b>";
    
    pageEllipses = [];
    pageEllipses[0] = document.createTextNode(" ... ");
    pageEllipses[1] = document.createTextNode(" ... ");
    
    indexSpan.appendChild(nextLink);
    
    indexDiv.appendChild(indexSpan);
    
    prevNextThreadBox.parentNode.insertBefore(indexDiv, prevNextThreadBox);
}

function createNewPageControls() {
    var i = pageLinks.length;
    if (pageLinks.length < totalPages) {
        pageCommas[i] = document.createElement("span");
        pageCommas[i].innerHTML = ", ";
        indexSpan.insertBefore(pageCommas[i], pageLinksEnd);
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
        pageCommas[i] = document.createElement("span");
        pageCommas[i].innerHTML = ", ";
        indexSpan.insertBefore(pageCommas[i], pageLinksEnd);
    }
}

function createPageFunction(i) {
    return function() {changePage(i, true)};
}

function bounceElement(element) {
    var y = 0;
    var yv = -0.6;
    var step = 0;
    var i = setInterval(frame, 5);
    function frame() {
        if (step >= 400) {
            clearInterval(i);
            element.style.top = 0;
        } else {
            step++;
            y += yv;
            yv = yv + 0.015;
            if (y > 0) {
                y = -y;
                yv = -yv * 0.6;
            }
            element.style.top = y + 'px';
        }
    }
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
// Handle #inline- hashes
// Stop scrolling to linked comment when changing pages manually?
// Test logged out view.
// Test classic view.
// Test other subsites.
// Add display of where you are in the comments?
// Add keyboard controls?
// Add a way to jump to a page?
// Add a note to the comment form if you're not on the last page?
// 
// Questions
// Is the new comments div always present?
// Does anything else show up with the class "comments"?