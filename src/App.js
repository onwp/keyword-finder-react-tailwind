import { useState } from "react";
import $ from "jquery";
import "./App.css";
function App() {
  const [results, updateResults] = useState({ __html: "" });
  const [searchValue, setSearchValue] = useState();
  const GetRelatedTerms = (keyword, site, callback) => {
    if (keyword !== "") {
      var querykeyword = keyword;
      var website = site;
      if (website === "bing") {
        console.log("bing");
        $.ajax({
          url:
            "https://api.bing.com/osjson.aspx?JsonType=callback&JsonCallback=?",
          jsonp: "jsonp",
          dataType: "jsonp",
          data: {
            Query: querykeyword,
            Market: "en-us",
          },
          success: callback,
        });
      }
      if (website === "google") {
        console.log("google");
        $.ajax({
          url: "https://suggestqueries.google.com/complete/search",
          jsonp: "jsonp",
          dataType: "jsonp",
          data: {
            q: querykeyword,
            client: "chrome",
          },
          success: callback,
        });
      }
      if (website === "youtube") {
        console.log("youtube");
        $.ajax({
          url: "https://suggestqueries.google.com/complete/search",
          jsonp: "jsonp",
          dataType: "jsonp",
          data: {
            q: querykeyword,
            client: "chrome",
            ds: "yt",
          },
          success: callback,
        });
      }
      if (website === "yahoo") {
        console.log("yahoo");
        $.ajax({
          url: "https://search.yahoo.com/sugg/gossip/gossip-us-ura/",
          dataType: "jsonp",
          data: {
            command: querykeyword,
            nresults: "20",
            output: "jsonp",
          },
          success: callback,
        });
      }
      if (website === "ebay") {
        console.log("ebay");
        $.ajax({
          url: "https://autosug.ebay.com/autosug",
          dataType: "jsonp",
          data: {
            kwd: querykeyword,
            v: "jsonp",
            _dg: "1",
            sId: "0",
          },
          xhrFields: {
            withCredentials: true
          },
          success: callback,
        });
      }
    }
  };
  const FilterHtmlEntities = (input) => {
    var val = input;
    // val = val.replace("\\u003cb\\u003e", "");
    // val = val.replace("\\u003c\\/b\\u003e", "");
    // val = val.replace("\\u003c\\/b\\u003e", "");
    // val = val.replace("\\u003cb\\u003e", "");
    // val = val.replace("\\u003c\\/b\\u003e", "");
    // val = val.replace("\\u003cb\\u003e", "");
    // val = val.replace("\\u003cb\\u003e", "");
    // val = val.replace("\\u003c\\/b\\u003e", "");
    // val = val.replace("\\u0026amp;", "&");
    // val = val.replace("\\u003cb\\u003e", "");
    // val = val.replace("\\u0026", "");
    // val = val.replace("\\u0026#39;", "'");
    // val = val.replace("#39;", "'");
    // val = val.replace("\\u003c\\/b\\u003e", "");
    // val = val.replace("\\u2013", "2013");
    if (val.length > 4 && val.substring(0, 4) === "http") val = "";
    return val;
  };
  const ChangeHandler = (e) => {
    var searchTerm = e.target.value;
    console.log(searchTerm);
    setSearchValue(searchTerm);
    var html = "";
    html += `
  <table className="results_table" cellspacing="0" cellpadding="5" border="0" align="center">
  <tbody><tr className="odd-row">
  <th width="16%" align="left">Google</th>
  <th width="16%" align="left">Yahoo</th>
  <th width="16%" align="left">Bing</th>
  <th width="16%" align="left">Youtube</th>
  </tr>
     <tr><td id="google"></td><td id="yahoo"></td><td id="bing"></td><td id="youtube"></td></tr>
    </tbody></table>`;
    if (searchTerm === "") {
      html = `
      <table style="display:none" className="results_table hidden" cellspacing="0" cellpadding="5" border="0" align="center">
      <tbody className="hidden">
         <tr className="hidden"><td id="google"></td><td id="yahoo"></td><td id="bing"></td><td id="youtube"></td></tr>
        </tbody></table>`;
      updateResults({ __html: html });
    } else {
      updateResults({ __html: html });
      GetRelatedTerms(searchTerm, "google", function (res) {
        var retList = res[1];
        var i = 0;
        var sb = "";
        for (i = 0; i < retList.length; i++) {
          sb =
            sb +
            '<a href="https://www.google.com/search?q=' +
            encodeURIComponent(FilterHtmlEntities(retList[i])) +
            '" target="_blank" className="live">' +
            FilterHtmlEntities(retList[i]) +
            "</a><br />";
        }
        document.getElementById("google").innerHTML = "";
        document.getElementById("google").innerHTML = sb;
      });
      GetRelatedTerms(searchTerm, "yahoo", function (res) {
        var sb = "";
        $.each(res.gossip.results, function (i, val) {
          sb =
            sb +
            '<a href="https://search.yahoo.com/search?p=' +
            encodeURIComponent(FilterHtmlEntities(val.key)) +
            '" target="_blank" className="live">' +
            FilterHtmlEntities(val.key) +
            "</a><br />";
        });
        document.getElementById("yahoo").innerHTML = "";
        document.getElementById("yahoo").innerHTML = sb;
      });
      GetRelatedTerms(searchTerm, "bing", function (res) {
        var retList = res[1];
        var i = 0;
        var sb = "";
        for (i = 0; i < retList.length; i++) {
          sb =
            sb +
            '<a href="http://www.bing.com/search?q=' +
            encodeURIComponent(FilterHtmlEntities(retList[i])) +
            '" target="_blank" className="live">' +
            FilterHtmlEntities(retList[i]) +
            "</a><br />";
        }
        document.getElementById("bing").innerHTML = "";
        document.getElementById("bing").innerHTML = sb;
      });
      GetRelatedTerms(searchTerm, "youtube", function (res) {
        var retList = res[1];
        var i = 0;
        var sb = "";
        for (i = 0; i < retList.length; i++) {
          sb =
            sb +
            '<a href="https://www.youtube.com/results?search_query=' +
            encodeURIComponent(FilterHtmlEntities(retList[i])) +
            '" target="_blank" className="live">' +
            FilterHtmlEntities(retList[i]) +
            "</a><br />";
        }
        document.getElementById("youtube").innerHTML = "";
        document.getElementById("youtube").innerHTML = sb;
      });
    }
  };
  return (
    <div className="bg-indigo-200">
      <section className="App h-screen w-full flex justify-center items-center">
        <div className="w-full bg-white shadow-md rounded px-8 py-8 pt-8">
          <h1 className="text-2xl mb-7">Keyword Finder</h1>
          <p className="mb-5">
            A real-time keyword finder shows related terms based on your search
          </p>
          <form action="">
            <input
              type="text"
              name="search"
              className="border-2 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 focus:shadow"
              placeholder="What are you looking for..."
              autoFocus="autofocus"
              onChange={ChangeHandler}
              value={searchValue || ""}
            />
          </form>
          <div className="results" dangerouslySetInnerHTML={results}></div>
        </div>
      </section>
    </div>
  );
}
export default App;
