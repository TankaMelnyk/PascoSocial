'use strict';

var g_openedElement = null;

function closedAllElements() {
    'use strict';
	var openElements = document.querySelectorAll(".opened");
	for(var i = 0; i < openElements.length; i++){
 		openElements[i].classList.toggle("opened");
	}

	var openedElements = document.querySelectorAll(".minus");
	if(openedElements.length > 0) {
		openedElements[0].classList.remove("minus");
	}
	
	g_openedElement = null;
}

function closedAllElementsInAccordion() {
	'use strict';
	var ignoreItem = document.querySelector(".accordion");
	var openElements = document.querySelectorAll(".opened");
	for(var i = 0; i < openElements.length; i++){ 
		if (openElements[i] !== ignoreItem) {
			openElements[i].classList.toggle("opened");
		}	 		
	}

	var openedElements = document.querySelectorAll(".minus");
	if(openedElements.length > 0) {
		openedElements[0].classList.remove("minus");
	}
	
	g_openedElement = null;
}

function toggleBlockOpenStateHandler(currentTarget, targetClassName, closedAllElementsFunction) {
	'use strict';

	closedAllElementsFunction = closedAllElementsFunction || closedAllElements;
	if( g_openedElement === currentTarget) {

		if( currentTarget.firstElementChild && currentTarget.firstElementChild.classList ) {
			currentTarget.firstElementChild.classList.remove("minus");
		}
		
		closedAllElementsFunction();
		return;
	}
	closedAllElementsFunction();
    var targetBlock = currentTarget.getElementsByClassName(targetClassName)[0];
    targetBlock.classList.toggle("opened");

    if( currentTarget.firstElementChild && currentTarget.firstElementChild.classList ) {
		currentTarget.firstElementChild.classList.add("minus");
    }
    
    g_openedElement = currentTarget;
}

function subscribeChildrenOnClick(childrenContainer, targetClassName, closedAllElementsFunction) {
	'use strict';
	closedAllElementsFunction = closedAllElementsFunction || closedAllElements;
	for (var i = 0; i < childrenContainer.length; i++) {
        childrenContainer[i].addEventListener("click", function(event) { 
        	event.stopPropagation();
        	toggleBlockOpenStateHandler(event.currentTarget, targetClassName, closedAllElementsFunction); 
        });
    }    	
}

function subscribeMenuItems() {
	'use strict';
    var desktopSizeMenuItems = document.querySelectorAll("li.desktop-size-menu");
	subscribeChildrenOnClick(desktopSizeMenuItems, "submenu");
	
	var mobileSizeMenuItems = document.querySelectorAll("li.mobile-size-menu");
	subscribeChildrenOnClick(mobileSizeMenuItems, "submenu", closedAllElementsInAccordion, true); 

    var bottonMenu = document.querySelector(".menu-button");
    bottonMenu.addEventListener("click", function(event) { 
		event.stopPropagation();
   		toggleBlockOpenStateHandler(event.currentTarget.parentElement.parentElement, "accordion", closedAllElementsInAccordion, true); 
   		if(g_openedElement === event.currentTarget.parentElement.parentElement){
   			g_openedElement = event.currentTarget;
   		}
	}, false);
}

function subscribeLikeElements() {
	'use strict';
	var parentColectionLike = document.getElementsByClassName("like");

	function clickLikeHandler(event) {
        var spanForLike = event.currentTarget.lastElementChild;
        var likeValue = spanForLike.innerHTML;
        if (event.currentTarget.classList.toggle("likeAready")) {
            likeValue++;
        } else {
            likeValue--;
        }
        spanForLike.innerHTML = likeValue;
    }

    for (var i = 0; i < parentColectionLike.length; i++) {
        parentColectionLike[i].addEventListener("click", clickLikeHandler);
    }
}

function subscribeReadMoreButton() {
	'use strict';
	var buttonMore = document.getElementsByClassName("button-more-wrapper")[0];

	function showMoreInfo(event) {
		var additionalContentWrappers = document.getElementsByClassName("sm-show");	
		for (var i = 0; i < additionalContentWrappers.length; i++) {
			additionalContentWrappers[i].style.display = "block";
		}
		event.currentTarget.className += " closed";
		event.currentTarget.removeEventListener("click", showMoreInfo);
	}

	buttonMore.addEventListener("click", showMoreInfo);  
}

function subscribeSmoothAnhor() {
	'use strict';
	var linkNav = document.querySelectorAll("[href=\"#read_more\"]")[0];
	var anchorSpeed = 1;
    
    function getAnchor(event) {
        event.preventDefault();
        var w = window.pageYOffset;
        var hash = this.href.replace(/[^#]*(.*)/, "$1");
        var t = document.querySelector(hash).getBoundingClientRect().top;
        var start = null;
            
        function step(time) {
            if (start === null) {
                 start = time;
            }
            var progress = time - start,
                r = (t < 0 ? Math.max(w - progress / anchorSpeed, w + t) : Math.min(w + progress / anchorSpeed, w + t));
            window.scrollTo(0, r);
            if (r != w + t) {
                requestAnimationFrame(step);
            } else {
                location.hash = hash;
            }
        }
        requestAnimationFrame(step);
    }
    linkNav.addEventListener("click", getAnchor);
}

function subscribeMainCarousel() {
    var images = ["img/title_1.jpg", "img/title_2.jpg", "img/title_3.jpg"];
    var imageHolderClassName = "wrapper-for-main-menu-and-title";
    subscribeCarousel(images, imageHolderClassName);
}

function subscribeLittleCarousel() {
	var images = ["img/content-img-5.jpg", "img/content-img-6.jpg", "img/content-img-7.jpg"];
    var imageHolderClassName = "little-carousel";
    subscribeCarousel(images, imageHolderClassName);
}

function subscribeCarousel(imagesArray, wrapperClassName) {
	'use strict';
    var imgHolder = document.querySelector("." + wrapperClassName + " .tag-img");
    
	function arrowClickHandler(event, holderImg, images) {		
		var srcImg = holderImg.getAttribute("src");

		for (var i = 0; i < images.length; i++) {
            if (images[i] === srcImg) {
                var newImage = null;
                if (event.currentTarget.classList.contains("arrow-left")) {
                    if (i === 0) {
                        newImage = images[images.length - 1];
                    } else {
                        newImage = images[i - 1];
                    }
                } else {
                    if (i === images.length - 1) {
                        newImage = images[0];
                    } else {
                        newImage = images[i + 1];
                    }
                }
                holderImg.setAttribute("src", newImage);
                return;
            }
        }
	}
 
	var wrapperTitleItem = document.querySelector("." + wrapperClassName);
    var titleArrows = wrapperTitleItem.querySelectorAll(".arrow"); 

	for (var i = 0; i < titleArrows.length; i++) {
        titleArrows[i].addEventListener("click", function(event){
        	arrowClickHandler(event, imgHolder, imagesArray);
        });
    }
}

function subscribeInfoBlocks() {
	'use strict';
	var infoBlockChildren = document.getElementsByClassName("wrapper-dop-menu");
	subscribeChildrenOnClick(infoBlockChildren, "dropdown-dop-menu");
}

function subscribeLanguageBlocks() {
	'use strict';
	var colectionLanguageContainer = document.getElementsByClassName("language-selection");
	subscribeChildrenOnClick(colectionLanguageContainer, "dropdown-leng-menu");

	function changeLanguageHandler(event) {
    	event.stopPropagation();
        for(var i = 0; i < colectionLanguageContainer.length; i++ ){
        	var currentDisplayLanguage = colectionLanguageContainer[i].firstChild.getElementsByTagName("span")[0];
        	currentDisplayLanguage.innerHTML = event.currentTarget.textContent;
        }
        closedAllElements();
    }

	var dropBlocks = document.querySelectorAll(".dropdown-leng-menu");
    for (var i = 0; i < dropBlocks.length; i++) {
        var childrenColection = dropBlocks[i].children;
        for (var j = 0; j < childrenColection.length; j++) {
            childrenColection[j].addEventListener("click", changeLanguageHandler);
        }
    }
}

function subscribeAutoCarousel() {
	'use strict';
	var rootWrapperId = document.getElementById("automatic-carousel-wrapper");
	var speed = 1;
	var rootWrapperChildren = [].slice.call(rootWrapperId.children);
    rootWrapperChildren.forEach(function (element) {
            	element.style.marginLeft = "0px";
            });

	function moveCarousel() {
        var firstChild = rootWrapperId.firstElementChild;    	
        var firstChildWidth = parseFloat(firstChild.clientWidth);
        var firstChildHeight = parseFloat(firstChild.clientHeight);
        var firstChildLeftMargin = parseFloat(firstChild.style.marginLeft);
		rootWrapperId.style.height = firstChild.clientWidth + "px";

        if (firstChildLeftMargin === 0) {
            var newLastChild = firstChild.cloneNode(true);
            firstChild.style.marginLeft = (firstChildLeftMargin - speed ) + "px";
            newLastChild.style.width = Math.abs(firstChildLeftMargin) + "px";

            var lastChildImage = newLastChild.getElementsByTagName("img")[0];
            lastChildImage.className = "";
            lastChildImage.style.width = firstChildWidth + "px"; 
            
            lastChildImage.style.height = firstChild.getElementsByTagName("img")[0].clientHeight;
            rootWrapperId.appendChild(newLastChild);
        }
        else if (Math.abs(firstChildLeftMargin) >= firstChildWidth) {
            rootWrapperId.removeChild(firstChild);
            rootWrapperId.lastElementChild.getElementsByTagName("img")[0].className = "wrapper-img";
            rootWrapperId.lastElementChild.getElementsByTagName("img")[0].style.width = "100%";
            rootWrapperId.lastElementChild.getElementsByTagName("img")[0].style.height = "100%";
            rootWrapperId.lastElementChild.style.width = 100/rootWrapperChildren.length + "%";
        } else {
            rootWrapperId.lastElementChild.style.width = Math.abs(firstChildLeftMargin) + "px";
            firstChild.style.marginLeft = (firstChildLeftMargin - speed ) + "px";
            rootWrapperId.lastElementChild.getElementsByTagName("img")[0].style.width = firstChildWidth + "px";
            rootWrapperId.lastElementChild.getElementsByTagName("img")[0].style.height = firstChildHeight + "px";
        }
	}
	window.setInterval(moveCarousel, 40);						
}

function subscribeImageResizer() {
	'use strict';
	var collectionGridImages = document.querySelectorAll(".flickr-widget-wrapper .wrapper-box");
		
	function showFader(event) {
		var fader = document.createElement("div");
		fader.className = "fader";

		fader.addEventListener("click", function(event){
			while (event.currentTarget.firstChild) {
			    event.currentTarget.removeChild(event.currentTarget.firstChild);
			}
			event.currentTarget.className = "";
		}); 
		document.body.appendChild(fader);
		var cloneBlock = event.currentTarget.cloneNode(true);
		var newImg = cloneBlock.querySelector("img");
		newImg.style.height = fader.clientHeight/2 + "px";
		newImg.className = "imgBlock";
		fader.appendChild(newImg);
	}

	for (var i = 0; i < collectionGridImages.length; i++) {
        collectionGridImages[i].addEventListener("click", showFader); 
    }
}

function subscribeExchangeRates() {
	function refreshRatesHandler() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5", true);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
            	if(xhr.status == 200) {
	                var jsonArray = JSON.parse(xhr.responseText);
	                setRatesData(jsonArray);
            	}
	            else {
	            	console.warn("JSON not ready");
	            	setRatesData([]);
	            }
            }
        }
        document.querySelector("#exchange-rates tfoot").className = "show";
        xhr.send();

        setTimeout(function(){
        	document.querySelector("#exchange-rates tfoot").className = "";
        }, 2000);
	}

	function setRatesData(jsonArray){ 
		var rowsCollection = document.querySelectorAll("#exchange-rates tbody tr");
		for(var i = 0; i < rowsCollection.length; i++){
			setRatesToRow(rowsCollection[i], jsonArray);
		}		
	}

	function setRatesToRow(currencyRow, jsonArray) {
		var currencyName = currencyRow.querySelector(".currency").innerHTML;
		for (var i = 0; i < jsonArray.length; i++) {
			if(jsonArray[i].ccy === currencyName) {
				currencyRow.querySelector(".buy").innerHTML = jsonArray[i].buy;
				currencyRow.querySelector(".sale").innerHTML = jsonArray[i].sale;
				return;
			}
		}
		currencyRow.querySelector(".buy").innerHTML = "-";
		currencyRow.querySelector(".sale").innerHTML = "-";
	}

	refreshRatesHandler();
 	var refreshRatesButton = document.querySelector("#refreshRatesButton");
 	refreshRatesButton.addEventListener("click", refreshRatesHandler);
}

function subscribePopularPost() {
	function showPopularPost() {
		var allPosts = document.querySelectorAll(".tab-post .block-post");
		for(var i = 0; i < allPosts.length; i++) {
			if(!allPosts[i].classList.contains("popular-post")) {
				allPosts[i].style.display = "none";
			}
		}		
	}
	function showRecentPost() {
		var allPosts = document.querySelectorAll(".tab-post .block-post");
		for(var i = 0; i < allPosts.length; i++) {
			allPosts[i].style.display = "flex";
		}		
	}
	var buttonPopularPost = document.querySelector(".post-button .uncheck");
	var buttonRecentPost = document.querySelector(".post-button .check");

	buttonPopularPost.addEventListener("click", showPopularPost);
	buttonRecentPost.addEventListener("click", showRecentPost);
}