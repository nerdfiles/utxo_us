# Server Administration

## Node and NPM

    $ apt-get install nodejs
    $ apt-get install npm
    $ sudo ln -s /usr/bin/nodejs /usr/bin/node
    $ npm update npm
    $ npm install -g bower


### If permissions errors persist:

    $ sudo chown -R $(whoami) "$HOME/.npm"


## Running the app

    $ cd /home/sutton_spectre
    $ gunicorn --bind 0.0.0.0:8000 app.wsgi:application --pythonpath /root/.envs/HOONM5gpFswaVA_utxo/lib/python2.7/site-packages


## Load balancers

Likely will not work in the interim. Must fix.

    /etc/gunicorn.d/gunicorn.py

Or:

    supervisorctl start gunicorn # check /etc/supervisord.conf


## Getting started with Python:

    $ sudo apt-get install python-setuptools python-dev build-essential


### Install pip:

    $ sudo apt-get install python-pip


### Install virtualenv:

    $ pip install virtualenv


### Install virtualenvwrapper:

    $ pip install virtualenvwrapper

Now, you are ready to start using virtualenv.

### Bash Profile

Open ~/.bashrc and add the following two lines:

    $ export WORKON_HOME=$HOME/.envs
    $ source /usr/local/bin/virtualenvwrapper.sh


### Reload Bash Profile

Save the bashrc file and run the following on your terminal:

    $ source ~/.bashrc


## Virtual Environments

Create a virtual environment called "new_virtual_env" by using the following command:

    $ mkvirtualenv new_virtual_env


Activate your new virtual environment by using:

    $ workon new_virtual_env


When your work is done, deactivate the virtual environment you are in by using:

    $ deactivate new_virtual_env

## Package-based Installation

Install UTXO’s Python requirements via `pip`

    $ pip install -r requirements.max.txt


## Ubuntu Dependencies

    $ sudo apt-get install libncurses5-dev libffi-dev

    $ pip install gnureadline

## Aliases for Django

Aliases for Django have been installed at ``$HOME/.bashrc.local``.
