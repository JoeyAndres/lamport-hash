<?php
namespace Lamport{
    include_once 'lamport-database-adapter-concrete.php';
    include_once 'lamport-state.php';

    if(session_status() != PHP_SESSION_ACTIVE){        
        session_start();
    }

    $dba = new DatabaseAdapterConcrete();

    if(isset($_REQUEST['requestType']) &&
       ($_REQUEST['requestType'] == 'userName')){
        $lunr = new LamportUserNameRec($dba, $_REQUEST['userName']);
        $lunr->clientReply();
    }else if(isset($_REQUEST['requestType']) &&
             ($_REQUEST['requestType'] == 'nm1')){
        $lnm1 = new LamportNM1($dba, $_REQUEST['nm1_hash']);
        $lnm1->clientReply();
    }else if(isset($_REQUEST['requestType']) &&
             $_REQUEST['requestType'] == 'reissue_authentication'){
        $lra = new LamportReissueAuthentication($dba,
                                                $_REQUEST['userName'],
                                                $_REQUEST['password']);
        $lra->clientReply();
    }else if(isset($_REQUEST['requestType']) &&
             ($_REQUEST['requestType'] == 'reissue_finalize')){
        $lrf = new LamportReissueFinalize($dba,
                                          $_REQUEST['newPass'],
                                          $_REQUEST['newN']);
        $lrf->clientReply();
    }
}
?>