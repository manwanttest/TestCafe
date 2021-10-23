FROM testcafe/testcafe:0.23.3-alpha.3
USER root
RUN mkdir /usr/share/testcafedocker
WORKDIR /usr/share/testcafedocker
COPY ./ .
RUN  npm install
RUN  npm rebuild
ENTRYPOINT ["npm", "run"]