$(document).ready(function() {
    crud.read();
});


var crud = {
    read: function() {
        var id = localStorage.getItem('id');
        id = JSON.parse(id).id;
        if(id) {
            var urlId = "http://localhost:8080/db/users/" + id;

            $.get({ url: urlId }).then(function(results, err) {
                if(err) {
                    console.log(err);
                }
                var data = results.data;
                $('.thumbnail').attr('src', data["picture"]);
                console.log(data.wins);
                var wins = data.wins / data.wins + data.losses;
                wins = wins ? wins : "100";
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
