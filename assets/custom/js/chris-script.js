jQuery(document).ready(function() {
    
    /* cleanQuery: Clean up user's query. Only grab the words and numbers
     *
     * Parameters: query - User's search text
     */
    function cleanQuery(query){
        var words = query.split(" ");        
        console.log(words);
        var search_words = [];
        var search_string = "";
        
        //Populate search_words array only with strings, omit spaces
        for(var i = 0; i < words.length; i++){
            //Catch extra spaces in query
            if(words[i] === ""){
                //do nothing
            }          
            //Else, this is a viable string
            else{
                search_words.push(words[i]);
            }
        }
        
        //Make a string for the future API call using search_words array
        for(var j = 0; j < search_words.length; j++){
            if((j + 1 != search_words.length)){
                search_string += (search_words[j] + " ");
            }           
            //If last entry, don't add space
            else{
                search_string += search_words[j];
            }
        }
        
        //Return the cleaned query
        console.log(search_string);
        return search_string;
    }
    
    /* searchApiCall: Makes the call to OMDb API for user's search query
     *
     * Parameters: query - User's search text
     */
    function searchApiCall(query){
        
        var url = "https://www.omdbapi.com/?s=" + encodeURI(query) + "&type=movie";
        $.getJSON(url).then(function(data){
            
            //If there are search results, populate carousel
            if(data.Response === "True"){
                console.log(data);
                populateResults(data);
            }
            //If no results, display message
            else{
                noMovieFound();
            }
        });
    }
    
     /* showMovieInfoDisplay: Gets full info of movie through API call, displays the containing div
     *
     * Parameters: imdbID - Movie ID to make OMDb API call
     */
    function showMovieInfoDisplay(imdbID){
        $("#carousel-display").hide();
        $("#movie-info-display").fadeIn(1000);
        
        
        var url = "https://www.omdbapi.com/?i=" + imdbID;
        $.getJSON(url).then(function(data){
            console.log(data.Response);
            if(data.Response === "True"){
                console.log(data);
                fillMovieInfoDisplay(data);
            }
        });
        
    }
    
    /* searchTransition: Prepares screen to show movie results
     *
     * Parameters: none
     */
    function searchTransition(){
        $("#index-subtitle").fadeOut("slow");
        $("#index-title").animate({
            top: "-=19%",
        }, 1000);
        $("#search-display").fadeIn(2000);
    }
    
    /* populateResults: Dynamically generate HTML based on return from API call
     *
     * Parameters: json - JSON data from API call return
     */
    function populateResults(json){
        var movies = json.Search;
        var result_len = movies.length;
        var image_src = [];
        
        //Populate array, image_src, with links to images. If no image provided, default to 'no image' picture
        for(var i = 0; i<result_len; i++){
            if(movies[i].Poster !== "N/A"){
                image_src.push(movies[i].Poster);
            }
            else{
                image_src.push("assets/custom/images/no-image.png");
            }
        }
        
        i = 0;
        var n = 0;
        
        //Populate carousel with 2 results per slide
        while(i+2 <= result_len){
            
            // If populating first slide (Only difference is class="active")
            if(i===0){
                $(".carousel-inner").append("<div class='item active'><div class ='search-result search-result-left'><a data-imdb='" + movies[i].imdbID+"' href='#'><img src =" + image_src[i] + "><p class='title-text'>" + movies[i].Title + "</p><p>(" + movies[i].Year + ")</p></img></a></div><div class='search-result search-result-right'><a data-imdb='" + movies[i+1].imdbID+"' href='#'><img src =" + image_src[i+1] + "></img><p class='title-text'>" + movies[i+1].Title + "</p><p>(" + movies[i+1].Year + ")</p></a></div></div>");
            }
            // For every slide but the first one
            else{
                $(".carousel-inner").append("<div class='item'><div class ='search-result search-result-left'><a data-imdb='" + movies[i].imdbID+"' href='#'><img src =" + image_src[i] + "><p class='title-text'>" + movies[i].Title + "</p><p>(" + movies[i].Year + ")</p></img></a></div><div class='search-result search-result-right'><a data-imdb='" + movies[i+1].imdbID+"' href='#'><img src =" + image_src[i+1] + "><p class='title-text'>" + movies[i+1].Title + "</p><p>(" + movies[i+1].Year + ")</p></img></a></div>");
            }
           
           i+=2;
           n+=1;
        }
        
        //If there's an odd number of results, populate the last result by itself on a slide
        if(i+1 < result_len){
            if(i===0){
                $(".carousel-inner").append("<div class='item active search-result'><a data-imdb='" + movies[i].imdbID+"' href='#'><img src =" + image_src[i] + "><p class='title-text'>" + movies[i].Title + "</p><p>(" + movies[i].Year + ")</p></img></a></div>");
            }
            else{
                $(".carousel-inner").append("<div class='item search-result'><a data-imdb='" + movies[i].imdbID+"' href='#'><img src =" + image_src[i] + "><p class='title-text'>" + movies[i].Title + "</p><p>(" + movies[i].Year + ")</p></img></a></div>");
            }
            n+=1;
        }
        
        // Populate carousel navigation dots at center bottom of result screen
        for(var j = 0; j<n; j++){
            if(j===0){
                $(".carousel-indicators").append("<li data-target='#carousel-display' data-slide-to='" + j + "' class='active indicator'></li>");
            }
            else{
                $(".carousel-indicators").append("<li data-target='#carousel-display' data-slide-to='" + j + "' class='indicator'></li>");
            }
        }
        
        //If text is longer than can fit in div, add ellipses (...) and cut title short
        $(".title-text").dotdotdot();
        
        $(".search-result > a").click(function() {
            //console.log($(this).attr("data-imdb"));
            showMovieInfoDisplay($(this).attr("data-imdb"));
        });

  
    }
    

    
    /* fillMovieInfoDisplay: Dynamically generate HTML to display movie info to user
     *
     * parameters: info - JSON data from API call return
     */
    function fillMovieInfoDisplay(info){
        
        //Fill in HTML for full movie info display, based on API return
        if(info.Poster !=="N/A"){
            $("#info-poster").append("<img class='info-item' src=" + info.Poster + "'></img>");
        }
        else{
            $("#info-poster").append("<img class='info-item' src='assets/custom/images/no-image.png'></img>");
        }
        $("#info-title").append("<h2 class='info-item'>" + info.Title + "</h2>");
        $("#info-year").append("<h3 class='info-item'>" + info.Year + "</h3>");
        $("#info-rating").append("<h6 class='info-item' style='padding-top: 10%'>" + info.Rated + "</h6>");
        $("#info-length").append("<h4 class='info-item'>" + info.Runtime + "</h4>");
        $("#info-genre").append("<h4 class='info-item'>" + info.Genre + "</h4>");
        $("#info-plot").append("<h5 class='info-item'>" + info.Plot + "</h5>");
        $("#info-actors").append("<h5 class='info-item'>" + info.Actors + "</h5>");
        $("#info-directors").append("<h5 class='info-item'>" + info.Director + "</h5>");
        $("#info-imdb").append("<h5 class='info-item'>" + info.imdbRating + "</h5>");
        //For rotten tomatoes, if there is no rating, then put "N/A"
        try{
        $("#info-rt").append("<h5 class='info-item'>" + info.Ratings[1].Value + "</h5>");
        }
        catch(TypeError){
            $("#info-rt").append("<h5 class='info-item'>N/A</h5>");
        }
        $("#info-meta").append("<h5 class='info-item'>" + info.Metascore + "</h5>");
        
        //When someone clicks the x in top right corner of full movie info screen, close it
        $("#info-close").click(function(){
            $("#movie-info-display").hide();
            $("#carousel-display").fadeIn(500);
            $(".info-item").remove();
        });
        
        //Set 'Enter' Listener, for the case when someone searches when full movie info is showing
        $("#search_bar").keydown(function(event){
            if(event.keyCode == 13){
            //If full movie info open, close it and show search results
                if($("#movie-info-display").css("display") !== "none"){
                    $("#movie-info-display").hide();
                    $("#carousel-display").fadeIn(500);
                    $(".info-item").remove();
                }
            }
        });
    }
    
    function noMovieFound(){
        $(".carousel-inner").append("<h2 style = 'color: #FFF' class = 'item'>Sorry, no movie found for this search. Please check spelling or try another movie.</h2>");
    }
    

    
    //Set 'Enter' listener on search bar
    $("#search_bar").keydown(function(event){
        if(event.keyCode == 13){
            
            //Delete everything inside of carousel, if there is anything
            $(".item").remove();
            $(".indicator").remove();
            
            //Take input, get ready for API call
            var search_text = cleanQuery($("#search_bar").val());
            
            //Make API call from cleaned query
            searchApiCall(search_text);
            
            //If the screen has already transitioned once, don't do it again
            if($("#index-subtitle").css("display") !== "none"){
                searchTransition();
            }
            
            
        }
    });
});
