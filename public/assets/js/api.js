$(document).ready(function() {
	crud.read();
});


var crud = {
    read: function() {
        var id = localStorage.getItem('id');
        if(id) {
            var urlId = "https://4qcth52o74.execute-api.us-east-1.amazonaws.com/Test1/api/" + id;
            $.get({ url: urlId }).then(function(err, results) {
                if(err) throw err;
                /*{

var data = "id": 7,
"name": "Matt W",
"picture": "https://not-real-url",
"auth0Key": "343",
"wins": 0,
"losses": 0,
"createdAt": "2017-03-03T02:15:59.000Z",
"updatedAt": "2017-03-03T02:15:59.000Z"
}
			*/
                var data = JSON.parse(results);

                $('img').src(data["picture"]);

                var wins = data.wins / data.wins + data.losses;
                var color = wins >= 80 ? "green" : wins < 80 && wins > 60 ? "yellow" : "red";
                $('.percent').html(wins + "%").css('color', color);
            })
        } else {
        	console.log("No User Specified.");
        }
    },
    update: function() {

    	//run update function
    	this.read();

    },
    delete: function() {

    	//run delete function
    	this.read();

    },
}
