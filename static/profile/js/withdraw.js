function createWithdraw(csrf_token, user){
    var amount = $('#inputDanger').val();
    var postData = {
      csrfmiddlewaretoken: csrf_token,
      amount: amount,
      user: user,
    }
    // console.log(postData);
    $.ajax({
        url: '/create-withdraw/',
        type: 'POST',
        data: postData,
        success:function (response) {
            if('error' in response){
                alert(response.error)
            } else {
                var elem = '<tr><td>' + response.id + '</td><td>' +
                    response.created_at + '</td><td>' + 
                    'Type' + '</td><td>' + 
                    response.amount + '</td><td>' + 
                    response.wallet_address + '</td><td>' + 
                    response.tx_hash + '</td><td>' +
                    response.status + '</td><tr>'
                $("#tbodyWithdraw").prepend(elem);
            }
        },
        fail: function (response) {
            console.log(2, response)
        },
    });
}
