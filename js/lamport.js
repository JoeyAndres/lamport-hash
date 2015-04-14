/**
 * @param userName in clear-text(unencrypted).
 * @param password in clear-text(unencrypted).
 */
function lamport(un, pw){
    this.userName = un;
    this.password = pw;

    /**
     * @param newPass
     * @param newN
     * @param reissueCallback
     */
    var reissueFinalize = function(newPass, newN, reissueCallback){
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
		//location.assign(optionalTransferLink);
		if(reissueCallback) reissueCallback();
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
     * @param reissueCallback callback function to be called when done reissue 
     *        password.
     */
    this.reissue = function(newPass, newN, reissueCallback){
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
		    reissueFinalize(newPass, newN, reissueCallback);
		}else{
		    // Reissue.
		    // Show errors.
		    alert("Reissue Error");
		}
	    }
	});
	
	return false;
    };

    /**
     * @param password
     * @n 
     * @param loginCallback
     */
    var nm1 = function(password, n, loginCallback){
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
		//alert(valid);
		console.log(valid);
		//location.href = "index.php";
		if(loginCallback) loginCallback();
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

    /**
     * @param loginCallback callback function to be called when login is success.
     * @param reissueCallback callback function to be called when password 
     *        reissue is needed.
     */
    this.verify = function(loginCallback, reissueCallback){	
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
		    if(reissueCallback) reissueCallback();
		}else{
		    nm1(password, n, loginCallback);
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
