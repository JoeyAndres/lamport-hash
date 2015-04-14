<?php
namespace Lamport{
    // lamport-database-adapter.php

    /**
     * User class to encapsulate the user object needed by Database
     * Adapter.
     */
    class User{
        public $userName = null;
        public $password = null;
        public $n = -1;

        public function __construct($userName, $password, $n){
            $this->userName = $userName;
            $this->password = $password;
            $this->n = $n;
        }
    }
    /*!@class DatabaseAdapter
     * @brief Database Adapter to be used by Lamport.php
     */
    abstract class DatabaseAdapter{
        abstract public function getUser($userName);
        abstract public function insertUser(User $user);
        abstract public function updateUser(User $user);
    }
}
?>