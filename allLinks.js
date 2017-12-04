javascript:(function(){
if (!allLink) {var allLink = {}};

// Get a list of all the comment divs
allLink.comments = document.getElementsByClassName('comments');

for (var id = 0; id < allLink.comments.length; id++) {

    try {
    
        // Remove the by line
        allLink.byLine = allLink.comments[id].getElementsByClassName('smallcopy')[0];
        allLink.byLine.parentNode.removeChild(allLink.byLine);
        
        // Remove the two <br> tags that follow each comment
        allLink.comments[id].parentNode.removeChild(allLink.comments[id].nextElementSibling.nextElementSibling);
        allLink.comments[id].parentNode.removeChild(allLink.comments[id].nextElementSibling);
        
        // Get any links in the comment
        allLink.links = allLink.comments[id].getElementsByTagName('a');
        allLink.replacement = [];
        
        // If there are links
        if (allLink.links.length > 0) {
            
            // Create duplicate links
            for (var i = 0; i < allLink.links.length; i++) {
                
                // Link with original text
                allLink.newElement = document.createElement('a');
                allLink.newElement.setAttribute('href', allLink.links[i].getAttribute('href'));
                allLink.newElement.innerHTML = allLink.links[i].innerHTML;
                allLink.replacement.push(allLink.newElement);
                
                // Subtitle with link url
                allLink.newElement = document.createElement('p');
                allLink.newElement.innerHTML = "<small>(" + allLink.links[i].getAttribute('href') + ")</small><br />"
                allLink.replacement.push(allLink.newElement);
                
            }
            
            // Clear the comment
            allLink.comments[id].innerHTML = '';
            
            // Add the duplicate links
            for (var j in allLink.replacement) {
                
                allLink.comments[id].appendChild(allLink.replacement[j]);
                
            }
        
        // If there are no links
        } else {
            
            // Remove the comment entirely
            allLink.comments[id].parentNode.removeChild(allLink.comments[id]);
            id--;
            
        }
        
    } catch (e) {
    
        console.log(e);
        continue;
        
    }
    
};

allLink = null;

})();