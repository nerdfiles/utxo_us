# PostgreSQL

Login to the DB using

    $ psql

Or:

    $ sudo su - postgres
    $ psql

## Typical Database Commands:

    drop database hoonm5gpfswava_utxo;
    create database hoonm5gpfswava_utxo;

    create user admin with password 'NrVkXa2ho+Hjsw==';
    alter database hoonm5gpfswava_utxo owner to admin;

    grant all privileges on database HOONM5gpFswaVA_utxo to admin;

# Getting started with PostgreSQL

    $ sudo vim /etc/postgresql/9.3/main/pg_hba.conf

Search for ``local   all`` and you will find the line:

    local   all             postgres                                peer

Change the above line to:

    local   all             postgres                                md5

Then restart the PostgreSQL server with

    $ sudo service postgresql restart


