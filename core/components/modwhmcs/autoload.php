<?php
function modwhmcs_autoloader($class) {
    include '/var/www/modx-extras/modwhmcs/core/components/modwhmcs/model/domains/' .
        str_replace('\\', '/',strtolower($class)) . '.class.php';

}

spl_autoload_register('modwhmcs_autoloader');