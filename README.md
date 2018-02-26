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

### Local Development:
1. Open your terminal of choice and do the following to clone and configure RoboRecon into your local file system:
  ```
  > git clone https://github.com/your-github-account/roborecon-app.git
  > cd roborecon-app 
  > bundle install
  > bundle update
```
2. Open up the contents of the robo-recon folder in your chosen development environment (we like using VSCode ourselves).

3. Open the `_config.yml` file and put in the following information (only if you haven’t already):

  * **REQUIRED**:  Under “Base Site Settings”
    - url: The URL you specified from step #2 in the “Configure” section above.  
    - If you are using something like “http://your-github-account.github.io/roborecon-app” for your URL, you also need to set baseurl equal to /roborecon-app (or whatever you have after the base hostname to your site).

  * **REQUIRED**:  Under the “scout” config option in “Scouting System Settings”
    - teamkey: <your team #>
    - tbaApiKey: <your TBA READ API key> (get here if you don’t have one)
    - currentevent: <TBA event key> (for the event you want to scout)

*!!! DO NOT CHANGE anything under the “firebase” config … the app will not function at all if you do !!!*

  * Optional settings:
    - Basically, everything else (title, email, description, header, social media links, etc…).  If you do change out the header image, make sure it is copied into the /images folder before you deploy.

4. Run the application locally by executing the following command in your terminal.  If successful, you will be able to see your scouting application running at http://localhost:4000.

  `> bundle exec jekyll serve` (Ctrl+C to stop running locally)

5. Deploy your application to github doing the following in your terminal.  Once you complete these steps, you should be able to see your own version of RoboRecon running on the web at the URL you specified in step #2 of the “Configure” section.
```
git add .
git commit -am ‘initial deploy’
git push
```

#### Working with RoboRecon on Windows 10

##### Approach 1: Using Ubuntu Subsystem (recommended)
1. If you don't have an editor installed, download VS Code (https://code.visualstudio.com/)
2. Install ubuntu base on windows. (https://docs.microsoft.com/en-us/windows/wsl/about)
3. Open a command prompt and then type the following:
```
bash
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-add-repository ppa:brightbox/ruby-ng
sudo apt-get update
sudo apt-get install ruby2.3 ruby2.3-dev build-essential
sudo gem update
sudo gem install bundler
sudo apt-get install build-essential patch ruby-dev zlib1g-dev liblzma-dev
sudo apt-get install nodejs
sudo apt-get install git
```

##### Approach 2: Using Docker
1. Download the correct version of docker CE (https://www.docker.com/community-edition)
2. If you don't have an editor installed, download VS Code (https://code.visualstudio.com/)

*At this point, you should restart your machine after everything is installed (some things fail to get added to your path or configured correctly until you do so).*

3. cd into the roborecon-app folder and try running docker-compose up. We've already created a docker-compose.yml file with all configuration details for a docker container that works for jekyll. If all goes well, you'll get a message that the web application is running on port 4000. If so, go to chrome at navigate to http://localhost:4000 ... you should see roborecon running on your machine.


## Other Useful Information

* [Clearing up baseurl confusion](https://byparker.com/blog/2014/clearing-up-confusion-around-baseurl/)

