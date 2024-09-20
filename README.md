# We Are The Champions 

## Description
We Are The Champions is a web application designed to help users simulate the first round of a football competition. It provides an easy-to-use User Interface (UI) that allows all users to keep track of Team Details and Match Results. Users who are authorized can choose to Manage Data, including adding/editing/deleting both Teams and Matches, and View Logs to find out the recent changes made by other users. 

Visit the app at this link now: [http://we-are-the-champions-alb-1-532758427.ap-southeast-1.elb.amazonaws.com](http://we-are-the-champions-alb-1-532758427.ap-southeast-1.elb.amazonaws.com)

This application was completed as the technical assessment for GovTech TAP 2025.

## Quick Start with Docker

1. Ensure that you have Docker Compose installed on your device. If you don't have Docker Compose installed, you can follow the installation instructions on the official Docker website: [Install Docker Compose](https://docs.docker.com/compose/install/)

2. Clone or download the source code of Weigh-To-Go application.

3. Navigate to the directory containing the docker-compose.yml file.
  <pre>
    cd we-are-the-champions
  </pre>

5. Run the following command to start the application:
<pre>
    docker-compose up -d 
</pre>

<span style="color: red;">This command can only be executed with a .env file. Please contact me to get the .env file. </span>


5. Open a web browser and navigate to [https://localhost:3000](https://localhost:3000). You should see the home page.



