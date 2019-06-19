FROM nodegui/docker-qt5-linux:5.12.4
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# BUILD QODE
# ==========
RUN mkdir ~/qode
WORKDIR /root/qode
ADD . /root/qode

RUN QT_INSTALL_DIR=/usr/local/qt5 node build.js

