FROM eclipse-temurin:25-jdk-alpine

ARG JUNIT_VERSION=6.0.3
ENV JUNIT_JAR=/opt/junit/junit-platform-console-standalone.jar

RUN mkdir -p /opt/junit \
    && wget -q -O "$JUNIT_JAR" \
        "https://repo1.maven.org/maven2/org/junit/platform/junit-platform-console-standalone/${JUNIT_VERSION}/junit-platform-console-standalone-${JUNIT_VERSION}.jar" \
    && chmod 0444 "$JUNIT_JAR"

RUN addgroup -S runner && adduser -S -G runner -H -s /sbin/nologin runner

RUN mkdir -p /opt/code-execution/src \
    /opt/code-execution/tests \
    /opt/code-execution/out \
    && chown -R runner:runner /opt/code-execution

WORKDIR /opt/code-execution

USER runner