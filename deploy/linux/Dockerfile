FROM nodegui/docker-qt5-linux:5.13.0
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get install -y libgtk-3-dev curl
# INSTALL NODEJS
# ==============
RUN mkdir -p /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION v12.4.0
ENV IS_DOCKER true
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default  \
    && nvm use default
ENV PATH $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH
# BUILD QODE
# ==========
RUN mkdir ~/qode
ADD . /root/qode

WORKDIR /root/qode

RUN QT_INSTALL_DIR=/usr/local/qt5 node build.js

