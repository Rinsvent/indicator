FROM rabbitmq:3.13.7-management

ADD ./docker/rabbitmq/conf/rabbitmq.config /etc/rabbitmq/
ADD ./docker/rabbitmq/conf/definitions.json /etc/rabbitmq/
RUN chown rabbitmq:rabbitmq /etc/rabbitmq/rabbitmq.config

RUN rabbitmq-plugins enable rabbitmq_stream

EXPOSE 15672
EXPOSE 5672
