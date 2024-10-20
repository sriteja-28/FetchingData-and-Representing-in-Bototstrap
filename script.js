document.body.setAttribute("class", "container");

// Create and append header
var theader = document.createElement("header");
theader.setAttribute("class", "row");

var thdiv = document.createElement("div");
thdiv.setAttribute("class", "col d-flex justify-content-center align-items-center fs-1 fw-bold");
thdiv.innerText = "Fetching Data Dynamically";
theader.appendChild(thdiv);

document.body.appendChild(theader);

// Create and append navigation bar
var hnav = document.createElement("nav");
hnav.setAttribute("class", "navbar");
hnav.setAttribute("style", "background-color: #e3f2fd;");

var navDiv = document.createElement("div");
navDiv.setAttribute("class", "container-fluid");

var navA = document.createElement("a");
navA.setAttribute("class", "navbar-brand mb-0 h1");
navA.setAttribute("href", "#");
navA.innerText = "Navbar";
navA.setAttribute("style", "color:lightskyblue;");

navDiv.appendChild(navA);
hnav.appendChild(navDiv);

document.body.appendChild(hnav);

// Create a content section for displaying data
var tbdiv = document.createElement("div");
tbdiv.setAttribute("class", "content-section");
document.body.appendChild(tbdiv);

// Buttons for fetching data
const buttons = [
    { id: "userbtn", class: "btn btn-outline-info", text: "Get Users" },
    { id: "postbtn", class: "btn btn-outline-info", text: "Get Posts" },
    { id: "albumsbtn", class: "btn btn-outline-info", text: "Get Albums" },
    { id: "todosbtn", class: "btn btn-outline-info", text: "Get Todos" },
    { id: "commentsbtn", class: "btn btn-outline-info", text: "Get Comments" },
    { id: "photosbtn", class: "btn btn-outline-info", text: "Get Photos" }
];

buttons.forEach(button => {
    let btn = document.createElement("button");
    btn.setAttribute("id", button.id);
    btn.setAttribute("class", button.class);
    btn.innerHTML = button.text;
    navDiv.appendChild(btn);
});

// Clear existing content
const clearContent = () => {
    let existingContent = document.querySelector(".content-section");
    if (existingContent) {
        existingContent.innerHTML = "";  // Clear the inner HTML instead of removing the entire section
    }
};

// Display error message for "No Data Found"
const displayError = (message) => {
    let errorDiv = document.createElement("div");
    errorDiv.setAttribute("class", "alert alert-danger text-center");
    errorDiv.innerText = message;
    document.querySelector(".content-section").appendChild(errorDiv);
};

// Fetch configurations for each button
const fetchConfigs = [
    { id: "userbtn", url: "https://jsonplaceholder.typicode.com/users", type: "users" },
    { id: "postbtn", url: "https://jsonplaceholder.typicode.com/posts", type: "posts" },
    { id: "albumsbtn", url: "https://jsonplaceholder.typicode.com/albums", type: "albums" },
    { id: "todosbtn", url: "https://jsonplaceholder.typicode.com/todos", type: "todos" },
    { id: "commentsbtn", url: "https://jsonplaceholder.typicode.com/comments", type: "comments" },
    { id: "photosbtn", url: "https://jsonplaceholder.typicode.com/photos", type: "photos" }
];

// Event listeners for buttons
fetchConfigs.forEach(config => {
    let button = document.getElementById(config.id);
    button.addEventListener("click", async () => {
        try {
            clearContent(); // Clear existing content on page
            let response = await fetch(config.url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let data = await response.json();

            if (data.length > 0) {
                displayData(data, config.type); // Display data if available
            } else {
                displayError("No data found.");  // Show error if data is empty
            }
        } catch (error) {
            console.log(error);
            displayError("Failed to fetch data or invalid URL.");
        }
    });
});

// Display data based on type
const displayData = (data, type) => {
    let contentSection = document.querySelector(".content-section");

    if (type === "users") {
        createTable(data, "Users Table");
    } else if (type === "posts") {
        createPostTabs(data);
    } else if (type === "comments") {
        createCommentsAccordion(data);
    } else if (type === "albums") {
        createAlbumsList(data);
    } else if (type === "photos") {
        createPhotosCards(data);
    } else if (type === "todos") {
        createTodosCheckboxes(data);
    }
};

// Function to create users table
const createTable = (users, captionText) => {
    let table = document.createElement("table");
    table.setAttribute("class", "table table-bordered border-primary caption-top align-center");

    let cap = document.createElement("caption");
    cap.setAttribute("class", "fw-bold fs-3 text-center");
    cap.innerText = captionText;
    table.appendChild(cap);

    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    // Create table header
    let thr = document.createElement("tr");

    for (let prop in users[0]) {
        let th = document.createElement("th");
        th.setAttribute("class", "text-center");
        th.innerText = prop;
        thr.appendChild(th);
    }
    thead.appendChild(thr);
    table.appendChild(thead);

    // Create table body
    users.forEach(user => {
        let tbr = document.createElement("tr");

        for (let prop in user) {
            let td = document.createElement("td");
            td.setAttribute("class", "text-center");

            if (prop === 'address' && user[prop].geo) {
                let lat = user[prop].geo.lat;
                let lng = user[prop].geo.lng;

                if (lat && lng) {
                    td.innerHTML = `<a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank">View Location</a>`;
                } else {
                    td.innerHTML = formatNestedObject(user[prop]);
                }
            } else if (typeof user[prop] === 'object') {
                td.innerHTML = formatNestedObject(user[prop]);
            } else {
                td.innerHTML = user[prop];
            }
            tbr.appendChild(td);
        }
        tbody.appendChild(tbr);
    });

    table.appendChild(tbody);
    document.querySelector(".content-section").appendChild(table);
};

// Function to format nested objects
function formatNestedObject(obj) {
    let result = '';
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            result += formatNestedObject(obj[key]); // Recursively format nested objects
        } else {
            result += `${key}: ${obj[key]}<br>`;
        }
    }
    return result;
}

// Function to create posts using Bootstrap list tabs
const createPostTabs = (posts) => {
    // Create the main wrapper div with flex alignment
    let mainWrapper = document.createElement("div");
    mainWrapper.setAttribute("class", "d-flex align-items-start");

    let h3 = document.createElement("h3");
    h3.setAttribute("class", "mt-5");
    h3.innerText="Posts Data";
    document.querySelector(".content-section").appendChild(h3);
  
    // Create the nav pills (left-aligned vertical tabs)
    let navPills = document.createElement("div");
    navPills.setAttribute("class", "nav flex-column nav-pills me-3");
    navPills.setAttribute("id", "v-pills-tab");
    navPills.setAttribute("role", "tablist");
    navPills.setAttribute("aria-orientation", "vertical");
  
    posts.forEach((post) => {
      let button = document.createElement("button");
      button.setAttribute("class", "nav-link");
      button.setAttribute("id", `v-pills-${post.id}-tab`);
      button.setAttribute("data-bs-toggle", "pill");
      button.setAttribute("data-bs-target", `#v-pills-${post.id}`);
      button.setAttribute("type", "button");
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", `v-pills-${post.id}`);
      button.setAttribute("aria-selected", "false");
      button.setAttribute("style", "text-align: left;");

      button.innerHTML = `${post.id}. ${post.title}`;
  
      navPills.appendChild(button);
    });
  
    // Create the content section where the post data will appear beside the tabs
    let divContent = document.createElement("div");
    divContent.setAttribute("class", "tab-content");
    divContent.setAttribute("id", "v-pills-tabContent");
  
    posts.forEach((post) => {
      let divPane = document.createElement("div");
      divPane.setAttribute("class", "tab-pane fade"); // No 'active' or 'show' class
      divPane.setAttribute("id", `v-pills-${post.id}`);
      divPane.setAttribute("role", "tabpanel");
      divPane.setAttribute("aria-labelledby", `v-pills-${post.id}-tab`);
      divPane.setAttribute("tabindex", "0");
      divPane.innerHTML = `<h4>${post.title}</h4><p>${post.body}</p>`;
  
      divContent.appendChild(divPane);
    });
  
    // Append the nav pills and content section to the main wrapper
    mainWrapper.appendChild(navPills);
    mainWrapper.appendChild(divContent);
  
    // Append everything to the main content section
    let contentSection = document.querySelector(".content-section");
    contentSection.appendChild(mainWrapper);
  };
  
  


// Function to create albums list
const createAlbumsList = (albums) => {
    let ul = document.createElement("ul");
    ul.setAttribute("class", "list-group m-5");

    let h3 = document.createElement("h3");
    h3.setAttribute("class", "mt-5");
    h3.innerText="Albums Data";
    ul.appendChild(h3);

    albums.forEach(album => {
        let li = document.createElement("li");
        li.setAttribute("class", "list-group-item");

        li.innerHTML = `<h5>${album.id}. ${album.title}</h5>`;
        ul.appendChild(li);
    });

    document.querySelector(".content-section").appendChild(ul);
};

// Function to create todos checkboxes
const createTodosCheckboxes = (todos) => {
    let form = document.createElement("form");
   // form.setAttribute("class","mt-5")

    let h3 = document.createElement("h3");
    h3.setAttribute("class", "mt-5");
    h3.innerText="Todos Data";
    document.querySelector(".content-section").appendChild(h3);

    todos.forEach(todo => {
        let div = document.createElement("div");
        div.setAttribute("class", "form-check");

        let input = document.createElement("input");
        input.setAttribute("class", "form-check-input");
        input.type = "checkbox";
        input.checked = todo.completed;

        let label = document.createElement("label");
        label.setAttribute("class", "form-check-label");
        label.innerText = `${todo.id}. ${todo.title}`;

        div.appendChild(input);
        div.appendChild(label);
        form.appendChild(div);
    });

    document.querySelector(".content-section").appendChild(form);
};


// Function to create comments using accordions
const createCommentsAccordion = (comments) => {
    let accordion = document.createElement("div");
    accordion.setAttribute("class", "accordion m-5");
    accordion.id = "commentsAccordion";

    let h3 = document.createElement("h3");
    h3.setAttribute("class", "mt-5");
    h3.innerText="Comments Data";
    accordion.appendChild(h3);

    comments.forEach((comment, index) => {

        let card = document.createElement("div");
        card.setAttribute("class", "card");

        let cardHeader = document.createElement("div");
        cardHeader.setAttribute("class", "card-header");
        cardHeader.id = `heading-${index}`;
        // cardHeader.innerHTML = `<h2 class="mb-0">
        //     <button class="btn btn-link" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="true" aria-controls="collapse-${index}">
        //         ${comment.name}
        //     </button>
        // </h2>`;
        cardHeader.innerHTML = `<h2 class="mb-0">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="true" aria-controls="collapse-${index}">
                ${comment.name}
            </button>
        </h2>`;
        //cardHeader.innerHTML=`${comment.name}`;
        card.appendChild(cardHeader);

        let collapseDiv = document.createElement("div");
        collapseDiv.id = `collapse-${index}`;
        collapseDiv.setAttribute("class", "collapse");
        collapseDiv.setAttribute("aria-labelledby", `heading-${index}`);
        collapseDiv.setAttribute("data-parent", "#commentsAccordion");

        let cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");
        cardBody.innerHTML = `<p>Email: ${comment.email}</p><p>${comment.body}</p>`;
        collapseDiv.appendChild(cardBody);

        card.appendChild(collapseDiv);
        accordion.appendChild(card);
    });

    document.querySelector(".content-section").appendChild(accordion);
};

// Function to create photos cards with thumbnail and full image on click
const createPhotosCards = (photos) => {
    let row = document.createElement("div");
    row.setAttribute("class", "row mt-5");

    
    let h3 = document.createElement("h3");
    h3.setAttribute("class", "mt-5");
    h3.innerText="Photos Data";
    row.appendChild(h3);

    photos.forEach(photo => {
        let col = document.createElement("div");
        col.setAttribute("class", "col-md-4 mb-3");

        let card = document.createElement("div");
        card.setAttribute("class", "card");

        let img = document.createElement("img");
        img.setAttribute("class", "card-img-top");
        img.src = photo.thumbnailUrl; // Initially, set the thumbnail URL
        img.alt = photo.title;

        // Add click event to replace thumbnail with the full image
        img.addEventListener("click", () => {
            img.src = photo.url; // Set the full image URL on click
        });

        let cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");

        let cardTitle = document.createElement("h5");
        cardTitle.setAttribute("class", "card-title");
        cardTitle.innerText = photo.title;

        cardBody.appendChild(cardTitle);
        card.appendChild(img);
        card.appendChild(cardBody);
        col.appendChild(card);
        row.appendChild(col);
    });

    document.querySelector(".content-section").appendChild(row);
};





