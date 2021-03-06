# flower 1.0.1

This Dockerfile builds an image to run the [Celery Flower][1] monitoring tool for [Celery][2]
task queues. It uses the 1.0.1 development version. The image is not meant to be run stand-alone.
The container will wait for the [RabbitMQ][3] service to begin responding before it launches.

Images are tagged with the version of Flower installed. Additional tags include the build date,
for reproducing environments. e.g. jbei/flower:1.0.1 will point to the latest build that uses
Flower v1.0.1, and jbei/flower:1.0.1-20180613 will point to the image built on 13 June, 2018.

The container makes use of the following environment:
* __AMQP_ADMIN_HOST__: the host to use when connecting to RabbitMQ admin (default `rabbitmq`)
* __AMQP_ADMIN_PORT__: the port to use when connecting to RabbitMQ admin (default `15672`)
* __AMQP_ADMIN_USERNAME__: the username to use when connecting to RabbitMQ admin (default `guest`)
* __AMQP_HOST__: the host to use when connecting to RabbitMQ (default `rabbitmq`)
* __AMQP_PORT__: the port to use when connecting to RabbitMQ (default `5672`)
* __AMQP_USERNAME__: the username to use when connecting to RabbitMQ (default `guest`)
* __FLOWER_MAX_TASKS__: the maximum number of tasks to keep in memory (default `3600`)
* __FLOWER_PASSWORD__: the password used to access the Flower interface w/ HTTP Basic Auth
* __FLOWER_PASSWORD_FILE__: a file containing a password in lieu of using __FLOWER_PASSWORD__
* __FLOWER_PORT__: the port used to access the Flower interface (default `5555`)
* __FLOWER_URL_PREFIX__: the URL prefix to access the Flower interface from a non-root URL (root
  is default)
* __FLOWER_USERNAME__: the username used to access the Flower interface w/ HTTP Basic Auth
  (default `root`)

The container expects to find Docker secrets of the following names:
* __flower_amqp_admin_password__: the password to use when connecting to RabbitMQ admin
  (default `guest`)
* __flower_amqp_password__: the password to use when connecting to RabbitMQ
  (default `guest`)
* __flower_basic_auth__:the HTTP Basic Auth string used to access the Flower interface
  (default constructed using __flower_amqp_password__)
* __flower_broker_api__: the full connection URL when connecting to RabbitMQ admin
  (defaults to constructed URL using __flower_amqp_admin_password__)
* __edd_broker_url__: the full connection URL when connecting to RabbitMQ
  (defaults to consturcted URL using __flower_amqp_password__)

---------------------------------------------------------------------------------------------------

[1]:    http://flower.readthedocs.io/en/latest/
[2]:    http://www.celeryproject.org/
[3]:    ../rabbitmq/README.md
