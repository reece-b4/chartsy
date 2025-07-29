will need to symbolic link to backend types for development
on mac:
ln -s <path to BE types dir from DESTINATION path> <user created destination path>
eg:
ln -s ../../chartsyBE/src/types src/chartsyBE-types

DO NOT USE SYMLINK IF USING cI/CD PIPELINE AS IT WILL NOT RESOLVE PATH TO LINKED FILE/S

on windows:
New-Item -ItemType SymbolicLink -Path <link-name> -Target <target>

or just create

do not edit created chartsyBE-types in root of FE dir. Fe will auto update according to BE type changes

and same for 
ln -s ../chartsyBE/.prettierrc .prettierrc
ln -s ../chartsyBE/.prettierignore .prettierignore

!!now using custom npm package for types!!


!! to deploy docker needs to be running and first run npm run jenkins:start at start of session/day to ensure jenkins and ngrok are running


jenkins:
starting jenkins with brew does not inherit shells environment so will not be able to use docker commands
docker needs to be running for jenkins to deploy
run jenkins docker image and configure via jenkins dashboard linked to that instance! ensure it is not using your local instance! (if intended)
have gone with using jenkins local version not docker jenkins image
jenkins in docker also doesn't have access to docker commands
run rankins using .war package?
fix for error was:
https://medium.com/@bectorhimanshu/fix-for-the-error-docker-command-not-found-when-building-docker-image-using-jenkins-pipeline-on-db1bc5fa7976
using brew to run start jenkins and is working now

reverted to npm as using jenkins/docker pipeline, docker will need to have pnpm installed globally which comes with more issues, like permissions to mkdir in to not writeable dirs
best to use same package manager for local and deployed code to prevent potential errors caused by differences defeating the purpose of using docker

after implementing testing via vitest
once jenkins works via build 
go back to scripts and see if all that is still needed
test pipeline with git push to main