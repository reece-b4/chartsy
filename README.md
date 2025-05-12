will need to symbolic link to backend types for development
on mac:
ln -s <path to BE types dir from DESTINATION path> <user created destination path>
eg:
ln -s ../../chartsyBE/src/types src/chartsyBE-types

on windows:
New-Item -ItemType SymbolicLink -Path <link-name> -Target <target>

or just create

do not edit created chartsyBE-types in root of FE dir. Fe will auto update according to BE type changes
