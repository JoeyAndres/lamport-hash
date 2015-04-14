<?php
namespace Lamport{
    //LamportState.php
    include_once 'lamport-database-adapter.php';

    abstract class LamportState{
        protected $_user = null;
        protected $_dba = null;
    
        public function __construct(DatabaseAdapter $dba, $userName){
            $this->_dba = $dba;

            try{
                $this->_user = $this->_dba->getUser($userName);
            }catch(Exception $e){
                // No users.
                $this->clientErrorReply($e->getMessage());
            }
        }

        function __destruct(){}

        /**
         * Send specifically a an Internal Server error.
         */
        public function clientErrorReply($errorMsg){
            header('HTTP/1.1 500 '+$errorMsg);
            header('Content-Type: application/json; charset=UTF-8');
            die(json_encode(array('message' => $errorMsg, 'code' => 1338)));
        }
    
        /**
         * Call to "echo" back to client.
         */
        abstract public function clientReply();

        /**
         * Save session variables that are useful for this session.
         */
        protected function saveSession(){
            $_SESSION['userName'] = $this->_user->userName;
            $_SESSION['password'] = $this->_user->password;
            $_SESSION['n'] = $this->_user->n;
        }

        /**
         * Called to not completely destroy current
         * session, just nullify the session variables
         * used in this session.
         */
        protected function nullifySessionVariables(){
            $_SESSION['userName'] = null;
            $_SESSION['password'] = null;
            $_SESSION['n'] = null;
        }

        private function destroy($var){
            if(isset($var)) $var = null;
        }

        /**
         * Completely destroy current session. Called during
         * errors and failures.
         */
        protected function destroySession(){
            $this->nullifySessionVariables();
            if(isset($_SESSION["login"]))
                $_SESSION["login"] == false;
        
            session_unset();
            session_destroy();
        }
    }

    class LamportUserNameRec extends LamportState{
        public function __construct(DatabaseAdapter $dba, $userName){
            parent::__construct($dba, $userName);
        }

        public function clientReply(){
            if($this->_user->n == 1){
                $this->destroySession();
                echo "PASSWORD_REISSUE";
            }else{
                $this->saveSession();
                echo $this->_user->n;
            }
        }
    }

    class LamportNM1 extends LamportState{
        protected $_nm1Hash = null;
    
        public function __construct(DatabaseAdapter $dba, $nm1Hash){
            // TODO: deal with no past session.
            parent::__construct($dba, $_SESSION['userName']);
            $this->_nm1Hash = $nm1Hash;
        }

        public function clientReply(){
            $valid = ($this->_user->password == md5($this->_nm1Hash));
        
            if($valid){
                $this->_dba->updateUser(new User($this->_user->userName,
                                                 $this->_nm1Hash,
                                                 $this->_user->n-1));
                $_SESSION['login'] = true;
            }else{
                $this->destroySession();
            }

            header('Access-Control-Allow-Origin: *'); 
            echo $valid? "VALID" : "INVALID";
        }
    }

    class LamportReissueAuthentication extends LamportState{
        private $_password = null;  // Reissued password to be authenticated.

        public function __construct(DatabaseAdapter $dba, $userName, $password){
            parent::__construct($dba, $userName);
            $this->_password = $password;
        }

        public function clientReply(){
            $valid = ($this->_password == $this->_user->password);

            if($valid){
                $this->saveSession();
            
            }else{
                // No point of going on, client have to restart.
                $this->destroySession();
            }

            echo $valid? "VALID":"INVALID";
        }
    }

    class LamportReissueFinalize extends LamportState{
        private $_newPass = null;
        private $_newN = null;

        public function __construct(DatabaseAdapter $dba, $newPass, $newN){
            parent::__construct($dba, $_SESSION['userName']);
            $this->_newPass = $newPass;
            $this->_newN = $newN;

            try{
                $this->_dba->updateUser(new User($_SESSION['userName'],
                                                 $this->_newPass,
                                                 $this->_newN));           
            }catch(Exception $e){
                // User doesn't exist, or some other error to deal with.            
                $this->destroySession();
            }
        }

        public function clientReply(){
            $this->destroySession();

            echo "1";
        }
    }
}
?>