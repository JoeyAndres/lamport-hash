<?php
namespace Lamport{
    // database-adapter-concrete.php
    include_once 'lamport-database-adapter.php';
    include_once 'Database.php';

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