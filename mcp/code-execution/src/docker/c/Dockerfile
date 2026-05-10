FROM gcc:latest

RUN groupadd --system runner && useradd --system --gid runner --no-create-home --shell /sbin/nologin runner

RUN mkdir -p /opt/code-execution/src \
    /opt/code-execution/tests \
    /opt/code-execution/out \
    && chown -R runner:runner /opt/code-execution

WORKDIR /opt/code-execution

USER runner