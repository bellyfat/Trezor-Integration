function createWithdraw(csrf_token, user){
    var amount = $('#inputDanger').val();
    var inf = "Are you sure you want to withdraw " + amount + " tokens?"
    if (confirm(inf)) {
        var postData = {
          csrfmiddlewaretoken: csrf_token,
          amount: amount,
          user: user,
        }
        $.ajax({
            url: '/create-withdraw/',
            type: 'POST',
            data: postData,
            success:function (response) {
                if('error' in response){
                    alert(response.error);
                } else {
                    var elem = '<tr><td>' + response.id + '</td><td>' +
                        response.created_at + '</td><td>' +
                        response.type_tx + '</td><td>' +
                        response.amount + '</td><td>' +
                        response.wallet_address + '</td><td>' +
                        response.tx_hash + '</td><td>' +
                        response.status + '</td><tr>'
                    $("#tbodyWithdraw").prepend(elem);
                    $("#balance").text(response.balance);
                }
            },
            fail: function (response) {
                console.log(response)
            },
        });
    }
}
