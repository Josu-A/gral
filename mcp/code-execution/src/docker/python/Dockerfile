FROM python:3.14-alpine

ARG PYTEST_VERSION=9.0.3

RUN pip install --no-cache-dir --root-user-action=ignore pytest==${PYTEST_VERSION}

RUN addgroup -S runner && adduser -S -G runner -H -s /sbin/nologin runner

RUN mkdir -p /opt/code-execution/src \
    /opt/code-execution/tests \
    && chown -R runner:runner /opt/code-execution

WORKDIR /opt/code-execution

USER runner