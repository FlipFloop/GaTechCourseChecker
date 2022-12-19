#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use scraper::Selector;
use tauri::Manager;
use std::collections::HashMap;
struct Course {
    num: u16,
    seats_capacity: String,
    seats_current: String,
    seats_remaining: String,
    waitlist_capacity: String,
    waitlist_current: String,
    waitlist_remaining: String,
}

#[tauri::command]
fn get_courses(courses: String) -> Vec<Vec<u16>> {
    println!("Courses searched: {}", courses);
    let mut free_courses: Vec<Vec<u16>> = vec![vec![], vec![]];

    // course num, course full remain, waitlist full
    let mut course_availability: HashMap<u16, (bool, bool)> = HashMap::new();

    let parsed_course_nums: Vec<u16> = courses
        .split(' ')
        .map(|s| s.trim())
        .filter(|s| !s.is_empty())
        .map(|s| s.parse().unwrap())
        .collect();

    println!("{:?}", parsed_course_nums);

    for course in parsed_course_nums {
        course_availability.insert(course, (true, true));
    }

    println!("{:?}", course_availability);

    let mut course_info: Vec<Course> = Vec::new();

    let table_selector_string: &str = "table.datadisplaytable>tbody";

    let mut rows: Vec<String> = Vec::new();

    for (num, slots) in course_availability.iter_mut() {
        let response = reqwest::blocking::get(format!(
                    "https://oscar.gatech.edu/pls/bprod/bwckschd.p_disp_detail_sched?term_in=202302&crn_in={}",
                    num,
                ))
                .unwrap()
                .text()
                .unwrap();

        let document = scraper::Html::parse_document(&response);

        let table_selector = Selector::parse(table_selector_string).unwrap();

        // let head_elements_selector = Selector::parse("tr>th.ddheader").unwrap();
        let row_element_data_selector = Selector::parse("tr>td.dddefault, tr>th.ddheader").unwrap();

        let all_tables = document.select(&table_selector);

        for table in all_tables {
            let row_elements = table.select(&row_element_data_selector);

            for row_element in row_elements {
                if rows.len() < 6 {
                    let mut element = row_element.text().collect::<Vec<_>>().join(" ");
                    element = element.trim().replace("\n", " ");

                    if element.chars().all(char::is_numeric) {
                        // println!("td: {}", element);
                        rows.push(element)
                    }
                }
            }

            break;
        }

        course_info.push(Course {
            num: num.clone(),
            seats_capacity: rows[0].to_string(),
            seats_current: rows[1].to_string(),
            seats_remaining: rows[2].to_string(),
            waitlist_capacity: rows[3].to_string(),
            waitlist_current: rows[4].to_string(),
            waitlist_remaining: rows[5].to_string(),
        });

        if let Ok(result) = rows[2].parse::<u32>() {
            if result > 0 {
                slots.0 = false;
            }
        }
        if let Ok(result) = rows[5].parse::<u32>() {
            if result > 0 {
                slots.1 = false;
            }
        }
        rows.clear();
    }

    for course in course_info.iter() {
        println!("----------");
        println!("Course number: {}\n", course.num);
        println!("Class capacity: {}", course.seats_capacity);
        println!("Seats taken: {}", course.seats_current);
        println!("Seats left: {}\n", course.seats_remaining);
        println!("Waitlist capacity: {}", course.waitlist_capacity);
        println!("Waitlist spots taken: {}", course.waitlist_current);
        println!("Waitlist spots left: {}", course.waitlist_remaining);
        println!("----------\n\n")
    }

    for (num, slots) in course_availability.iter() {
        if !slots.0 {
            println!("Course {} has a free spot.", &num);
            free_courses[0].push(num.clone());
        }
        if !slots.1 {
            println!("Course {} has a free waitlist slot.", &num);
            free_courses[1].push(num.clone());
        }
    }

    return free_courses;
}

#[tauri::command]
fn check_course_exists(course_id: String) -> bool {
    let response = reqwest::blocking::get(format!(
        "https://oscar.gatech.edu/pls/bprod/bwckschd.p_disp_detail_sched?term_in=202302&crn_in={}",
        course_id,
    ))
    .unwrap()
    .text()
    .unwrap();

    let document = scraper::Html::parse_document(&response);
    let error_str: &str = "tbody>tr>td.pldefault>span.errortext";

    let err_selector = Selector::parse(error_str).unwrap();

    let err_exists = document.select(&err_selector);

    for el in err_exists {
        if el.text().collect::<String>() == "No detailed class information found" {
            println!("Doesn't exist: {}", course_id);
            return false;
        }
    }

    println!("Does Exist: {}", course_id);
    return true;
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_courses, check_course_exists])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
