<?php
$file_headers= @get_headers('http://img.youtube.com/vi/' . $_GET['video_id'] . '/maxresdefault.jpg');

if(strpos($file_headers[0],'404 Not Found')) {

	echo 0;

}

else {
	echo 1;
}
?>
