const TrezorConnect = window.TrezorConnect;
var abi = [{"constant":true,"inputs":[],"name":"mintingFinished","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isPauser","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"renounceMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renouncePauser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"finishMinting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"addPauser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"addMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isMinter","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[],"name":"MintFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"PauserAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"PauserRemoved","type":"event"}]
var contractAddress = '0x2bfe554A45359315B3e8aFfc584ac641AcCa8a4B' // only uppercase
var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/TraaTD0M8AKlhMRoRNp8"));

async function getAddresses() {
    var info = await _getAddresses();
    var resultBalance = [];
    var userBalance;
    var userBalanceInstance;
    var balance;

    for(var key in info) {
        var id = 'customRadio' + key;
        var address = info[key].address;
        userBalance = web3.fromWei(await getBalance(address), 'ether');
        $('#' + id).val(address);
        $('#' + id).data("path", info[key].serializedPath);
        $('label[for=\'' + id + '\'').html('<span>'+ address + "</span><span>" +
            userBalance.toString().slice(0, 4)+ " ETH</span>");
        resultBalance.push(userBalance.toString().slice(0, 4));
    }
    return resultBalance;
}

async function _getAddresses() {
    var response = await TrezorConnect.ethereumGetAddress({
        bundle: [
            { path: "m/44'/60'/0'/0/0", showOnTrezor: false }, // account 1
            { path: "m/44'/60'/0'/0/1", showOnTrezor: false }, // account 2
            { path: "m/44'/60'/0'/0/2", showOnTrezor: false }, // account 3
            { path: "m/44'/60'/0'/0/3", showOnTrezor: false }, // account 3
            { path: "m/44'/60'/0'/0/4", showOnTrezor: false }, // account 3
        ]
    });
    return response['payload'];
}

getNonce = async(address) => {
    return new Promise (function (resolve, reject) {
        web3.eth.getTransactionCount(address, "pending", function (error, result){
            resolve(result);
        });
    });
}

getBalance = async(address) => {
    return new Promise (function (resolve, reject) {
        web3.eth.getBalance(address, function (error, result){
            resolve(result);
        });
    });
}

getPrice = async() => {
    return new Promise (function (resolve, reject) {
        web3.eth.getGasPrice(function (error, result){
            resolve(result);
        });
    });
}

async function sendTx(postData) {
    var contract = web3.eth.contract(abi).at(contractAddress);
    var path = "m/" + postData['path'];
    var amount = web3.toWei(postData['amount'], "ether");
    var ownAddress = postData['address']
    var dataTx = contract.mint.getData(postData['wallet_address'], amount, {from: ownAddress});
    var nonce = await getNonce(postData['address']);
    if(nonce != 0) { nonce = "0x" + nonce.toString(16)}
    else { nonce = "0x0" }
    var rawTransaction = {
        nonce: nonce,
        // gasPrice: "0x" + (await getPrice()).toString(16),
        gasPrice: "0x2CB417800",
        gasLimit: "0x493E0",
        to: contractAddress,
        value: "0x0",
        data: dataTx,
        chainId: 4,
        from: ownAddress,
    };
     
    var params = {
        path: path,
        transaction: rawTransaction,
    }
    var response = await TrezorConnect.ethereumSignTransaction(params);
    if(response.success == true) {
        rawTransaction.v = response.payload.v;
        rawTransaction.r = response.payload.r;
        rawTransaction.s = response.payload.s;

        var tx = new EthJS.Tx(rawTransaction);
        const serializedTx = tx.serialize();
        const rawTx = '0x' + serializedTx.toString('hex');
        await web3.eth.sendRawTransaction(rawTx, function(err, hash) {
            if (!err) {
                postData.tx_hash = hash;
                var item_id = postData['item_id'];
                var _id = '#id_' + item_id;
                // change document.getElementById to $ - get elements by input param
                // $(_id).disabled = "disabled" ;
                $(_id).val("Sent");
                $(_id).attr("class", "btn btn-outline-success btn-sm");
                $(_id).attr("disabled", true);
                $(_id).css({
                    'opacity': '0.8',
                    'padding': '2px 15px',
                    'background-color': 'transparent',
                    'cursor': 'default',
                });
                $.ajax({
                    url: '/update-tx/' + item_id,
                    type: 'POST',
                    data: postData,
                    success:function (response) {
                        if('error' in response) {
                            $("#alert-msg").html("<strong>Fail! </strong>Transaction hasn't sent and updated. " + response.error);
                            $("#alert_block").attr("class", "alert alert-danger");
                            $("#alert_block").fadeTo(4000, 500).slideUp(500, function(){
                                $("#alert_block").slideUp(500);
                            });
                        } else {
                            $("#alert-msg").html("<strong>Success! </strong>Transaction has sent and updated.");
                            $("#alert_block").attr("class", "alert alert-success");
                            $("#alert_block").fadeTo(4000, 500).slideUp(500, function(){
                                $("#alert_block").slideUp(500);
                            });
                            var image_field = $(_id).parents().eq(1).children(".field-is_sent").children("img");
                            var link_field = $(_id).parents().eq(1).children(".field-tx_link");
                            var status_field = $(_id).parents().eq(1).children(".field-status");
                            image_field.attr("src", "/static/admin/img/icon-yes.svg");
                            image_field.attr("alt", "True");
                            var link = "<a target='_blank' href=" + response.tx_hash_link + ">" + response.tx_hash + "</a>"
                            link_field.html(link);
                            status_field.text(response.status)
                            $("#id_reject_" + item_id).val("");
                        }
                    },
                    fail: function (response) {
                        $("#alert-msg").html("<strong>Fail! </strong>Transaction hasn't sent and updated. " + response);
                        $("#alert_block").attr("class", "alert alert-danger");
                        $("#alert_block").fadeTo(4000, 500).slideUp(500, function(){
                            $("#alert_block").slideUp(500);
                        });
                    },
                });
            }
            else {
                $("#alert-msg").html("<strong>Fail! </strong>Transaction hasn't sent. " + err);
                $("#alert_block").attr("class", "alert alert-danger");
                $("#alert_block").fadeTo(4000, 500).slideUp(500, function(){
                    $("#alert_block").slideUp(500);
                });
            }
        });
    } else {
        // console.log(response)
        var err = response.payload.error
        $("#alert-msg").html("<strong>Fail! </strong>Transaction hasn't sent. " + err);
        $("#alert_block").attr("class", "alert alert-danger");
        $("#alert_block").fadeTo(4000, 500).slideUp(500, function(){
           $("#alert_block").slideUp(500);
        });
    }
}


async function rejectTx(rejectData) {
    var _id = '#id_reject_' + rejectData['item_id'];
    $.ajax({
        url: '/reject-tx/' + rejectData['item_id'],
        type: 'POST',
        data: rejectData,
        success:function (response) {
            if('error' in response) {
                $("#alert-msg").html("<strong>Fail! </strong>Transaction hasn't rejected. " + response.error);
                $("#alert_block").attr("class", "alert alert-danger");
                $("#alert_block").fadeTo(4000, 500).slideUp(500, function(){
                    $("#alert_block").slideUp(500);
                });
            } else {
                $("#alert-msg").html("<strong>Success! </strong>Transaction has rejected and updated.");
                $("#alert_block").attr("class", "alert alert-success");
                $("#alert_block").fadeTo(4000, 500).slideUp(500, function(){
                    $("#alert_block").slideUp(500);
                });
                var status_field = $(_id).parents().eq(1).children(".field-status");
                status_field.text(response.status);
                $(_id).val("Rejected");
                $(_id).attr("class", "btn btn-outline-danger btn-sm");
                $(_id).attr("disabled", true);
                $(_id).css({
                    'opacity': '0.8',
                    'padding': '2px 7px',
                    'background-color': 'transparent',
                    'cursor': 'default',
                });
            }
        },
        fail: function (response) {
            $("#alert-msg").html("<strong>Fail! </strong>Transaction hasn't rejected. " + response);
            $("#alert_block").attr("class", "alert alert-danger");
            $("#alert_block").fadeTo(4000, 500).slideUp(500, function(){
                $("#alert_block").slideUp(500);
            });
        },
    });
}
