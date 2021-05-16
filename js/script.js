(function () { // Same as document.addEventListener("DOMContentLoaded".
  // Same as document.querySelector("#navbarToggle").addEventListener("b
  $("#navbarToggle").blur(function (event) {
  var screenWidth = window.innerWidth;
  if (screenWidth < 768) {
  $("#collapsable-nav").collapse( 'hide');
  }
  });
  });
  (function (global) {
  var dc = {};
  var allcategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
  var homeHtml = "snippets/home-snippet.html";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";
  var menuItemUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";
  // Convinience function for inserting innerHTML for 'select'
  var insertHtml = function (selector, html){
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
  }

  // Show loading icon inside element identified by 'selector',
  var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
  };

  
  // Return substitute of '{{propName}}'
  // with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
  .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
  }


  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
  // On first load, show home view
  showLoading("#main-content");
  $ajaxUtils. sendGetRequest(
  homeHtml,
  function (responseText) {
  document.querySelector("#main-content")
  .innerHTML = responseText;
  },
  false);
  });



  // Load the menu categories View
    dc.loadMenuCategories = function () {
      
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(allcategoriesUrl,buildAndShowCategoriesHTML);
    };



    //load the menu items view
    // 'categoryShort' is a short_name for a category
    dc.loadMenuItems = function (categoryShort) {
      showLoading("#main-content");
      $ajaxUtils.sendGetRequest(
        menuItemUrl + categoryShort,
        buildAndShowMenuItemsHTML
      );
    };


      // Builds HTML for the categiries page based on the data
      // from the server
      function buildAndShowCategoriesHTML (categories) {
      // Load title snippet of categories page
      $ajaxUtils.sendGetRequest(
      categoriesTitleHtml,
      function (categoriesTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
      categoryHtml,
      function (categoryHtml) {
      var categoriesViewHtml = 
      buildCategoriesViewHtml(categories,
      categoriesTitleHtml,
      categoryHtml);
      insertHtml("#main-content", categoriesViewHtml);
      },
      false);
      },
      false);
      }


      // Using categories data and snippets html
      // build categories view HTML to be inserted into page
      function buildCategoriesViewHtml(categories,
        categoriesTitleHtml,
        categoryHtml) {
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";
        // Loop over categories
        for (var i = 0; i < categories.length; i++) {
        // Insert category values
        var html = categoryHtml;
        var name = "" + categories[i].name;
        var short_name = categories[i].short_name;
        html =
        insertProperty(html, "name", name);
        html =
        insertProperty(html,
        "short_name",
        short_name);
        finalHtml += html;
      }

      finalHtml += "</section>";
      return finalHtml;
    }


    function buildAndShowMenuItemsHTML (categoryMenuItems){
      //load title snippet of menu items page
      $ajaxUtils.sendGetRequest(
        menuItemsTitleHtml,
        function (menuItemsTitleHtml){
          //retrieve single menu item snippet
          $ajaxUtils.sendGetRequest(
            menuItemHtml,
            function (menuItemHtml){
              var menuItemsViewHtml = buildMenuItemsViewHTML(
                categoryMenuItems,menuItemsTitleHtml,menuItemHtml
              );
              insertHtml("#main-content", menuItemsViewHtml);
            },
          false);
        },
      false);
    }
      

    function buildMenuItemsViewHTML(
      categoryMenuItems,menuItemsTitleHtml,menuItemHtml
    ){
      // console.log(categoryMenuItems.menu_items);
      // console.log(categoryMenuItems.menu_Items[0].name);
      menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,"name",categoryMenuItems.category.name);
      
      menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,"special_instructions",categoryMenuItems.category.special_instructions);
      var finalHtml = menuItemsTitleHtml;
      finalHtml += "<section class='row'>";

      //loop over categories

      var menuItems = categoryMenuItems.menu_items;
      var catShortName = categoryMenuItems.category.short_name;
      for (var i = 0 ; i < menuItems.length; i++){
        //insert menu item values
        var html = menuItemHtml;
        html = insertProperty(html,"short_name",menuItems[i].short_name);
        html = insertProperty(html,"catShortName",catShortName);
        html = insertItemPrice(html,"price_small",menuItems[i].price_small);
        // html = insertItemPortionName(html,"small_portion_name",menuItems[i].small_portion_name);
//         console.log(portionValue);
        html = insertItemPrice(html,"price_large",menuItems[i].price_large);
        // html = insertItemPortionName(html,"large_portion_name",menuItems[i].large_portion_name);
        html = insertProperty(html,"name",menuItems[i].name);
        html = insertProperty(html,"description",menuItems[i].description);

        //add clear fix after every second menu item

        if (i % 2 != 0){
          html += "<div class='clearfix visible-lg-block visible-md-block'></div>"
        }

        finalHtml += html;

      }

      finalHtml += "</section>";
      return finalHtml;

    }


    // appends price with "$" if price exists
    function insertItemPrice(html,pricePropName,priceValue){
      if (!priceValue){
        return insertProperty(html,pricePropName,"");
      }
      priceValue = "$" + priceValue.toFixed(2);
      html = insertProperty(html,pricePropName,priceValue);
      return html;
    }

    // appends portion name in parens 
    // function insertItemPortionName(html,portionPropName,portionValue) {
    //   if (!portionValue){
    //     return insertProperty(html,portionPropName,"");
    //   }
    //   html = insertProperty(html,portionPropName);
    //   return html;
    // }
    





global.$dc = dc;


})(window);
