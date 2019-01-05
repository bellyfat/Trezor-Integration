const TrezorConnect = window.TrezorConnect;
var abi = [{"constant":true,"inputs":[],"name":"name","outputs":
            [{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
            {"constant":false,"inputs":[{"name":"newString","type":"string"}],"name":"setName",
            "outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
var contractAddress = '0xaBb6f7123B84a5585b44C31cFCc3854D02f7b00e' // only uppercase
var web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/TraaTD0M8AKlhMRoRNp8"));

async function getAddresses() {// need to change - radio button
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
		$('label[for=\'' + id + '\'').html('<span>'+ address + "</span><span>" + 
			userBalance.toString().slice(0, 4)+ " ETH</span>");
		
		resultBalance.push(userBalance.toString().slice(0, 4));
	}
	return resultBalance
}

async function _getAddresses() {
	// var response = await TrezorConnect.ethereumGetAddress({path: "m/44'/60'/0'/0"});
	// console.log("TrezorConnect.ethereumGetAddress", response);
	// var response = await TrezorConnect.ethereumGetAccountInfo();
	// console.log("TrezorConnect.ethereumGetAccountInfo", response);
	var response = await TrezorConnect.ethereumGetAddress({
	    bundle: [
	        { path: "m/44'/60'/0'", showOnTrezor: false }, // account 1
	        { path: "m/44'/60'/1'", showOnTrezor: false }, // account 2
	        { path: "m/44'/60'/2'", showOnTrezor: false }, // account 3
	        { path: "m/44'/60'/3'", showOnTrezor: false }, // account 3
	        { path: "m/44'/60'/4'", showOnTrezor: false }, // account 3
	    ]
	});
	return response['payload'];
}

async function login(challenge_hidden, challenge_visual) {
	var response = await TrezorConnect.requestLogin({
        callback: function() {
            // here should be a request to server to fetch "challengeHidden" and "challengeVisual"
            return {
                challengeHidden: challenge_hidden,
                challengeVisual: challenge_visual,
            }
        }
    })
    if(response.success == true){
    	document.getElementById('sign').style.display = 'none';
    	document.getElementById('transaction_list').style.visibility = 'visible';
    }
    else if(response.success == false){
    	alert('The Authorization with TREZOR was failed!');
    }
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
    var path = "m/44'/60'/0'";
    // if(info.success == true){} //TODO

    var dataTx = contract.setName.getData(postData['string']);
    var nonce = await getNonce(postData['address']);
    if(nonce != 0) { nonce = "0x" + nonce.toString(16)}
    else { nonce = "0x0" }
    var rawTransaction = {
        nonce: nonce,
        gasPrice: "0x" + (await getPrice()).toString(16),
        gasLimit: "0x493E0",
        to: contractAddress,
        value: "0x0",
        data: dataTx,
        chainId: 4,
        from: postData['address'],
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
	            var _id = '#id_' + postData['item_id'];
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
					url: '/update-tx/' + postData['item_id'],
					type: 'POST',
					data: postData, 
					success:function (response) {
					  	$("#alert-msg").html("<strong>Success! </strong>Transaction has sent and updated.");
						$("#alert_block").attr("class", "alert alert-success");
						$("#alert_block").fadeTo(4000, 500).slideUp(500, function(){
				   			$("#alert_block").slideUp(500);
						});
						var image = $(_id).parents().eq(1).children(".field-sent_tx").children("img");
						image.attr("src", "/static/admin/img/icon-yes.svg");
						image.attr("alt", "True");
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
		var err = response.payload.error
		$("#alert-msg").html("<strong>Fail! </strong>Transaction hasn't sent. " + err);
    	$("#alert_block").attr("class", "alert alert-danger");
    	$("#alert_block").fadeTo(4000, 500).slideUp(500, function(){
           $("#alert_block").slideUp(500);
        });
	}
}
