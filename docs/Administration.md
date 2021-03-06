# Administration of EDD

## Common Maintenance/Development Tasks

Some of these sample commands will only work as written at JBEI, but should serve as useful
examples for common development tasks. Directions assume that Docker containers are already
running in the development environment.

* __Run automated tests__
    * Python tests: `docker-compose exec edd python manage.py test`

* __Test EDD/ICE communication__:
  `docker-compose exec edd /code/manage.py test_ice_communication`

* __Test email configuration__:
  `docker-compose exec edd /code/manage.py sendtestemail you@example.com`

* __Create an unprivileged test account__
  `docker-compose exec edd /code/manage.py edd_create_user`

* __Dump the production database to file and load into a local test deployment__
    * Create the dump file:

          pg_dump -h postgres.jbei.org -d eddprod -f edd-prod-dump.sql -U {your_username}

    * Load the dump file:
        * Backup and remove the existing `postgres_db` volume
        * Add the dump file to a volume mount in `/docker-entrypoint-initdb.d/` in the
          `postgres` service
        * Re-launch postgres with the new volumes

* __Rebuild Solr indexes:__
  `docker-compose exec edd /code/manage.py edd_index`


## Upgrading EDD

The simplest way to update EDD is to pull the newest image, then run `docker service update [NAME]`
on the EDD service name, when deploying with `docker stack deploy`. If using `docker-compose`
instead, a similar effect can be done with `docker-compose up -d`.
