## Demo Blog System
.nodejs backend with mongoDB/mongoose database and bootstrap templates / edge rendering frontend.
Could be used as base for an Infoterminal content management system.
Based upon https://vegibit.com/node-js-blog-tutorial/
see also: https://expressjs.com/de/guide/using-middleware.html
### Installation of MongoDB
* for PC/Mac install the binaries, see https://www.mongodb.com/download-center/community?jmp=docs)
* for RaspberryPi, there is an outdated version in the apt sources, so mongodb has to be build from source, see: https://koenaerts.ca/compile-and-install-mongodb-on-raspberry-pi
  Use the following build command: "scons mongo mongod –-disable-warnings-as-errors --wiredtiger=off --mmapv1=on --warn=no-all" 
  There was one compilation error (undefined reference to major and minor) which could be fixed by adding #include <sys/sysmacros.h> to the file src/mongo/db/storage/mmap_v1/mmap_v1_engine.cpp
  Create a database folder (eg. /home/pi/data_db) and start mongod with parameters "mongod --storageEngine=mmapv1 --dbpath=/home/pi/data_db"
 


