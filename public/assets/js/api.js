$(document).ready(function() {
	crud.read();

});


var crud = {
    read: function() {
        var id = localStorage.getItem('id');

        if (id) {
            var urlId = "https://4qcth52o74.execute-api.us-east-1.amazonaws.com/Test1/api/" + id;
            $.get({ url: urlId }).then(function(err, results) {
                if (err) throw err;

                var data = JSON.parse(results);

                $('.thumbnail').src(data.["picture"]);

                var wins = data.wins / data.wins + data.losses;
                var color = wins >= 80 ? "green" : wins < 80 && wins > 60 ? "yellow" : "red";

                $('.percent').html(wins + "%");

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
