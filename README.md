# RoboRecon
[![Build Status](https://travis-ci.org/Paradox2102/roborecon-app.svg?branch=master)](https://travis-ci.org/Paradox2102/roborecon-app)
RoboRecon is a FRC scouting application designed by FIRST Team Paradox 2102. This software was developed to assist FRC teams in more easily analyzing match data for FIRST Robotics Competitions. 

## RoboRecon is a Open Source FRC Scouting software
  - Powered by [Firebase](https://firebase.google.com/)
  - Hosted on Github
  - Made with Jekyll
  - Part-Magic

## How to configure RoboRecon for your team
### Quick & Easy (baseline configuration needed to get a production version operational):

1. Create a fork of the project the RoboRecon github repo (https://github.com/Paradox2102/roborecon-app) into your team’s github account

2. Delete the CNAME file if you are going to use the default URL github provides (e.g., https://your-github-account.github.io/roborecon-app/) or set it to whatever you are going to configure it to run as (eg. roborecon.yourteam.org).

  * If you are setting up a custom URL, please see the instructions here on how to configure DNS to play nice with github-pages

3. Submit your team number, an administrator email, and application URL from step #2 using [this form](https://goo.gl/forms/U9m5MNoIu6P4GNiD3). We will notify you after your team has been added to the scouting database. 

  * NOTE: the administrator's e-mail MUST either be a Gmail account or associated to a Github account.

4. Open the _config.yml file in github for editing and make the following changes:
  - **REQUIRED**:  Under “Base Site Settings”
    - url: The URL you specified from step #2 in the “Configure” section above.  
    - If you are using something like “http://your-github-account.github.io/roborecon-app” for your URL, you also need to set baseurl equal to /roborecon-app (or whatever you have after the base hostname to your site).

  - **REQUIRED**:  Under the “scout” config option in “Scouting System Settings”
    - teamkey: <your team #>
    - currentevent: <TBA event key> (for the event you want to scout)

 *!!! DO NOT CHANGE anything under the “firebase” config … the app will not function at all if you do !!!*

  - *Optional settings*:
    - Basically, everything else (title, email, description, header, social media links, etc…).  If you do change out the header image, make sure it is copied into the /images folder before you deploy.

This is all you need to do to give your team a robust, extendable, and working scouting system!  Initially, only the team administrator will be login using the e-mail address provided in step #3 of the “Configure” section. The team admin will be able to whitelist other users for access, assign other administrators, and add event data for events your team is scouting.

### Development

Want to contribute? Great! Feel free to submit a pull request for any improvements, additions, or fixes you make and want to see implemented in the core framework

If you'd rather manage your own Firebase database you are free to do so.  Just update the appropriate attributes in the `config.yml` file to point to your independent instanace.  ***Note: if you go this route we can't promise that future versions of the application will be compatible with your scheama, so be forewarned.

We'll be updating the README file and Wiki over the next few months with more information on how you can use this framework to build a tailored scouting application for your team.  If you have suggestions on what to include or improvements on what we have thus far, please let us know!


### Other Useful Information

* [Clearing up baseurl confusion](https://byparker.com/blog/2014/clearing-up-confusion-around-baseurl/)

