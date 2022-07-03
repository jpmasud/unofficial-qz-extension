
const getArticlesFromQz = async () => {
    const response = await fetch("https://content.qz.com/graphql?query=query%20%7B%0A%20%20%20%20collections%28first%3A%203%29%7B%0A%20%20%20%20%20%20%20%20nodes%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20date%0A%20%20%20%20%20%20%20%20%20%20%20%20slug%0A%20%20%20%20%20%20%20%20%20%20%20%20title%0A%20%20%20%20%20%20%20%20%20%20%20%20blocks%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20type%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20connections%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20...%20on%20Nug%20%7B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20__typename%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20slug%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20blocks%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20innerHtml%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D");
    const responseJson = await response.json();
    const data = responseJson.data;
    let {collections} = data;
    collections = collections.nodes;

    const whatYouNeedToKnowConnections = [];
    let title;
    for (let collection of collections) { 
    	const {blocks} = collection;
	    let foundCollection = false;
	    for (let block of blocks) {
	        const {connections: blockConnections} = block;
	        for (let connection of blockConnections) {
	            if (connection.hasOwnProperty("slug") && connection.slug.indexOf("heres-what-you-need-to-know") > -1) {
	                whatYouNeedToKnowConnections.push(connection);
                    foundCollection = true;
	           }
	       }
	   }
	   if (foundCollection) {
            title = collection.title
            break;
        }
    }

    const result = []
    for (let connection of whatYouNeedToKnowConnections) {
        for (let block of connection.blocks) {
            result.push(block.innerHtml);
        }
    }

    return {data: result, title: title};
}

const getLatestArticles = async () => {
    try {
        const {data, title} = await getArticlesFromQz();
        for (let article of data) {
            const node = document.createElement("p");
            node.innerHTML = article;
            document.querySelector('#results').appendChild(node);
        }
        document.getElementById('date').textContent = title;
    } catch (e) {
        console.log(e);
    }
}

document.addEventListener('DOMContentLoaded', () => getLatestArticles());

window.addEventListener('load', function (e) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '#';
    document.head.appendChild(link);
}, false);
