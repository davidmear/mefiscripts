// ==UserScript==
// @name            Mock Paginate
// @description     Adds the appearance of pages to threads by only showing one section of comments at a time.
// @namespace       github.com/davidmear/mefiscripts
// @version         0.6
// @include         https://metafilter.com/*
// @include         https://*.metafilter.com/*
// ==/UserScript==



//================================//
//            Options             //
//================================//

//  How many comments should each page display.
    var commentsPerPage = 100;

//  How many pages should be listed before switching to a condensed page list.
    var maxListedPages = 10;

//  How many next and previous pages to display in a condensed list.
    var condensedPad = 2;

//  If new comments are loaded on a later page, bounce the last page in the list.
    var bounceOnLoad = true;

//  Display a page list at the top of the comments.
    var showTopControls = true;

//  Display a page list at the bottom of the comments.
    var showBottomControls = true;

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



//================================//
//           Variables            //
//================================//

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
var topControls;
var bottomControls;
var controlsID = "paginationControls";


//================================//
//             Setup              //
//================================//

function setup() {
    browserAdjustments();
    
    maxListedPages = parseInt(maxListedPages) <= 0? 1 : parseInt(maxListedPages) || 10;
    commentsPerPage = parseInt(commentsPerPage) <= 0? 1 : parseInt(commentsPerPage) || 100;
    condensedPad = parseInt(condensedPad) || 0;
    showBottomControls = showBottomControls || !showTopControls;
    
    allComments = [].slice.call(document.getElementsByClassName("comments")); // Gets a list of all the comment divs
    prevNextThreadBox = allComments[allComments.length - 3];
    findPostCommentCount();
    
    newCommentsMessage = document.getElementById("newcommentsmsg");
    newCommentsObserver = new MutationObserver(newCommentsChange);
    newCommentsObserver.observe(newCommentsMessage, {attributes:true});
    
    var topCommentsElement = allComments[0];
    
    if (allComments.length >= 4 && allComments[allComments.length - 4].id == "newcommentsmsg") {
        allComments.splice(allComments.length - 4, 4);
    } else {
        allComments.splice(allComments.length - 3, 3);
    }
    //There are always three extra comment class elements at the end of the page, and a fourth if the "New Comments" box is there.
    
    totalPages = Math.ceil(allComments.length / commentsPerPage);

    prepareAll();
    createControls(topCommentsElement);
    updateControls();
    
    if (window.location.hash) {
        hashChanged();
    }
    window.addEventListener("hashchange", hashChanged, false);
    
};

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


//================================//
//            Updates             //
//================================//

var newCommentsChange = function(changes) {
    for(var change of changes) {
        if (change.type == 'attributes' && change.attributeName == "style") {
            if (newCommentsMessage.style.display == "none") {
                // The new comments message div has its visibility changed when: 1) New comments are loaded and 2) The user clicks show comments.
            
                var previousComments = allComments.length;
                    
                allComments = [].slice.call(document.getElementsByClassName("comments"));
                if (allComments[0].id == controlsID) {
                    allComments.shift();
                }
                var trim;
                if (allComments.length >= 5 && allComments[allComments.length - 5].id == "newcommentsmsg") {
                    trim = showBottomControls? 5 : 4;
                    allComments.splice(allComments.length - trim, trim);
                } else {
                    trim = showBottomControls? 4 : 3;
                    allComments.splice(allComments.length - trim, trim);
                }
                // Page controls have the class "comments", so they need to be removed from the list too.
            
                totalPages = Math.ceil(allComments.length / commentsPerPage);
            
                prepareNewComments(previousComments);
            
                createNewPageControls();
                updateControls();
                updatePostCommentCount();
            
                if (allComments.length > previousComments && currentPage < totalPages - 1) {
                    if (bounceOnLoad) {
                        bounceLastPage();
                    }
                }
            
                return;
            }
        }
    }
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
        
        removePageGrey();
        
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
        if (showTopControls) {
            topControls.indexDiv.previousSibling.scrollIntoView(true);
        } else {
            allComments[currentPage * commentsPerPage].previousSibling.scrollIntoView(true);
        }
        
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

//================================//
//            Controls            //
//================================//

function createControls(topCommentsElement) {
    if (showTopControls) {
        topControls = new Controls(topCommentsElement);
    }
    if (showBottomControls) {
        bottomControls = new Controls(prevNextThreadBox);
    }
}

function updateControls() {
    if (showTopControls) {
        topControls.updateControls();
    }
    if (showBottomControls) {
        bottomControls.updateControls();
    }
}

function createNewPageControls() {
    if (showTopControls) {
        topControls.createNewPageControls();
    }
    if (showBottomControls) {
        bottomControls.createNewPageControls();
    }
}

function removePageGrey() {
    if (showTopControls) {
        topControls.removePageGrey();
    }
    if (showBottomControls) {
        bottomControls.removePageGrey();
    }
}

function bounceLastPage() {
    // Top controls should never be visible when this happens.
    if (showBottomControls) {
        bounceElement(bottomControls.pageLinks[totalPages - 1]);
    }
}


function Controls(locationElement) {
    this.indexDiv;
    this.indexSpan;
    this.prevLink;
    this.nextLink;
    this.prevGrey;
    this.nextGrey;
    this.prevGreyed = false;
    this.nextGreyed = false;
    this.pageLinks = [];
    this.pageLinksEnd;
    this.pageCommas = [];
    this.pageGrey;
    this.pageEllipses = [];
    
    this.createControls(locationElement);
}

Controls.prototype.updateControls = function() {
    if (this.indexSpan.contains(this.pageLinks[currentPage])) {
        this.indexSpan.insertBefore(this.pageGrey, this.pageLinks[currentPage]);
        this.pageGrey.innerHTML = ui.currentL + (currentPage + 1) + ui.currentR;
        this.pageLinks[currentPage].remove(true);
    }
    
    if (totalPages > maxListedPages) {
        this.indexSpan.insertBefore(this.pageEllipses[0], this.pageCommas[0].nextSibling);
        if (currentPage == totalPages - 1) {
            this.indexSpan.insertBefore(this.pageEllipses[1], this.pageGrey);
        } else {
            this.indexSpan.insertBefore(this.pageEllipses[1], this.pageLinks[totalPages - 1]);
        }
        
        // Reduce padding to enforce maxListedPages
        
        var adjustedPad = Math.max(0, parseInt((maxListedPages - 3) / 2));
        
        var lowPage = Math.min(currentPage - adjustedPad, totalPages - 1 - adjustedPad * 2);
        var highPage = Math.max(currentPage + adjustedPad, adjustedPad * 2);
        for (var i = 1; i < totalPages - 1; i++) {
            if (i >= lowPage && i <= highPage) {
                this.pageLinks[i].style.display = "";
                this.pageCommas[i].style.display = "";
            } else {
                this.pageLinks[i].style.display = "none";
                this.pageCommas[i].style.display = "none";
            }
        }
        
        if (highPage + 1 >= totalPages - 1) {
            this.pageEllipses[1].remove(true);
        }
        if (lowPage - 1 <= 0) {
            this.pageEllipses[0].remove(true);
        }
    }
    
    if (currentPage == 0) {
        if (!this.prevGreyed) {
            this.indexSpan.insertBefore(this.prevGrey, this.prevLink);
            this.prevLink.remove(true);
            this.prevGreyed = true;
        }
    } else {
        if (this.prevGreyed) {
            this.indexSpan.insertBefore(this.prevLink, this.prevGrey);
            this.prevGrey.remove(true);
            this.prevGreyed = false;
        }
    }
    if (currentPage == totalPages - 1 || totalPages == 0) {
        if (!this.nextGreyed) {
            this.indexSpan.insertBefore(this.nextGrey, this.nextLink);
            this.nextLink.remove(true);
            this.nextGreyed = true;
        }
    } else {
        if (this.nextGreyed) {
            this.indexSpan.insertBefore(this.nextLink, this.nextGrey);
            this.nextGrey.remove();
            this.nextGreyed = false;
        }
    }       
}

Controls.prototype.createControls = function(locationElement) {
    
    this.indexDiv = document.createElement("div");
    this.indexDiv.className = "comments";
    this.indexDiv.id = controlsID;
    this.indexDiv.style.marginTop = "0";
    this.indexDiv.style.marginBottom = "2em";
    this.indexSpan = document.createElement("span");
    this.indexSpan.className = "whitesmallcopy";
    this.indexSpan.style.fontSize = "11px";

    this.prevLink = document.createElement("a");
    this.prevLink.appendChild(newInnerSpan(ui.prevButton));
    this.prevLink.onclick = function(){changePage(currentPage - 1, true)};
    this.prevLink.style.cursor = "pointer";
    this.prevGrey = newInnerSpan(ui.prevButton);
    
    this.indexSpan.appendChild(this.prevLink);
    this.indexDiv.appendChild(this.indexSpan);
    
    this.nextLink = document.createElement("a");
    this.nextLink.appendChild(newInnerSpan(ui.nextButton));
    this.nextLink.onclick = function(){changePage(currentPage + 1, true)};
    this.nextLink.style.cursor = "pointer";
    this.nextGrey = newInnerSpan(ui.nextButton);
    
    this.indexSpan.appendChild(this.prevLink);
    this.indexSpan.appendChild(newInnerSpan(ui.separator));
    
    this.pageLinksEnd = newInnerSpan(ui.separator);
    this.indexSpan.appendChild(this.pageLinksEnd);
    
    for (var i = 0; i < totalPages; i++) {
        this.createPageButton(i);
    }
    this.pageGrey = document.createElement("span");
    this.pageGrey.innerHTML = ui.currentL + "1" + ui.currentRight;
    
    this.pageEllipses = [];
    this.pageEllipses[0] = newInnerSpan(ui.ellipses);
    this.pageEllipses[1] = newInnerSpan(ui.ellipses);
    
    this.indexSpan.appendChild(this.nextLink);
    
    this.indexDiv.appendChild(this.indexSpan);
    
    locationElement.parentNode.insertBefore(this.indexDiv, locationElement);
}

Controls.prototype.removePageGrey = function() {
    this.indexSpan.insertBefore(this.pageLinks[currentPage], this.pageGrey);
    this.pageGrey.remove(true);
}

Controls.prototype.createNewPageControls = function() {
    var i = this.pageLinks.length;
    if (this.pageLinks.length < totalPages) {
        this.pageCommas[i - 1] = document.createElement("span");
        this.pageCommas[i - 1].innerHTML = ui.comma;
        this.indexSpan.insertBefore(this.pageCommas[i - 1], this.pageLinksEnd);
    }
    while (this.pageLinks.length < totalPages) {
        this.createPageButton(i);
    }
}

Controls.prototype.createPageButton = function(i) {
    this.pageLinks[i] = document.createElement("a");
    var pageButtonText = document.createElement("span");
    pageButtonText.innerHTML = ui.pageL + (i + 1) + ui.pageR;
    this.pageLinks[i].appendChild(pageButtonText);
    this.pageLinks[i].onclick = this.createPageFunction(i);
    this.pageLinks[i].style.cursor = "pointer";
    this.indexSpan.insertBefore(this.pageLinks[i], this.pageLinksEnd);
    if (i < totalPages - 1) {
        this.pageCommas[i] = document.createElement("span");
        this.pageCommas[i].innerHTML = ui.comma;
        this.indexSpan.insertBefore(this.pageCommas[i], this.pageLinksEnd);
    }
}

Controls.prototype.createPageFunction = function(i) {
    return function() {changePage(i, true)};
}

//================================//
//        Helper Functions        //
//================================//

function newInnerSpan(innerHTML) {
    var innerSpan = document.createElement("span");
    innerSpan.innerHTML = innerHTML;
    return innerSpan;
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
