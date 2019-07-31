var find = require("find-js");
find(document, ".label_and_cat")
  .filter(txt => txt.innerText.match(/(DOL)|(WaxTime)|(DOXY)|(Jazz Wax)|(Waxtime In Color)/))
  .map(unwanted => {
      unwanted.style.backgroundColor = "#e28080";
      unwanted.style.borderRadius = "5px";
      unwanted.style.border = "1px solid #773636";

      return unwanted
    });
