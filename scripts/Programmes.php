<?
    // year determines which year's themes we are looking at e.g. 2007
    if (empty($_GET["year"]))
    {
      $_GET["year"] = date("Y");
      if (date("m")>9)
        $_GET["year"]++;
    }

//header('Content-type: text/json');

require_once("/www/htdocs/intranet/ACSO/php/SyllabiOracleDatabase.php");
require_once("JSON.php");

$database = new SyllabiOracleDatabase;
$json = new Services_JSON();

$year = "2007";
$level = "UG";



$programme = $database->getProgrammeInformation($level, $year);
//$database->pa($programme);
//$output = $json->encode($programme);
//print($output);

?>

<select style="width: 100px;" dojoType="combobox" id="degree">

<?
foreach($programme as $prog_detail)
{
  echo "<option value=\"";
  echo $prog_detail["HOSTKEY"];
  echo "\">";
  echo $prog_detail["NAME"];
  echo "</option>"; 
  echo "\n"; 
}
?>

</select>
