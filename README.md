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

```html
<form id="loginForm" method="post">
	Password: <input type="password" name="password" size="15" maxlength="30"
		id="passInput"/>
	<input id="adminLoginButton" type="submit" value="Login">
</form>
```

```javascript
<!--Note that src is location of lamport.js, wherever it may be located.-->
<script src="../js/lamport.js"></script>

<script>
var loginCallback = function(){
	location.assign("index.php");
}

var reissueCallback = function(){
	// Move to a page that allows password reissue.
	location.assign("reissue-password.php");
}
	
document.getElementById("loginForm").onsubmit = function(e){
	// This is critical, to avoid having multiple ajax request.
	e.preventDefault();

	var passInput = document.getElementById("passInput").value;
	var lt = new Lamport("userName", passInput);
	lt.verify(loginCallback, reissueCallback);
}
</script>
```

### Server Side:

Note that all the Lamport component are in namespace ```Lamport``` namespace.

1. Override ```Lamport\DatabaseAdapter```:

```php
<?php
namespace Lamport{
// lamport-database-adapter-concrete.php
include_once 'lamport-database-adapter.php';  // Abstract database adapter.
include_once 'Database.php';  // Database implementation in your server.

class DatabaseAdapterConcrete extends DatabaseAdapter{
	private $db = null;
	
	class DatabaseAdapterConcrete extends DatabaseAdapter{
        private $db = null;

        public function __construct(){
            $this->db = \Database::instance();
        }
    
        public function getUser($userName){
            $userArr = $this->db->getUser($userName);
            return new User($userArr[0], $userArr[1], $userArr[2]);
        }

        public function insertUser(User $user){
            for($i = 0; $i < $n; $i++){
                $password = md5($password);
            }
            $this->db->insertUser($user->userName, $user->password, $user->n);
        }

        public function updateUser(User $user){
            $this->db->updateUser($user->userName, $user->password, $user->n);
        }
    }
}
?>
```

## Todo:

1. Make an adapter for hashing algorithm. Currently, only md5 is allowed.
2. Allow password change in any _n_. Currently, password change is allowed,
   only when _n = 1_.


[seq-diag]: https://github.com/JoeyAndres/lamport-hash/blob/master/lamport-hash-sequence-diagram.png "Lamport's Hash Sequence Diagram"
