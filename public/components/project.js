const addNewProjectsBtn = mainProjectsSection.querySelector(
  ".add-new-project-btn"
);
const addProjectSection = mainProjectsSection.querySelector(
  ".add-new-project-section"
);

const projectNo = mainProjectsSection.querySelector("#projects-counter");
const inputSearch = mainProjectsSection.querySelector(".search-projects-input");
const inputSeach = mainProjectsSection.querySelector(".input-search-btn");
const mainContainer = mainProjectsSection.querySelector(
  ".main-project-cards-container"
);
const displayDetailsSection = mainProjectsSection.querySelector(
  ".project-details-display"
);

const card = {
  title: mainProjectsSection.querySelector(".project-card-name"),
  description: mainProjectsSection.querySelector(".project-card-desc "),
  thumbnail: mainProjectsSection.querySelector(".card-thumbnail"),
  deleteBtn: mainProjectsSection.querySelector(".delete-project-card"),
  editBtn: mainProjectsSection.querySelector(".edit-project-card"),
  previewBtn: mainProjectsSection.querySelector(".preview-project-card"),
};

//add section variables

const addSectionVar = {
  form: addProjectSection.querySelector("#project-add-form"),
  addBtn: addProjectSection.querySelector(".pro-add-btn"),
};

//preview section elements

const preview = {
  name: displayDetailsSection.querySelector(".preview-name "),
  description: displayDetailsSection.querySelector(".preview-desc"),
  video: displayDetailsSection.querySelector(".preview-video"),
  pinBtn: displayDetailsSection.querySelector(".preview-pin-btn"),
  deleteBtn: displayDetailsSection.querySelector(".preview-delete-btn"),
  completionDate: displayDetailsSection.querySelector(
    ".preview-completion-date"
  ),
  timeTaken: displayDetailsSection.querySelector(".preview-time-taken"),
  concepts: displayDetailsSection.querySelector(".preview-concepts"),
  dowloadCode: displayDetailsSection.querySelector(".preview-dowload-code"),
  backBtn: displayDetailsSection.querySelector(".preview-back-btn"),
};

mainProjectsSection
  .querySelector(".fa-chevron-left")
  .addEventListener("click", () => {
    mainProjectsSection.classList.add("hidden");
    mainPage.classList.remove("hidden");
  });

mainProjectsSection.querySelector(
  "#display-userName"
).textContent = `Hi, ${getName}`;

addNewProjectsBtn.addEventListener("click", () => {
  addNewProjectsBtn.classList.add("duration-300");
  addProjectSection.classList.toggle("hidden");
  addNewProjectsBtn.classList.toggle("rotate-[135deg]");
});

card.previewBtn.addEventListener("click", () => {
  displayDetailsSection.classList.remove("hidden");
});

preview.backBtn.addEventListener("click", () => {
  displayDetailsSection.classList.add("hidden");
});
addSectionVar.form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const form = addSectionVar.form;

  // Append metadata
  formData.append("name", form.pro_name.value);
  formData.append("description", form.pro_desc.value);
  formData.append("date", form.pro_completion_date.value);
  formData.append("time", form.pro_time_taken.value);
  formData.append("concept", form.pro_concepts.value);

  // Append files if selected
  if (form.pro_thumbnail_image.files[0]) {
    formData.append("image", form.pro_thumbnail_image.files[0]);
  }
  if (form.pro_video_url.files[0]) {
    formData.append("video", form.pro_video_url.files[0]);
  }
  if (form.pro_source_code.files[0]) {
    formData.append("source_code", form.pro_source_code.files[0]);
  } else {
    console.error("No source code file selected");
  }
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  try {
    const res = await fetch(`http://${ip}:${port}/projects`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server responded with an error:", errorText);
      alert("Error uploading project");
      return;
    }

    const result = await res.json();
    console.log("Response data:", result);
    alert(result.message);
  } catch (error) {
    console.error("Error submitting form", error);
    alert("Error submitting form");
  }
});

function getProjectsFromDb() {
  fetch(`http://${ip}:8080/projects`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching projects", error);
    });
}
