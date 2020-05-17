var fs = require("fs");

function parse() {
  var qtxt = fs.readFileSync("./questions_ger.txt").toString().split("\n");
  var catalog = []
  for (let i = 0; i < qtxt.length; i++) {
    var question = "";
    var answer = "";
    var phrase = qtxt[i];

    if (phrase.length > 0) {
      var sc = false;
      for (let j = 0; j < phrase.length; j++) {
        if(phrase[j] == '#') {
          sc = true;
        } else {
          if(sc) {
            answer += phrase.charAt(j);
          } else {
            question += phrase.charAt(j);
          }
        }
      }
      if(sc) {
        catalog.push({q: question, a: answer.replace("\r", "")});
      }
    }
  }
  fs.writeFileSync('./catalog.json', JSON.stringify(catalog, null, 2) , 'utf-8');
}
parse();
