"use strict";

class CustomSelectOption {
    constructor(parent, options, callback, _sort = false) {
        this.wrapper_container = document.querySelector(parent);
        this.all_options_list = _sort ? options.sort() : options;
        this.on_value_change = callback;
        this.selected_value = null;
        this.create_new_select_option();
    }
    get_element_by_id(id) { return document.getElementById(id); }
    get_selected_value() { return this.selected_value; }
    create_new_select_option() {
        const main_option_container = document.createElement("div");
        main_option_container.style.width = "300px";
        main_option_container.style.position = "relative";
        const input_field_wrapper = document.createElement("div");
        input_field_wrapper.id = "main-options-container"
        const option_input = document.createElement("input");
        option_input.style.cursor = "pointer";
        option_input.style.width = "100%";
        option_input.placeholder = "Choose option";
        option_input.id = "option-input-field"
        input_field_wrapper.appendChild(option_input);
        const options_container = document.createElement("div");
        options_container.style.position = "absolute";
        options_container.style.maxHeight = "300px";
        options_container.style.width = "100%";
        options_container.style.overflow = "auto";
        options_container.style.display = "none";
        options_container.id = "options-list-container";
        main_option_container.append(input_field_wrapper, options_container);
        this.wrapper_container.appendChild(main_option_container);
        let opt_div;
        this.all_options_list.forEach((value) => {
            opt_div = document.createElement("div");
            opt_div.innerText = value;
            opt_div.style.borderBottom = "1px solid gray";
            opt_div.style.cursor = "pointer";
            opt_div.id = "option-list";
            options_container.appendChild(opt_div);
            opt_div.onclick = () => {
                this.on_value_change(value);
                this.selected_value = value;
                option_input.value = value;
                hide_options();
            };
        });
        const all_options_elem = Array.from(options_container.children);
        function show_options() { options_container.style.display = "block"; }
        function hide_options() { options_container.style.display = "none"; option_input.blur(); }
        option_input.onfocus = show_options;
        function display_options() { all_options_elem.forEach((option) => { option.style.display = "block"; }); }
        option_input.onclick = display_options;
        option_input.oninput = () => {
            const input_value = option_input.value.toLowerCase();
            if (input_value != "") {
                all_options_elem.forEach((option) => {
                    const option_value = option.textContent.toLowerCase();
                    if (option_value.includes(input_value)) { option.style.display = "block"; }
                    else { option.style.display = "none"; }
                });
            } else { display_options(); }
        }
        document.addEventListener("keydown", (ev) => { if (ev.key == "Escape") { hide_options() } })
        document.addEventListener("click", (e) => { if (e.target != opt_div && e.target != option_input) { hide_options(); } })
    }
}


const brand_list = [
    "Apple", "Vivo", "Huawei", "Lenovo", "LG", "Xiaomi", "Nokia", "OnePlus", "Oppo", "Samsung"
];

const country_list = [
    "Nepal", "India", "Bhutan", "Maldives", "Pakistan", "Bangladesh", "Afghanistan", "China", "Japan"
];

function callback_f1(value) {
    console.log(value);
}

function callback_f2(value) {
    console.log(value);
}

const select_option1 = new CustomSelectOption(".container", brand_list, callback_f1, true);
const select_option2 = new CustomSelectOption(".container", country_list, callback_f2, false);