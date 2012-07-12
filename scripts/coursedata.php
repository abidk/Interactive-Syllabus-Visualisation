<?
// not neccessary
//header('Content-type: text/json');

require_once("/www/htdocs/intranet/ACSO/php/SyllabiOracleDatabase.php");
require_once("JSON.php");

$database = new SyllabiOracleDatabase;
$json = new Services_JSON();
$programme = str_replace("SPLUS","#SPLUS",$_GET["programme"]);


$details = $database->getProgrammeOptionsWithSyllabusInfo($programme, 2007);

$newArray = array();
foreach($details as $detail)
{ 
       $a2 = array();
       $a2["PROGRAMME_LEVEL"] = $detail["PROGRAMME_LEVEL"];
       $a2["OPTION_POOL_NAME"] = $detail["OPTION_POOL_NAME"];
       $a2["MAX_CREDITS"] = $detail["MAX_CREDITS"];
       $a2["MIN_CREDITS"] = $detail["MIN_CREDITS"]; 
    	$a2["TITLE"] = $detail["TITLE"];
       $a2["CODE"] = $detail["NEWCODE"];
       $a2["SEMESTER"] = $database->getSemesterForUnit($detail["NEWCODE"]);
       $a2["CREDITS"] = $detail["CREDITS"];
       $a2["PREREQ1"] = $detail["PREREQ1"];
       $a2["COREQ1"] = $detail["COREQ1"];
       $a2["WEBSITE"] = $detail["WEBSITE"];
       $a2["AIMS"] = $detail["AIMS"];

	//place a2 into newArray
    	$newArray[] = $a2;
}
$database->pa($newArray);
//print $json->encode($newArray);
?>