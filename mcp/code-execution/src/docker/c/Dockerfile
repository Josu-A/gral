FROM gcc:latest

RUN addgroup -S runner && adduser -S -G runner -H -s /sbin/nologin runner

RUN mkdir -p /opt/code-execution/src \
    /opt/code-execution/tests \
    /opt/code-execution/out \
    && chown -R runner:runner /opt/code-execution

WORKDIR /opt/code-execution

USER runner