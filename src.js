// ==UserScript==
// @name         Menu Test
// @description  Make finding DVSA driving tests easier
// @version      1
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    http://dvsa.gov.uk
// @include  *
// ==/UserScript==

( function () {
    // Set These:
    var lisence_number = "YOUR LISENCE NUMBER";
    var test_reference_number = "YOUR TEST REFERENCE NUMBER";
    var prefered_location = "YOUR POSTCODE";

    var show_more_count = 3;    // How many times to auto-press the "show more results" button
    var alert_on_find = true;   // Enable alert sound / auto-scroll / re-colour when test found

    // Basic helpers
    function set_input_by_id(id, value) {
        const input = document.getElementById(id);
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.warn(`Input with ID "${id}" not found.`);
        }
    }

    function click_button_by_id(id) {
        const button = document.getElementById(id);
        if (button) {
            button.click();
        } else {
            console.warn(`Button with ID "${id}" not found.`);
        }
    }

    // Actions
    function log_in() {
        set_input_by_id("driving-licence-number", lisence_number);
        set_input_by_id("application-reference-number", test_reference_number);
        click_button_by_id("booking-login");
    }

    function click_date_and_time() {
        click_button_by_id("date-time-change");
    }

    function select_earliest_date_and_time() {
        click_button_by_id("test-choice-earliest");
        click_button_by_id("driving-licence-submit");
    }

    function change_test_centre() {
        click_button_by_id("change-test-centre");
    }

    function enter_location() {
        set_input_by_id("test-centres-input", prefered_location);
        click_button_by_id("test-centres-submit");
    }

    function show_more_results() {
        click_button_by_id("fetch-more-centres");
    }

    function find_booking() {
        GM_setValue("running_find_booking", true);
        GM_setValue("remaining_show_more_count", show_more_count);
        handle_find_booking();
    }

    function on_booking_found(element) {
        const audio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/10/audio_77417e67df.mp3?filename=yipee-45360.mp3")
        audio.play().catch(err => console.warn("Audio failed:", err));

        const originalBg = element.style.backgroundColor;
        element.style.backgroundColor = "orange";

        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 1500);

    }

    function find_booking_in_results(click = null, on_found = on_booking_found) {
        const centres = document.querySelectorAll("div.test-centre-details");

        for (let centre of centres) {
            const text = centre.textContent.trim();

            if (!text.includes("No tests found on any date")) {
                if (on_found){
                    on_found(centre);
                }
                return text;
            }
        }
        return null;
    }

    // perform find_booking

    function handle_find_booking() {
        if (!GM_getValue("running_find_booking", false)){
            return;
        }
        switch(document.title){
            case "Access your booking - Change booking":
                log_in();
                break;
            case "Booking details - Change booking":
                click_date_and_time();
                break;
            case "Test date - Change booking":
                select_earliest_date_and_time();
                break;
            case "Test date / time — test times available - Change booking":
                change_test_centre();
                break;
            case "Test centre - Change booking":
                if (!document.getElementById("search-results")){
                    enter_location();
                    return;
                }

                var remaining_show_more = GM_getValue("remaining_show_more_count", 0);
                if (remaining_show_more > 0){
                    GM_setValue("remaining_show_more_count", remaining_show_more - 1);
                    if (!find_booking_in_results()){
                        show_more_results();
                    } else {
                        GM_setValue("remaining_show_more_count", 0);
                    }
                } else {
                    GM_setValue("running_find_booking", false);
                }
                break;
        }
    }

    window.addEventListener('load', () => {
        handle_find_booking();

        if (alert_on_find && document.title == "Test centre - Change booking") {
            find_booking_in_results();
        }
    });

    // Register individual menu commands (optional)
    GM_registerMenuCommand("Find Booking", find_booking, "f");
    GM_registerMenuCommand("Log In", log_in, "i");
    GM_registerMenuCommand("Click Date And Time", click_date_and_time, "t");
    GM_registerMenuCommand("Select Earliest", select_earliest_date_and_time, "s");
    GM_registerMenuCommand("Change Test Center", change_test_centre, "c");
    GM_registerMenuCommand("Enter Location", enter_location, "l");
    GM_registerMenuCommand("Show More Results", show_more_results, "m");
    GM_registerMenuCommand("Find Booking In Results", find_booking_in_results, "r");
})();
