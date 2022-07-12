sudo apt install gcc-8 g++-8 -y
sudo apt install libssl-dev libcurl4-openssl-dev -y
sudo apt install git
cd ~/Software  # that's where I keep my software sources
git clone -b r4.4.3 https://github.com/mongodb/mongo.git
cd mongo
screen  # use screen, because compiling runs very long time - for me on 4B with 8GB ram it was 6hours 25minutes
# here you should consider using virtualenv
python3 -m pip install -r etc/pip/compile-requirements.txt
time python buildscripts/scons.py --ssl CC=gcc-8 CXX=g++-8 CCFLAGS="-march=armv8-a+crc -mtune=cortex-a72" --install-mode=hygienic --install-action=hardlink --separate-debug archive-core
sudo cp ~/Software/mongo/build/install/bin/* /usr/bin/