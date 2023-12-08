## CapWise

* [Project Title](#Project)
* [Technologies](#technologies)
* [Contents](#)

# Project Title
helpER

## 1. Project Description
helpER is a mobile application that helps users find the nearest hospital with the shortest wait time. Users can also see the reviews of the hospitals and the waitlist status. Users can join the waitlist and save their favourite hospitals.

## 2. Names of Contributors
List team members and/or short bio's here... 
* Hi, my name is Eric! I am thrilled to be a part of this project!
* Hi, my name is Hsin Pang! I am exciting to create this useful application with you guys!
* I'm Misuzu! I am excited to start my first project of web application!
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* MapBox
* Geoapify
* Font Awesome (Icons)
* Adobe Fonts (Fonts)
* Adobe Stock Images (Images)
* Google Fonts (Fonts)

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* Start the login.html page
* Create an account
* Login
* Start using the app

## 5. Known Bugs and Limitations
Here are some known bugs:
* Hospital information page doesn't show how many teams are in the waitlist
* Map doesn't give directions to the hospital
* Hospitals are limited to the ones in the database
* Web scraping is not implemented yet
* Hospitals can't respond to reviews
* Users can't edit their reviews
* Users can't delete their reviews
* Users can't delete their accounts
* Pop up window doesn't match the overall aesthetic of the website


## 6. Features for Future
What we'd like to build in the future:
* Live chat between users and hospitals
* Web scraping to get more hospitals
* Users can edit their reviews
* Users can delete their reviews
* Users can delete their accounts
* Hospitals can respond to reviews
* Hospitals can edit their information
* Use Google Maps for directions

	
## 7. Contents of Folder
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to url
├── login.html               # login HTML file, the log-in page
├── main.html                # main HTML file, the landing page after log-in or user set-up
├── confirm_registration_edit.html  # page to notify personal information edit was successful
├── confirm_registration.html       # page to notify registration was successful
├── contact.html                    # contact page
├── favourite_hospitals.html        # favourite hospitals page
├── help.html                       # help page
├── hospital_detail.html            # hospital detail page
├── join_waitlist.html              # join waitlist page
├── map.html                        # map page
├── personal_info.html              # personal information page
├── post_review.html                # post review page
├── prompt_to_register.html         # prompt to register page
├── registration.html               # registration page
├── reservation.html                # reservation page
├── review.html                     # review page
├── search.html                     # search page
├── waitlist_confirmation.html      # waitlist confirmation page
├── waitlist_confirmed.html         # waitlist confirmed page
└── README.md                # information about this project


It has the following subfolders and files:
├── .vscode
    /settings.json           # Visual Studio Code settings file
├── images                   # Folder for images
    /blank-profile-picture.webp  # Default profile picture
    /hospital.jpg            # Hospital image
    /LGH.png                 # Hospital image
    /MSJ.png                 # Hospital image
    /RH.png                  # Hospital image
    /SPH.png                 # Hospital image
    /UBC.png                 # Hospital image
    /VGH.png                 # Hospital image
├── scripts                  # Folder for scripts
    /authentications.js      # Firebase authentication
    favourite_hospitals.js   # Favourite hospitals
    /firebaseAPI_TEAM06.js   # Firebase API
    /hospital_detail.js      # Hospital detail
    /main.js                 # Main page
    /map.js                  # Map
    /my_review.js            # My review
    /reservation.js          # Reservation
    /review.js               # Review
    /script.js               # Script
    /search.js               # Search
    /skeleton.js             # Skeleton
    /user_profile.js         # User profile
    /waitlist.js             # Waitlist
├── styles                   # Folder for styles
    /style.css               # Style
├── text                     # Folder for text
    /footer.html             # Footer
    /hamburger_menu.html     # Hamburger menu
    /nav_after_login.html    # Navigation bar after login
    /nav_before_login.html   # Navigation bar before login
    /notification.html       # Notification

Firebase hosting files:      # Firebase hosting files
├── .firebase                # Folder for firebase
    /hosting..cache          # Firebase cache
├── .firebaserc              # Firebase config
├── 404.html                 # 404 page
├── firebase.json            # Firebase config
├── firestore.indexes.json   # Firebase config
├── firestore.rules          # Firebase config
```

## Contact 
* Eric Kim - hkim467@my.bcit.ca
* Hsin Pang - hpang19@my.bcit.ca
* Misuzu Taniguchi - mtaniguchi3@my.bcit.ca

## Acknowledgements 
* <a href="https://fonts.google.com/">Google Fonts</a>
* <a href="https://getbootstrap.com/">Bootstrap</a>
