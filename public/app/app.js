var instrCounter = 3;
var ingrCounter = 3;
var editInstrCounter;
var editIngrCounter;
var current;
var recipeIndex;
var yourRecipes = [
  {
    name: "Supreme Pizza",
    image: "Pizza",
    description:
      "Make pizza night super duper out of this world with homemade pizza. This recipe is supreme with vegetables and two types of meat. Yum!",
    time: "1h 24min",
    servings: "4 servings",
    ingredients: [
      "1/4 batch pizza dough",
      "2 tablespoons Last-Minute Pizza Sauce",
      "10 slices pepperoni",
      "1 cup cooked and crumbled Italian sausage",
      "2 large mushrooms, sliced",
      "1/4 bell pepper, sliced",
      "1 tablespoon sliced black olives",
      "1 cup shredded mozzarella cheese",
    ],
    instructions: [
      "Preheat the oven to 475°. Spray pizza pan with nonstick cooking or line a baking sheet with parchment paper.",
      "Flatten dough into a thin round and place on the pizza pan.",
      "Spread pizza sauce over the dough.",
      "Layer the toppings over the dough in the order listed.",
      "Bake for 8 to 10 minutes or until the crust is crisp and the cheese melted and lightly browned.",
    ],
  },
];

function initFirebase() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $(".logout").css("display", "block");
      $(".logout-but").css("display", "flex");
      $(".login-but").css("display", "none");
      $(".nav-links").addClass("nav-links--logged-in");
      console.log("connected");
      current = user.displayName;
      $(".displayName").html(`${current}`);
    } else {
      $(".logout").css("display", "none");
      $(".logout-but").css("display", "none");
      $(".login-but").css("display", "flex");
      $(".nav-links").removeClass("nav-links--logged-in");
      console.log("user is not there");
    }
  });
}

function updateUser(fName) {
  firebase.auth().currentUser.updateProfile({
    displayName: fName,
  });
}

function signUp() {
  let password = $("#signup-password").val();
  let email = $("#signup-email").val();
  let fName = $("#signup-fname").val();
  let lName = $("#signup-lname").val();

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;

      updateUser(fName);

      $("#signup-password").val("");
      $("#signup-email").val("");
      $("#signup-fname").val("");
      $("#signup-lname").val("");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function login() {
  let password = $("#login-password").val();
  let email = $("#login-email").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("signed in");

      let password = $("#login-password").val("");
      let email = $("#login-email").val("");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("signed out");
    })
    .catch((error) => {
      console.log(error);
    });
}

function generalRecipes() {
  $.getJSON("data/data.json", function (data) {
    $(".recipes").html("");
    $.each(data.browse_recipes, function (index, recipe) {
      $(".recipes").append(`
      <div class="recipe">
        <div class="recipe__left recipe__left--${recipe.image}">
        </div>
        <div class="recipe__right">
          <p class="recipe__right__title">
          ${recipe.name}
          </p>
          <p class="recipe__right__description">
          ${recipe.description}
          </p>
          <div class="recipe__right__info">
              <img class="recipe__right__info__icon" src="../../images/time.svg">
              <p class="recipe__right__info__text">
              ${recipe.time}
              </p>
          </div>
          <div class="recipe__right__info">
              <img class="recipe__right__info__icon" src="../../images/servings.svg"></img>
              <p class="recipe__right__info__text">
              ${recipe.servings}
              </p>
          </div>
        </div>
      </div>
      `);
    });
  });
}

function loadYourRecipes() {
  $.each(yourRecipes, function (index, recipe) {
    $(".recipes").append(`
          <div class="recipe">
          <div class="recipe__top">
              <div class="recipe__top__left recipe__top__left--${recipe.image}">
                  <div class="button" onclick="viewRecipeID(${index})">
                      View
                  </div>
              </div>
              <div class="recipe__top__right">
                  <p class="recipe__top__right__title">
                      ${recipe.name}
                  </p>
                  <p class="recipe__top__right__description">
                      ${recipe.description}
                  </p>
                  <div class="recipe__top__right__info">
                      <img class="recipe__top__right__info__icon" src="../../images/time.svg">
                      <p class="recipe__top__right__info__text">
                          ${recipe.time}
                      </p>
                  </div>
                  <div class="recipe__top__right__info">
                      <img class="recipe__top__right__info__icon" src="../../images/servings.svg">
                      <p class="recipe__top__right__info__text">
                          ${recipe.servings}
                      </p>
                  </div>
              </div>
          </div>
          <div class="recipe__buttons">
                <div class="button" onclick="editRecipeID(${index})">
                    Edit Recipe
                </div>
              <div class="button" onclick="deleteRecipe(${index})">
                  Delete                    
              </div>
          </div>
      </div>
    `);
  });
}

function createRecipe() {
  let name = $("#name").val();
  let image = $("#image option:selected").text();
  console.log(image);
  let description = $("#description").val();
  let time = $("#time").val();
  let servings = $("#servings").val();
  let ingredients = [];
  let instructions = [];
  $("#ingredients")
    .children("input")
    .each(function (index) {
      ingredients.push($(`#ingredient${index + 1}`).val());
    });
  $("#instructions")
    .children("input")
    .each(function (index) {
      instructions.push($(`#instruction${index + 1}`).val());
    });

  let recipeObj = {
    name: name,
    image: image,
    description: description,
    time: time,
    servings: servings,
    ingredients: ingredients,
    instructions: instructions,
  };

  yourRecipes.push(recipeObj);
  window.location.hash = "#/your";
  alert("recipe has been created");
}

function saveChanges() {
  let name = $("#name").val();
  let image = $("#image").val();
  let description = $("#description").val();
  let time = $("#time").val();
  let servings = $("#servings").val();
  let ingredients = [];
  let instructions = [];
  $("#ingredients")
    .children("input")
    .each(function (index) {
      ingredients.push($(`#ingredient${index}`).val());
    });
  $("#instructions")
    .children("input")
    .each(function (index) {
      instructions.push($(`#instruction${index}`).val());
    });

  let recipeObj = {
    name: name,
    image: image,
    description: description,
    time: time,
    servings: servings,
    ingredients: ingredients,
    instructions: instructions,
  };

  yourRecipes[recipeIndex] = recipeObj;
  MODEL.getPageData("your", loadPage);
  alert("recipe updated");
}

function deleteRecipe(index) {
  yourRecipes.splice(index, 1);
  MODEL.getPageData("your", loadPage);
  alert("recipe deleted");
}

function viewRecipeID(index) {
  recipeIndex = index;
  MODEL.getPageData("view", loadPage);
}

function editRecipeID(index) {
  recipeIndex = index;
  MODEL.getPageData("edit", loadPage);
}

function loadView() {
  let recipe = yourRecipes[recipeIndex];

  $(".view").append(`
      <div class="view__top">
      <div class="view__top__left">

          <div class="view__top__left__side">
            <p>${recipe.name}</p>
          </div>
          <div class="view__top__left__image view__top__left__image--${recipe.image}">

          </div>
      </div>
      
      <div class="view__top__text">
          <p class="view__top__text__heading">
              Description:
          </p>
          <p class="view__top__text__content">
              ${recipe.description}
          </p>    
          <p class="view__top__text__subheading">
              Total Time:
          </p>
          <p class="view__top__text__content">
              ${recipe.time}
          </p>
          <p class="view__top__text__subheading">
              Servings:
          </p>
          <p class="view__top__text__content">
              ${recipe.servings}
          </p>
      </div>
    </div>
    <div class="view__content">
      <p class="view__content__title">
          Ingredients:
      </p>
      <div class="view__content__group ingredients">
          
      </div>
    </div>
    <div class="view__content">
      <p class="view__content__title">
          Instructions: 
      </p>
      <div class="view__content__group instructions">
    
      </div>
      
    </div>
    <div class="view__content">
      <div class="view__content__edit" onclick="editRecipeID(${recipeIndex})">
          Edit Recipe
      </div>
    </div>
  `);
  $.each(recipe.ingredients, function (index, ingredient) {
    $(".ingredients").append(`
      <p class="view__content__group__single">
        ${ingredient}
      </p>
    `);
  });
  $.each(recipe.instructions, function (index, instruction) {
    $(".instructions").append(`
      <p class="view__content__group__single">
        ${index + 1}. ${instruction}
      </p>
    `);
  });
}

function loadEdit() {
  editInstrCounter = 0;
  editIngrCounter = 0;
  let recipe = yourRecipes[recipeIndex];

  $(".form").append(`
    <div class="form__inputs">
      <select class="form__inputs__input" name="recipe image" id="image" placeholder="Choose image">
        <option value="Pizza">Pizza</option>
        <option value="Chicken">Chicken</option>
        <option value="Burger">Burger</option>
        <option value="Chow">Chow Mein</option>
      </select>
      <input class="form__inputs__input" type="text" value="${recipe.name}" id="name">
      <input class="form__inputs__input" type="text" value="${recipe.description}" id="description">
      <input class="form__inputs__input" type="text" value="${recipe.time}" id="time">
      <input class="form__inputs__input" type="text" value="${recipe.servings}" id="servings">
    </div>
    <div class="form__inputs">
      <p class="form__inputs__title">Edit Ingredients:</p>
      <div class="form__inputs__plus" onclick="editIngrInput()">+</div>  
      <div id="ingredients"></div>
    </div>
    <div class="form__inputs">
      <p class="form__inputs__title">Edit Instructions:</p>
      <div class="form__inputs__plus" onclick="editInstrInput()">+</div>
      <div id="instructions"></div>
    </div>
    <div class="form__create" onclick="saveChanges()">
      Submit Changes
    </div>
  `);
  $.each(recipe.ingredients, function (index, ingredient) {
    $("#ingredients").append(`
      <input class="form__inputs__input" type="text" value="${ingredient}" id="ingredient${index}">
    `);
    editIngrCounter++;
  });
  $.each(recipe.instructions, function (index, instruction) {
    $("#instructions").append(`
      <input class="form__inputs__input" type="text" value="${instruction}" id="instruction${index}">
    `);
    editInstrCounter++;
  });
  $.each($("option"), function (index, option) {
    if (option.label == recipe.image) {
      $(option).attr("selected", "selected");
    }
  });
}

function editIngrInput() {
  editIngrCounter++;
  $("#ingredients").append(`
    <input class="form__inputs__input" type="text" placeholder="Ingredient #${editIngrCounter}" id="ingredient${editIngrCounter}">
  `);
}

function ingrInput() {
  ingrCounter++;
  $("#ingredients").append(`
    <input class="form__inputs__input" type="text" placeholder="Ingredient #${ingrCounter}" id="ingredient${ingrCounter}">
  `);
}

function editInstrInput() {
  editInstrCounter++;
  $("#instructions").append(`
    <input class="form__inputs__input" type="text" placeholder="Instruction #${editInstrCounter}" id="ingredient${editInstrCounter}">
  `);
}

function instrInput() {
  instrCounter++;
  $("#instructions").append(`
  <input class="form__inputs__input" type="text" placeholder="Instruction #${instrCounter}" id="instuction${instrCounter}">
  `);
}

function route(id) {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#/", "");

  if (!hashTag) {
    pageID = id;
  }

  if (!pageID) {
    MODEL.getPageData("home", loadPage);
  } else {
    MODEL.getPageData(pageID, loadPage);
  }
}

function loadPage(pageID) {
  // current = firebase.auth().currentUser;

  if (pageID == "edit" || pageID == "view") {
    $("a.current").removeClass("current");
    $(`#your`).addClass("current");
  } else {
    $("a.current").removeClass("current");
    $(`#${pageID}`).addClass("current");
  }
  if (pageID === "home") {
    $(".content").css("background-color", "transparent");
    $(".content").css(
      "background-image",
      `linear-gradient(
      to right,
      rgba(242, 92, 84, 0.6),
      rgba(242, 92, 84, 0.6)
    ),
    url(images/hero.jpg)`
    );
  } else if (pageID == "create") {
    $(".create__title").html(
      `<p>Hey <span class="displayName">${current}</span>, create your recipe!</p>`
    );
    $(".content").css("background-image", "none");
    $(".content").css("background-color", "transparent");
  } else if (pageID === "login") {
    $(".content").css("background-image", "none");
    $(".content").css("background-color", "#ffd972");
  } else if (pageID == "browse") {
    generalRecipes();
    $(".content").css("background-color", "transparent");
    $(".content").css(
      "background-image",
      `linear-gradient(
      to right,
      rgba(167, 232, 189, 0.6),
      rgba(167, 232, 189, 0.6)
    ),
    url(images/recipe-hero.jpg)`
    );
  } else if (pageID == "your") {
    $(".content").css("background-color", "transparent");
    $(".content").css(
      "background-image",
      `linear-gradient(
      to right,
      rgba(167, 232, 189, 0.6),
      rgba(167, 232, 189, 0.6)
    ),
    url(images/recipe-hero.jpg)`
    );
    $(".your__title").html(
      `<p>Hey <span class="displayName">${current}</span>, here are your recipes!</p>`
    );
    loadYourRecipes();
  } else if (pageID == "view") {
    $(".content").css("background-image", "none");
    $(".content").css("background-color", "transparent");
    loadView();
  } else if (pageID == "edit") {
    $(".create__title").html(
      `<p>Hey <span class="displayName">${current}</span>, edit your recipe!</p>`
    );
    $(".content").css("background-image", "none");
    $(".content").css("background-color", "transparent");
    loadEdit();
  }
}

function initListeners() {
  $(window).on("hashchange", route);
  route();

  $(".hamburger").click(function (e) {
    $(".mobile-nav").css("display", "flex");
  });

  $(".click").click(function (e) {
    $(".mobile-nav").css("display", "none");
  });

  $(".mobile-nav-link").click(function (e) {
    $(".mobile-nav").css("display", "none");
  });
}

$(document).ready(function () {
  try {
    let app = firebase.app();
    initFirebase();
    initListeners();
    route("home");
  } catch {
    console.error("yes");
  }
});
