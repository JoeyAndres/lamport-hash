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
        /**
         * @param $userName the user to be retrieved.
         * @return a User class, the data required by Lamport hash.
         * @see User.
         * @throws Exception when no user exist.
         */
        abstract public function getUser($userName);

        /**
         * @param $user User instance to be inserted in server.
         */
        abstract public function insertUser(User $user);

        /**
         * @param $user User instance that will update the corresponding
         *              user in server.
         */
        abstract public function updateUser(User $user);
    }
}
?>