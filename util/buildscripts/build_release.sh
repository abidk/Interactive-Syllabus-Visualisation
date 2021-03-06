#!/bin/bash

#version should be something like 0.9.0beta or 0.9.0
version=$1
#svnUserName is the name you use to connect to Dojo's subversion.
svnUserName=$2
#The svn revision number to use for tag. Should be a number, like 11203
svnRevision=$3
#The branch in svn (e.g. branches/1.0)
svnBranch=$4

#If no svnRevision number, get the latest one from he repo.
if [ "$svnRevision" = "" ]; then
	svnRevision=`svn info http://svn.dojotoolkit.org/dojo/util/trunk/buildscripts/build_release.sh | grep Revision | sed 's/Revision: //'`
fi

tagName=release-$version
buildName=dojo-$tagName

#Make the SVN tag.
svn mkdir -m "Using r$svnRevision to create a tag for the $version release." svn+ssh://$svnUserName@svn.dojotoolkit.org/var/src/dojo/tags/$tagName
svn copy -r $svnRevision svn+ssh://$svnUserName@svn.dojotoolkit.org/var/src/dojo/$svnBranch/dojo/trunk svn+ssh://$svnUserName@svn.dojotoolkit.org/var/src/dojo/tags/$tagName/dojo -m "Using r$svnRevision to create a tag for the $version release."
svn copy -r $svnRevision svn+ssh://$svnUserName@svn.dojotoolkit.org/var/src/dojo/$svnBranch/dijit/trunk svn+ssh://$svnUserName@svn.dojotoolkit.org/var/src/dojo/tags/$tagName/dijit -m "Using r$svnRevision to create a tag for the $version release."
svn copy -r $svnRevision svn+ssh://$svnUserName@svn.dojotoolkit.org/var/src/dojo/$svnBranch/dojox/trunk svn+ssh://$svnUserName@svn.dojotoolkit.org/var/src/dojo/tags/$tagName/dojox -m "Using r$svnRevision to create a tag for the $version release."
svn copy -r $svnRevision svn+ssh://$svnUserName@svn.dojotoolkit.org/var/src/dojo/$svnBranch/util/trunk svn+ssh://$svnUserName@svn.dojotoolkit.org/var/src/dojo/tags/$tagName/util -m "Using r$svnRevision to create a tag for the $version release."

#Check out the tag
mkdir ../../build
cd ../../build
svn co --quiet svn+ssh://$svnUserName@svn.dojotoolkit.org/var/src/dojo/tags/$tagName $buildName
cd $buildName/util/buildscripts

#Update the dojo version in the tag
java -jar ../shrinksafe/custom_rhino.jar changeVersion.js $version ../../dojo/_base/_loader/bootstrap.js
cd ../../dojo
svn commit -m "Updating dojo version for the tag." _base/_loader/bootstrap.js

#Erase the SVN dir and replace with an exported SVN contents.
cd ../..
rm -rf ./$buildName/
svn --quiet export http://svn.dojotoolkit.org/dojo/tags/$tagName $buildName

# clobber cruft that we don't want in builds
rm -rf ./$buildName/dijit/themes/noir
rm -rf ./$buildName/dojox/off/demos
rm -rf ./$buildName/dojo/bench

#Make a src bundle
srcName=$buildName-src
mv $buildName $srcName
zip -rq $srcName.zip $srcName/
tar -zcf $srcName.tar.gz $srcName/
mv $srcName $buildName

#Make a buildscripts bundle
buildScriptsName=$buildName-buildscripts
mv $buildName $buildScriptsName
zip -rq $buildScriptsName.zip $buildScriptsName/util/buildscripts/
tar -zcf $buildScriptsName.tar.gz $buildScriptsName/util/buildscripts/
mv $buildScriptsName $buildName

#Run the build.
cd $buildName/util/buildscripts/
chmod +x ./build.sh
./build.sh profile=standard version=$1 releaseName=$buildName action=release
cd ../../release/

#Pause to allow manual process of packing Dojo.
currDir=`pwd`
echo "You can find dojo in $currDir/$buildName/dojo/dojo.js"
read -p "Build Done. If you want to pack Dojo manually, do it now, then press Enter to continue build packaging..."

#Continuing with packaging up the release.
zip -rq $buildName.zip $buildName/
tar -zcf $buildName.tar.gz $buildName/
mv $buildName.zip ../../
mv $buildName.tar.gz ../../

# md5sum the release files
cd ../../
for i in *.zip; do md5sum $i > $i.md5; done
for i in *.gz; do md5sum $i > $i.md5; done

#Finished.
outDirName=`pwd`
echo "Build complete. Files are in: $outDirName"
cd ../util/buildscripts
