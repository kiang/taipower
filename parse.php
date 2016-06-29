<?php
date_default_timezone_set('Asia/Taipei');
require('spreadsheet-reader/SpreadsheetReader.php');
$finalHeaders = $finalLines = array();
foreach(glob(__DIR__ . '/*.ods') AS $odsFile) {
  $Spreadsheet = new SpreadsheetReader($odsFile);
  $Sheets = $Spreadsheet->Sheets();
  foreach ($Sheets as $Index => $Name){
    $Spreadsheet->ChangeSheet($Index);
    $colsIndex = false;
    $header = array();
    foreach ($Spreadsheet as $Key => $Row) {
      if(false === $colsIndex) {
        foreach($Row AS $k => $v) {
          if(!empty($v) && $colsIndex < $k) {
            $colsIndex = $k;
          }
        }
        for($i = 0; $i < $colsIndex; $i++) {
          $header[] = $Row[$i];
          if(!isset($finalHeaders[$Row[$i]])) {
            $finalHeaders[$Row[$i]] = true;
          }
        }
      } else {
        $body = array();
        for($i = 0; $i < $colsIndex; $i++) {
          $body[] = $Row[$i];
        }
        $finalLines[] = array_combine($header, $body);
      }
    }
  }
}

$fh = fopen(__DIR__ . '/records.csv', 'w');
fputcsv($fh, array_keys($finalHeaders));
foreach($finalLines AS $finalLine) {
  $line = array();
  foreach($finalHeaders AS $hKey => $hVal) {
    if(isset($finalLine[$hKey])) {
      $line[] = $finalLine[$hKey];
    } else {
      $line[] = '';
    }
  }
  fputcsv($fh, $line);
}
