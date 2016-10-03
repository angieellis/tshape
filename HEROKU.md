# T-Shape 

```
git clone https://github.com/angieellis/tshape.git
```

## Install Python, Django Locally


Install Python 3, Pip & Postgres. You can check your version of Python using `python -V` and `pip -V`


From the project root, the following commands will install the Tshape app locally.

```
virtualenv venv
```
```
source venv/bin/activate
```
```
pip install requirements.txt
```
```
python src/manage.py collectstatic
```
```
python src/manage.py migrate
```
```
python src/manage.py db_seed
```
```
python src/manage.py runserver 0.0.0.0:8000
```



## Heroku

#### Download & install Heroku CLI 
[Download Heroku CLI Installer] (https://devcenter.heroku.com/articles/heroku-command-line#download-and-install)

```
heroku login
```

#### Create a Heroku remote
[Creating a Heroku remote] (https://devcenter.heroku.com/articles/git#creating-a-heroku-remote)

Instead of using `heroku create` to provision a new app on Heroku, we will be connecting an existing heroku app to our git remote. 

```
heroku git:remote -a tshape
```

You should now see a remote named 'heroku' when you do `git remote -v`

#### Deploying to Heroku

```
git push heroku master
```
This will deploy the local branch 'master' to the Heroku remote.

```
git push heroku localfeaturebranch:master
```
This will deploy any local branch to the Heroku remote.

```
heroku run python src/manage.py migrate
```
```
heroku run python src/manage.py db_seed
```
```
heroku open
```
Will open the live app in the browser

#### Heroku local

Instead of using `runserver 0.0.0.0:8000` to run a local server. You can run `heroku local` which will serve the website locally, using the Gunicorn webserver and Heroku procfile.

#### Heroku Docs
[Getting Started on Heroku with Python] (https://devcenter.heroku.com/articles/getting-started-with-python#introduction)