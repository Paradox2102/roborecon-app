# RoboRecon
[![Build Status](https://travis-ci.org/Paradox2102/roborecon-app.svg?branch=master)](https://travis-ci.org/Paradox2102/roborecon-app)
RoboRecon is a FRC scouting application designed by FIRST Team Paradox 2102. This software was developed to assist FRC teams in more easily analyzing match data for FIRST Robotics Competitions. 

## RoboRecon is a Open Source FRC Scouting software
  - Powered by [Firebase](https://firebase.google.com/)
  - Hosted on Github
  - Made with Jekyll
  - Part-Magic

### Setup

1. Submit your team number, an administrator e-mail, and preferred subdomain using [this form](http://s.team2102.com/roborecon).  We will notify you after your team has been added to the scouting database. ***NOTE: the administrator's e-mail MUST either be a Gmail account or associated to a Github account.***

2. Fork this repo and configure your repository as desired

3. Clone your repository to develop locally.  There are several options to running your application but the prefered way is to use [Docker](https://www.docker.com/).  If you are using Docker, to run the application locally in an enviroment properly configured for Ruby and Jekyll, is as simple as `cd`ing into your project directory and running `docker-compose up` from your terminal.

Another options is to use CodeEnvy Factory here: https://codenvy.io/f?id=factoryhwp1rln1b26vq11k

4. Update the `config.yml` with your team number and update any of the other configuration options as desired.  You can also update the `js/config.js` file to customize what data is shown on what screens, how scoring elements are aggregated, create custom scoring elements, and define the score categories for your scouters.  Everything is customizable to whatever you need.

5. After you are done with configuring your application instance, commit your work to git and `git push` everything up to your Github repo.

6. Configure your web application to be hosted via Github Pages ([docs](https://pages.github.com/)) using your subdomain (e.g., paradox.roborecon.org).  Once this is done, your team's scouting application will be available at that URL. Initially, only the team administrator will be login using the e-mail address provided.  The team admin will abe able to whitelist other users for access as well as assign other administrators, in addition to being able to add event data for events your team is scouting.


### Development

Want to contribute? Great! Feel free to submit a pull request for any improvements, additions, or fixes you make and want to see implemented in the core framework

If you'd rather manage your own Firebase database you are free to do so.  Just update the appropriate attributes in the `config.yml` file to point to your independent instanace.  ***Note: if you go this route we can't promise that future versions of the application will be compatible with your scheama, so be forewarned.

We'll be updating the README file and Wiki over the next few months with more information on how you can use this framework to build a tailored scouting application for your team.  If you have suggestions on what to include or improvements on what we have thus far, please let us know!


### Other Useful Information

* [Clearing up baseurl confusion](https://byparker.com/blog/2014/clearing-up-confusion-around-baseurl/)

