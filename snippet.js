/* Her legger jeg snippets som er kule å lime inn i browser */



function filterPaaNote(val) {
  console.log("nb val must be regexp");
  val = val || /.+/;
  Array.prototype.flatMap = function(fn) {return  this.reduce((acc, x) => acc.concat(fn(x)), [])}

  return Array.from(document.querySelectorAll(".shortcut_navigable"))
    .filter(f => f.querySelector(".notes_text").textContent.match(val) !== null);

}
