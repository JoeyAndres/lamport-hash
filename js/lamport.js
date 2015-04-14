/**
 * @param userName in clear-text(unencrypted).
 * @param password in clear-text(unencrypted).
 */
function lamport(un, pw){
    this.userName = un;
    this.password = pw;

    var reissueFinalize = function(newPass, newN, optionalTransferLink){
	var val = newPass;
	for(var i = 0; i < newN; i++){
	    val = md5(val);
	}
	
	$.ajax({
	    type: "POST",
	    url: "../php/lamport.php",
	    data: {
		'requestType': 'reissue_finalize',
		'newPass': val,
		'newN': newN
	    },
	    success: function(valid){
		location.assign(optionalTransferLink);
	    },
	    error: function(x,e){
		if(x.status==0){
		    alert('You are offline!!\n Please Check Your Network.: ');
		}else if(x.status==404){
		    alert('Requested URL not found.');
		}else if(x.status==500){
		    alert('Internel Server Error.');
		}else if(e=='parsererror'){
		    alert('Error.\nParsing JSON Request failed.');
		}else if(e=='timeout'){
		    alert('Request Time out.');
		}else {
		    alert('Unknow Error.\n'+x.responseText);
		}
	    }
	});
    };

    /**
     * @param newPass, new password.
     * @param newN new n, how many logins before password is reissued again.
     */
    this.reissue = function(newPass, newN, optionalTransferLink){
	if (typeof optionalTransferLink === 'undefined') {
	    optionalTransferLink = '';
	}
	
	var userName = this.userName;
	var currentPw = md5(this.password);

	// Send the password and username first.
	$.ajax({
	    type: "POST",
	    url: "../php/lamport.php",
	    data: {
		'requestType': 'reissue_authentication',
		'userName': userName,
		'password': currentPw
	    },
	    success: function(valid){
		console.log(valid);
		if(valid == "VALID"){
		    // Valid.
		    // Hash the newPass n times.
		    reissueFinalize(newPass, newN, optionalTransferLink);
		}else{
		    // Reissue.
		    // Show errors.
		    alert(valid);
		}
	    }
	});
	
	return false;
    };

    var nm1 = function(password, n){
	// Hash password n-1 times.
	var val = password;
	for(var i = 0; i < n-1; i++){
	    val = md5(val);
	}
	
	$.ajax({
	    type: "POST",
	    url: "../php/lamport.php",
	    data: {
		'requestType': 'nm1',
		'nm1_hash': val
	    },
	    success: function(valid){
		alert(valid);
		console.log(valid);
		location.href = "index.php";
	    },
	    error: function(x,e){
		if(x.status==0){
		    alert('You are offline!!\n Please Check Your Network.: ');
		}else if(x.status==404){
		    alert('Requested URL not found.');
		}else if(x.status==500){
		    alert('Internel Server Error.');
		}else if(e=='parsererror'){
		    alert('Error.\nParsing JSON Request failed.');
		}else if(e=='timeout'){
		    alert('Request Time out.');
		}else {
		    alert('Unknow Error.\n'+x.responseText);
		}
	    }
	});

	return false;
    };

    this.verify = function(optionalReissueLink){
	if (typeof optionalReissueLink === 'undefined') {
	    optionalReissueLink = '';
	}
	var userName = this.userName;
	var password = this.password;
	
	// Send user name.
	$.ajax({	    
	    type: "POST",
	    url: "../php/lamport.php",
	    data: {
		'requestType': 'userName',
		'userName': userName
	    },
	    success: function(n){
		//alert(n);
		if(n == "PASSWORD_REISSUE"){
		    location.assign(optionalReissueLink);
		}else{
		    nm1(password, n);
		}
	    },
	    error: function(x,e){
		if(x.status==0){
		    alert('You are offline!!\n Please Check Your Network.');
		}else if(x.status==404){
		    alert('Requested URL not found.');
		}else if(x.status==500){
		    alert('Internel Server Error.');
		}else if(e=='parsererror'){
		    alert('Error.\nParsing JSON Request failed.');
		}else if(e=='timeout'){
		    alert('Request Time out.');
		}else {
		    alert('Unknow Error.\n'+x.responseText);
		}
	    }
	});
	
	return false;
    };
}
