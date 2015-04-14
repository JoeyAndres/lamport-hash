# lamport-hash
Lamport hash implementation for both PHP server and JavaScript client.

## Introduction:

Lamport's hash allows the client (Alice) to talk to the server (Bob) in a way
that neither _eavesdropping_ nor breaking in the server compromise the
Alice's password.

That means, if John were to intercept the network between
Alice and Bob, the data that John will gather will not help him impersonate
Alice. And if John were to infiltrate the server Bob, the data in Bob
will not help John impersonate Alice.

### Sequence Diagram

![alt text][seq-diag]

## Instructions:

### Client Side:

```
<form id="loginForm" method="post">
	Password: <input type="password" name="password" size="15" maxlength="30" id="passInput"/>
	<input id="adminLoginButton" type="submit" value="Login">
</form>
	
<!--Note that src is location of lamport.js, wherever it may be located.-->
<script src="../js/lamport.js"></script>

<script>
var loginCallback = function(){
	location.assign("index.php");
}

var reissueCallback = function(){
	location.assign("reissue-password.php");  // Move to a page that allows password reissue.
}
	
document.getElementById("loginForm").onsubmit = function(e){
		e.preventDefault();  // This is critical, to avoid having multiple ajax request.

		var passInput = document.getElementById("passInput").value;
		var lt = new lamport("userName", passInput);
		lt.verify(loginCallback, reissueCallback);
}
</script>
```

### Server Side:



## Todo:

1. Make an adapter for hashing algorithm. Currently, only md5 is allowed.
2. Allow password change in any _n_. Currently, password change is allowed,
   only when _n = 1_.


[seq-diag]: https://github.com/JoeyAndres/lamport-hash/blob/master/lamport-hash-sequence-diagram.png "Lamport's Hash Sequence Diagram"
