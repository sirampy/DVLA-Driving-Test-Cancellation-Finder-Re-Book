## Easily find cancellations to re-book your UK driving test
This repo provides a script that automatically navigates the DVSA website for you when re-booking you're driving test. It can both automatically navigate the site to get you to the list of availible driving tests ASAP, and provides helpers to make it quicker for you to manually explore the webpage. Just complete the DVSA's capcha and let DVSA Re-Booking Helper take care of the rest.

## Installation / Setup:
1. Install [tampermonkey](https://www.tampermonkey.net/) browser extension. This lets you run arbitrary code in you're browser.
2. Click on the tampermonkey extension -> create a new script
3. Copy in the code from src.js, fill in you're details (lisence number, test reference number, preferred location) into the fields at the top of the code and save

## Usage:
1. Go to [DVSA Re-Booking page](https://driverpracticaltest.dvsa.gov.uk/login) and complete the capcha
2. Click on the tampermonkey extension 
3. Under DVSA Re-Booking Helper you will see a list of helpers / functionality provided by this project. The underlined charachter in each option is a keyboard shortcut that you can use from the tampermonkey extension window.
4. Press f (or select "Find Booking") and it will automatically use the other helpers to search for a driving test

## Common Pitfalls:
* Many of the helpers provided by this project only work if on the correct webpage. They should be somewhat in the order you would likely want to use them, but you will likely have to do some experimentation to figure out what they are all for. For the most part, "Find Booking" (and maybe "Show More Results") is all you should need.

## TODO: 
[ ] periodic retries (with re-auth alert)
[ ] gif / video demo
