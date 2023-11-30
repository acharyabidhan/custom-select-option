"use strict";

function get_zindex(element, zindex = 0) {
    const parent_elem = element.parentElement;
    if (parent_elem === null) return zindex;
    zindex += 1
    return get_zindex(parent_elem, zindex);
}

function countPreviousSiblings(element) {
    let count = 0;
    let prevSibling = element.previousElementSibling;
    while (prevSibling) {
        count++;
        prevSibling = prevSibling.previousElementSibling;
    }
    return count;
}

class CustomSelectOption {
    constructor(parent, callback, _sort = false, max_width = "300px", max_height = "300px") {
        this.wrapper_container = document.querySelector(parent);
        this.sort_values = _sort;
        this.all_options_list = null;
        this.on_value_change = callback;
        this.selected_value = null;
        this.max_width = max_width;
        this.max_height = max_height;
        this.wrapper_container_zindex = get_zindex(this.wrapper_container);
        this.no_of_prev_elements = countPreviousSiblings(this.wrapper_container);
    }
    get_selected_value() {
        return this.selected_value;
    }
    set_options(opt) {
        this.all_options_list = this.sort_values ? opt.sort() : opt;
    }
    create_options() {
        this.wrapper_container.innerHTML = null;
        this.create_new_select_option();
    }
    create_new_select_option() {
        const main_option_container = document.createElement("div");
        main_option_container.style.maxWidth = this.max_width;
        main_option_container.style.position = "relative";
        main_option_container.style.zIndex = this.wrapper_container_zindex - this.no_of_prev_elements;
        const input_field_wrapper = document.createElement("div");
        input_field_wrapper.className = "main-options-container";
        const option_input = document.createElement("input");
        option_input.style.cursor = "pointer";
        option_input.style.width = "100%";
        option_input.placeholder = "Choose option";
        option_input.className = "option-input-field";
        input_field_wrapper.appendChild(option_input);
        const options_container = document.createElement("div");
        options_container.style.position = "absolute";
        options_container.style.maxHeight = this.max_height;
        options_container.style.width = "100%";
        options_container.style.overflow = "auto";
        options_container.style.display = "none";
        options_container.className = "options-list-container";
        main_option_container.append(input_field_wrapper, options_container);
        this.wrapper_container.appendChild(main_option_container);
        let opt_div;
        this.all_options_list.forEach((value) => {
            opt_div = document.createElement("div");
            opt_div.innerText = value;
            opt_div.style.borderBottom = "1px solid gray";
            opt_div.style.cursor = "pointer";
            opt_div.className = "option-list";
            options_container.appendChild(opt_div);
            opt_div.onclick = () => {
                this.on_value_change(value);
                this.selected_value = value;
                option_input.value = value;
                hide_options();
            };
        });
        const all_options_elem = Array.from(options_container.children);
        function show_options() {
            options_container.style.display = "block";
        }
        function hide_options() {
            options_container.style.display = "none";
            option_input.blur();
        }
        option_input.onfocus = show_options;
        function display_options() {
            all_options_elem.forEach((option) => {
                option.style.display = "block";
            });
        }
        option_input.onclick = display_options;
        option_input.oninput = () => {
            const input_value = option_input.value.toLowerCase();
            if (input_value != "") {
                all_options_elem.forEach((option) => {
                    const option_value = option.textContent.toLowerCase();
                    if (option_value.includes(input_value)) {
                        option.style.display = "block";
                    } else {
                        option.style.display = "none";
                    }
                });
            } else {
                display_options();
            }
        };
        document.addEventListener("keydown", (ev) => {
            if (ev.key == "Escape") {
                hide_options();
            }
        });
        document.addEventListener("click", (e) => {
            if (e.target != opt_div && e.target != option_input) {
                hide_options();
            }
        });
    }
}

// Start---------------------

function my_callback(value) {
    console.log(value);
}

const options = ["Python", "JavaScript", "Java", "C++", "C", "C#", "Kotlin", "Go", "Rust"];

const option = new CustomSelectOption(".option1", my_callback, true);
option.set_options(options);
option.create_options();