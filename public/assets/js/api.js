$(document).ready(function() {
    crud.read();
});

var id = localStorage.getItem('id');
id = JSON.parse(id).id;
var crud = {
    read: function() {
        //ideally we should make this into an axios call;
        if(id) {
            var urlId = "https://4qcth52o74.execute-api.us-east-1.amazonaws.com/Test1/api/" + id;
            $.get({ url: urlId }).then(function(results, err) {
                if(err) {
                    console.log(err);
                }
                var data = results;
                $('.thumbnail').attr('src', data.picture);
                $('.wins').html("Wins: " + data.wins);
                $('.losses').html("Losses: " + data.losses);
            });
        } else {
            console.log("No User Specified.");
        }
    },
    update: function(win, loss) {
        var url = "https://4qcth52o74.execute-api.us-east-1.amazonaws.com/Test1/api/" + id;
        //read to get past info;
        //update
        //read again to update page;
        //maybe replace with localSTorage?
        axios.get(url).then(function(results) {
            var pastWins = results.data.wins;
            var pastLosses = results.data.losses;
            var data = { "wins": pastWins + win, "losses": pastLosses + loss };
            axios.put(url, data, { contentType: 'application/json' }).then(function(results) {
                crud.read();
            });
        });
    },
    //needed?
    delete: function() {
        //run delete function
        axios.delete(url).then(function(results) {
            console.log(results);
        });
    },
}
