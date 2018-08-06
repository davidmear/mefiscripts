// ==UserScript==
// @name            Mock Paginate
// @description     Adds the appearance of pages to threads by only showing one section of comments at a time.
// @namespace       github.com/davidmear/mefiscripts
// @version         0.5
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
//  If new comments are loaded on a later page, bounce the last page in the list.
    var bounceOnLoad = true;
//
//  Text elements and styling.
    var ui = {
        prevButton: "« Prev",
        nextButton: "Next »",
        separator: "  |  ",
        ellipses: " ... ",
        currentL: "<b>[",
        currentR: "]</b>",
        pageL: "",
        pageR: "",
        comma: ", ",
    }



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
    
    maxListedPages = parseInt(maxListedPages) <= 0? 1 : parseInt(maxListedPages) || 10;
    commentsPerPage = parseInt(commentsPerPage) <= 0? 1 : parseInt(commentsPerPage) || 100;
    condensedPad = parseInt(condensedPad) || 0;
    
    allComments = [].slice.call(document.getElementsByClassName("comments")); // Gets a list of all the comment divs
    prevNextThreadBox = allComments[allComments.length - 3];
    findPostCommentCount();
    
    newCommentsMessage = document.getElementById("newcommentsmsg");
    newCommentsObserver = new MutationObserver(newCommentsChange);
    newCommentsObserver.observe(newCommentsMessage, {attributes:true});
    
    if (allComments.length >= 4 && allComments[allComments.length - 4].id == "newcommentsmsg") {
        allComments.splice(allComments.length - 4, 4);
    } else {
        allComments.splice(allComments.length - 3, 3);
    }
    //There are always three extra comment class elements at the end of the page, and a fourth if the "New Comments" box is there.
    
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
        if (change.type == 'attributes' && change.attributeName == "style") {
            if (newCommentsMessage.style.display == "none") {
                // The new comments message div has its visibility changed when: 1) New comments are loaded and 2) The user clicks show comments.
            
                var previousComments = allComments.length;
            
                allComments = [].slice.call(document.getElementsByClassName("comments"));
                if (allComments.length >= 5 && allComments[allComments.length - 5].id == "newcommentsmsg") {
                    allComments.splice(allComments.length - 5, 5);
                } else {
                    allComments.splice(allComments.length - 4, 4);
                }
                // Page controls have the class "comments", so they need to be removed from the list too.
            
                totalPages = Math.ceil(allComments.length / commentsPerPage);
            
                prepareNewComments(previousComments);
            
                createNewPageControls();
                updateControls();
                updatePostCommentCount();
            
                if (allComments.length > previousComments && currentPage < totalPages - 1) {
                    if (bounceOnLoad) {
                        bounceElement(pageLinks[totalPages - 1]);
                    }
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

function updatePostCommentCount() {
    if (postCommentCount) {
        postCommentCount.nodeValue = postCommentCount.nodeValue.replace(/\d+/, allComments.length);
    }
}

function updateControls() {
    if (indexSpan.contains(pageLinks[currentPage])) {
        indexSpan.insertBefore(pageGrey, pageLinks[currentPage]);
        pageGrey.innerHTML = ui.currentL + (currentPage + 1) + ui.currentR;
        pageLinks[currentPage].remove(true);
    }
    
    if (totalPages > maxListedPages) {
        indexSpan.insertBefore(pageEllipses[0], pageCommas[0].nextSibling);
        if (currentPage == totalPages - 1) {
            indexSpan.insertBefore(pageEllipses[1], pageGrey);
        } else {
            indexSpan.insertBefore(pageEllipses[1], pageLinks[totalPages - 1]);
        }
        
        // Reduce padding to enforce maxListedPages
        
        var adjustedPad = Math.max(0, parseInt((maxListedPages - 3) / 2));
        
        var lowPage = Math.min(currentPage - adjustedPad, totalPages - 1 - adjustedPad * 2);
        var highPage = Math.max(currentPage + adjustedPad, adjustedPad * 2);
        for (var i = 1; i < totalPages - 1; i++) {
            if (i >= lowPage && i <= highPage) {
                pageLinks[i].style.display = "";
                pageCommas[i].style.display = "";
            } else {
                pageLinks[i].style.display = "none";
                pageCommas[i].style.display = "none";
            }
        }
        
        if (highPage + 1 >= totalPages - 1) {
            pageEllipses[1].remove(true);
        }
        if (lowPage - 1 <= 0) {
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
    prevLink.appendChild(newInnerSpan(ui.prevButton));
    prevLink.onclick = function(){changePage(currentPage - 1, true)};
    prevLink.style.cursor = "pointer";
    prevGrey = newInnerSpan(ui.prevButton);
    
    indexSpan.appendChild(prevLink);
    indexDiv.appendChild(indexSpan);
    
    nextLink = document.createElement("a");
    nextLink.appendChild(newInnerSpan(ui.nextButton));
    nextLink.onclick = function(){changePage(currentPage + 1, true)};
    nextLink.style.cursor = "pointer";
    nextGrey = newInnerSpan(ui.nextButton);
    
    indexSpan.appendChild(prevLink);
    indexSpan.appendChild(newInnerSpan(ui.separator));
    
    pageLinksEnd = newInnerSpan(ui.separator);
    indexSpan.appendChild(pageLinksEnd);
    
    for (var i = 0; i < totalPages; i++) {
        createPageButton(i);
    }
    pageGrey = document.createElement("span");
    pageGrey.innerHTML = ui.currentL + "1" + ui.currentRight;
    
    pageEllipses = [];
    pageEllipses[0] = newInnerSpan(ui.ellipses);
    pageEllipses[1] = newInnerSpan(ui.ellipses);
    
    indexSpan.appendChild(nextLink);
    
    indexDiv.appendChild(indexSpan);
    
    prevNextThreadBox.parentNode.insertBefore(indexDiv, prevNextThreadBox);
}

function newInnerSpan(innerHTML) {
    var innerSpan = document.createElement("span");
    innerSpan.innerHTML = innerHTML;
    return innerSpan;
}

function createNewPageControls() {
    var i = pageLinks.length;
    if (pageLinks.length < totalPages) {
        pageCommas[i - 1] = document.createElement("span");
        pageCommas[i - 1].innerHTML = ui.comma;
        indexSpan.insertBefore(pageCommas[i - 1], pageLinksEnd);
    }
    while (pageLinks.length < totalPages) {
        createPageButton(i);
    }
}

function createPageButton(i) {
    pageLinks[i] = document.createElement("a");
    var pageButtonText = document.createElement("span");
    pageButtonText.innerHTML = ui.pageL + (i + 1) + ui.pageR;
    pageLinks[i].appendChild(pageButtonText);
    pageLinks[i].onclick = createPageFunction(i);
    pageLinks[i].style.cursor = "pointer";
    indexSpan.insertBefore(pageLinks[i], pageLinksEnd);
    if (i < totalPages - 1) {
        pageCommas[i] = document.createElement("span");
        pageCommas[i].innerHTML = ui.comma;
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
